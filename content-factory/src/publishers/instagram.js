import axios from 'axios';
import { readFileSync } from 'fs';
import config from '../config.js';
import logger from '../logger.js';

/**
 * Instagram Publisher — Publishes images and videos to Instagram Business
 * via the Graph API. Refactored from the existing publish_3_posts.js.
 */
class InstagramPublisher {
  constructor() {
    this.accessToken = config.IG_ACCESS_TOKEN;
    this.userId = config.IG_USER_ID;
    this.apiBase = 'https://graph.facebook.com/v19.0';
  }

  isConfigured() {
    return !!(this.accessToken && this.userId);
  }

  /**
   * Publish a single image post
   * @param {string} imageUrl - Public URL of the image
   * @param {string} caption - Post caption with hashtags
   * @returns {string} Published media ID
   */
  async publishImage(imageUrl, caption, creds = null) {
    const token = creds?.ig_access_token || this.accessToken;
    const uid = creds?.ig_user_id || this.userId;

    if (!token || !uid) {
      throw new Error('Instagram not configured — missing IG_ACCESS_TOKEN and IG_USER_ID');
    }

    // Step 1: Create media container
    logger.info(`IG: Creating media container for ${uid}...`);
    const containerResponse = await this._retryRequest(() => axios.post(`${this.apiBase}/${uid}/media`, {
      image_url: imageUrl,
      caption: caption,
      access_token: token
    }, { timeout: 60000 }));

    const containerId = containerResponse.data.id;
    logger.info(`IG: Container created: ${containerId}`);

    // Step 2: Wait for processing
    await this._waitForContainer(containerId, 40, token);

    // Step 3: Publish
    logger.info('IG: Publishing...');
    const publishResponse = await this._retryRequest(() => axios.post(`${this.apiBase}/${uid}/media_publish`, {
      creation_id: containerId,
      access_token: token
    }, { timeout: 60000 }));

    const mediaId = publishResponse.data.id;
    logger.info(`IG: Published! Media ID: ${mediaId}`);
    return mediaId;
  }

  /**
   * Publish a Reel (video)
   * @param {string} videoUrl - Public URL of the video
   * @param {string} caption - Post caption
   * @returns {string} Published media ID
   */
  async publishReel(videoUrl, caption, creds = null) {
    const token = creds?.ig_access_token || this.accessToken;
    const uid = creds?.ig_user_id || this.userId;

    if (!token || !uid) {
      throw new Error('Instagram not configured — missing IG_ACCESS_TOKEN and IG_USER_ID');
    }

    // Step 1: Create Reel container
    logger.info(`IG: Creating Reel container for ${uid}...`);
    const containerResponse = await this._retryRequest(() => axios.post(`${this.apiBase}/${uid}/media`, {
      video_url: videoUrl,
      caption: caption,
      media_type: 'REELS',
      access_token: token
    }, { timeout: 60000 }));

    const containerId = containerResponse.data.id;

    // Step 2: Wait (Reels take longer)
    await this._waitForContainer(containerId, 60, token);

    // Step 3: Publish
    const publishResponse = await this._retryRequest(() => axios.post(`${this.apiBase}/${uid}/media_publish`, {
      creation_id: containerId,
      access_token: token
    }, { timeout: 60000 }));

    const mediaId = publishResponse.data.id;
    logger.info(`IG: Reel Published! Media ID: ${mediaId}`);
    return mediaId;
  }

  /**
   * Publish a carousel (multiple images)
   * @param {string[]} imageUrls - Array of public image URLs
   * @param {string} caption - Post caption
   * @returns {string} Published media ID
   */
  async publishCarousel(imageUrls, caption) {
    if (!this.isConfigured()) throw new Error('Instagram not configured');

    // Step 1: Create child containers for each image
    const childIds = [];
    for (const url of imageUrls) {
      const res = await axios.post(`${this.apiBase}/${this.userId}/media`, {
        image_url: url,
        is_carousel_item: true,
        access_token: this.accessToken
      }, { timeout: 30000 });
      childIds.push(res.data.id);
      await this._sleep(2000);
    }

    // Step 2: Create carousel container
    const carouselRes = await axios.post(`${this.apiBase}/${this.userId}/media`, {
      media_type: 'CAROUSEL',
      children: childIds.join(','),
      caption: caption,
      access_token: this.accessToken
    }, { timeout: 30000 });

    const containerId = carouselRes.data.id;
    await this._waitForContainer(containerId);

    // Step 3: Publish
    const publishRes = await axios.post(`${this.apiBase}/${this.userId}/media_publish`, {
      creation_id: containerId,
      access_token: this.accessToken
    }, { timeout: 30000 });

    logger.info(`IG: Carousel Published! Media ID: ${publishRes.data.id}`);
    return publishRes.data.id;
  }

  /**
   * Check if the access token is still valid
   */
  async validateToken() {
    try {
      const res = await axios.get(`${this.apiBase}/me`, {
        params: { access_token: this.accessToken, fields: 'id,name' },
        timeout: 10000
      });
      return { valid: true, name: res.data.name, id: res.data.id };
    } catch (err) {
      return { valid: false, error: err.response?.data?.error?.message || err.message };
    }
  }

  async _retryRequest(fn, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (err) {
        const isTransient = err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT' ||
          err.code === 'ECONNRESET' || err.message?.includes('timeout');
        if (isTransient && i < retries - 1) {
          logger.warn(`IG: Transient error, retrying (${i + 1}/${retries})...`, { error: err.message });
          await this._sleep(5000 * (i + 1));
          continue;
        }
        throw err;
      }
    }
  }

  async _waitForContainer(containerId, maxAttempts = 40, tokenOverride = null) {
    const token = tokenOverride || this.accessToken;
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const res = await axios.get(`${this.apiBase}/${containerId}`, {
          params: { fields: 'status_code,status', access_token: token },
          timeout: 15000
        });

        const status = res.data.status_code;
        if (status === 'FINISHED') return true;
        if (status === 'ERROR') {
          const detail = res.data.status || 'unknown';
          throw new Error(`IG container processing error for ${containerId}: ${detail}`);
        }

        logger.debug(`IG: Container status: ${status} (attempt ${i + 1}/${maxAttempts})`);
      } catch (pollErr) {
        if (pollErr.message?.includes('processing error')) throw pollErr;
        logger.warn(`IG: Poll failed (attempt ${i + 1}), retrying...`, { error: pollErr.message });
      }
      await this._sleep(4000);
    }
    throw new Error(`IG container processing timeout for ${containerId}`);
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const instagramPublisher = new InstagramPublisher();

// CLI test mode
if (process.argv[1] && process.argv[1].includes('instagram.js')) {
  console.log('\n🧪 Testing Instagram Publisher...\n');
  instagramPublisher.validateToken().then(result => {
    if (result.valid) {
      console.log(`✅ Token válido! Cuenta: ${result.name} (${result.id})`);
    } else {
      console.log(`❌ Token inválido: ${result.error}`);
    }
  });
}

export default instagramPublisher;
