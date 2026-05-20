import axios from 'axios';
import config from '../config.js';
import logger from '../logger.js';

/**
 * Facebook Page Publisher — Publishes images, videos (Reels), and link posts
 * to a Facebook Page via the Graph API.
 *
 * Uses the SAME Page Access Token as Instagram (IG_ACCESS_TOKEN),
 * since both are managed via the Meta Graph API.
 */
class FacebookPublisher {
  constructor() {
    this.accessToken = config.IG_ACCESS_TOKEN; // Same Meta Page token
    this.pageId = config.FB_PAGE_ID || null;
    this.apiBase = 'https://graph.facebook.com/v19.0';
    this._initialized = false;
  }

  /**
   * Lazy-init: auto-detect Page ID from the token if not set in .env
   */
  async _ensurePageId() {
    try {
      logger.info('FB: Fetching Page Token and verifying Page ID...');
      const res = await axios.get(`${this.apiBase}/me/accounts`, {
        params: { access_token: this.accessToken, fields: 'id,name,access_token,tasks' },
        timeout: 10000
      });

      const pages = res.data?.data || [];
      const targetPageId = this.pageId || (pages.length > 0 ? pages[0].id : null);
      
      const targetPage = pages.find(p => p.id === targetPageId);

      if (targetPage) {
        this.pageId = targetPage.id;
        if (targetPage.access_token) {
          this.pageAccessToken = targetPage.access_token;
          logger.info(`FB: Using Page Token for "${targetPage.name}" (ID: ${this.pageId})`);
        } else {
          logger.warn(`FB: No Page Token returned for "${targetPage.name}", using User Token.`);
        }
      } else if (this.pageId) {
        logger.warn(`FB: Page ID ${this.pageId} not found in accounts, attempting to use User Token directly.`);
      } else {
        throw new Error('No pages found and no FB_PAGE_ID set.');
      }
    } catch (err) {
      logger.error('FB: Failed to auto-detect Page ID', { error: err.response?.data?.error?.message || err.message });
      throw new Error('Cannot determine Facebook Page ID — set FB_PAGE_ID in .env');
    }
  }

  _getToken(creds = null) {
    if (creds?.ig_access_token) return creds.ig_access_token;
    return this.pageAccessToken || this.accessToken;
  }

  _getPageId(creds = null) {
    if (creds?.fb_page_id) return creds.fb_page_id;
    return this.pageId;
  }

  isConfigured() {
    // We need at least the IG access token (which is a Meta Page token)
    return !!(this.accessToken);
  }

  /**
   * Publish a photo post to the Facebook Page
   * @param {string} imageUrl - Public URL of the image
   * @param {string} message - Post message/caption
   * @returns {string} Published post ID
   */
  async publishImage(imageUrl, message, creds = null) {
    if (!creds?.fb_page_id) await this._ensurePageId();

    const pageId = this._getPageId(creds);
    const token = this._getToken(creds);

    logger.info(`FB: Publishing image post to ${pageId}...`);
    const res = await axios.post(`${this.apiBase}/${pageId}/photos`, {
      url: imageUrl,
      message: message,
      access_token: token
    }, { timeout: 30000 });

    const postId = res.data.id || res.data.post_id;
    logger.info(`FB: Image published! Post ID: ${postId}`);
    return postId;
  }

  /**
   * Publish a video (Reel) to the Facebook Page
   * @param {string} videoUrl - Public URL of the video
   * @param {string} description - Video description/caption
   * @returns {string} Published video ID
   */
  async publishVideo(videoUrl, description, creds = null) {
    if (!creds?.fb_page_id) await this._ensurePageId();

    const pageId = this._getPageId(creds);
    const token = this._getToken(creds);

    logger.info(`FB: Uploading video to Page ${pageId}...`);

    // Step 1: Initialize upload
    const initRes = await axios.post(`${this.apiBase}/${pageId}/videos`, {
      file_url: videoUrl,
      description: description,
      access_token: token
    }, { timeout: 120000 }); // Videos can take longer

    const videoId = initRes.data.id;
    logger.info(`FB: Video published! Video ID: ${videoId}`);
    return videoId;
  }

  /**
   * Publish a Reel to the Facebook Page (similar to IG Reels)
   * @param {string} videoUrl - Public URL of the video
   * @param {string} description - Reel description
   * @returns {string} Published reel ID
   */
  async publishReel(videoUrl, description, creds = null) {
    if (!creds?.fb_page_id) await this._ensurePageId();

    const pageId = this._getPageId(creds);
    const token = this._getToken(creds);

    logger.info(`FB: Creating Reel for ${pageId}...`);

    try {
      // Try the Reels API first (newer)
      const initRes = await axios.post(`${this.apiBase}/${pageId}/video_reels`, {
        upload_phase: 'start',
        access_token: token
      }, { timeout: 30000 });

      const videoId = initRes.data.video_id;

      // Upload the video
      await axios.post(`${this.apiBase}/${videoId}`, {
        upload_phase: 'finish',
        video_file_url: videoUrl,
        description: description,
        access_token: token
      }, { timeout: 120000 });

      // Publish the reel
      const pubRes = await axios.post(`${this.apiBase}/${pageId}/video_reels`, {
        upload_phase: 'finish',
        video_id: videoId,
        description: description,
        access_token: token
      }, { timeout: 30000 });

      logger.info(`FB: Reel published! ID: ${pubRes.data.id || videoId}`);
      return pubRes.data.id || videoId;

    } catch (reelErr) {
      // Fallback: publish as a regular video if Reels API fails
      logger.warn('FB: Reels API failed, falling back to regular video upload', {
        error: reelErr.response?.data?.error?.message || reelErr.message
      });
      return this.publishVideo(videoUrl, description, creds);
    }
  }

  /**
   * Publish a text-only or link post
   * @param {string} message - Post text
   * @param {string} [link] - Optional URL to include
   * @returns {string} Published post ID
   */
  async publishText(message, link = null, creds = null) {
    if (!creds?.fb_page_id) await this._ensurePageId();

    const pageId = this._getPageId(creds);
    const token = this._getToken(creds);

    logger.info(`FB: Publishing text/link post to ${pageId}...`);
    const payload = {
      message: message,
      access_token: token
    };
    if (link) payload.link = link;

    const res = await axios.post(`${this.apiBase}/${pageId}/feed`, payload, {
      timeout: 30000
    });

    const postId = res.data.id;
    logger.info(`FB: Post published! ID: ${postId}`);
    return postId;
  }

  /**
   * Validate the access token and check Page permissions
   */
  async validateToken() {
    try {
      const res = await axios.get(`${this.apiBase}/me`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,name'
        },
        timeout: 10000
      });

      // Also check pages
      let pages = [];
      try {
        const pagesRes = await axios.get(`${this.apiBase}/me/accounts`, {
          params: {
            access_token: this.accessToken,
            fields: 'id,name,category'
          },
          timeout: 10000
        });
        pages = pagesRes.data?.data || [];
      } catch { /* user token without page access */ }

      return {
        valid: true,
        name: res.data.name,
        id: res.data.id,
        pages: pages.map(p => ({ id: p.id, name: p.name, category: p.category }))
      };
    } catch (err) {
      return {
        valid: false,
        error: err.response?.data?.error?.message || err.message
      };
    }
  }
}

const facebookPublisher = new FacebookPublisher();

// CLI test mode
if (process.argv[1] && process.argv[1].includes('facebook.js')) {
  console.log('\n🧪 Testing Facebook Page Publisher...\n');
  facebookPublisher.validateToken().then(result => {
    if (result.valid) {
      console.log(`✅ Token válido! Usuario: ${result.name} (${result.id})`);
      if (result.pages.length > 0) {
        console.log(`📄 Páginas accesibles:`);
        result.pages.forEach(p => console.log(`   → ${p.name} (${p.id}) [${p.category}]`));
      } else {
        console.log('⚠️  No se detectaron páginas (puede estar usando un Page Token directamente)');
      }
    } else {
      console.log(`❌ Token inválido: ${result.error}`);
    }
  });
}

export default facebookPublisher;
