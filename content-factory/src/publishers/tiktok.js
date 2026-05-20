import axios from 'axios';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import FormData from 'form-data';
import config from '../config.js';
import logger from '../logger.js';

/**
 * TikTok Publisher — Publishes videos via the TikTok Content Posting API.
 * Includes automatic token refresh when tokens expire (~24h lifespan).
 *
 * Uses the TikTok Content Posting API (Direct Post).
 * Docs: https://developers.tiktok.com/doc/content-posting-api-get-started
 */
class TikTokPublisher {
  constructor() {
    this.accessToken = config.TIKTOK_ACCESS_TOKEN;
    this.openId = config.TIKTOK_OPEN_ID;
    this.refreshToken = config.TIKTOK_REFRESH_TOKEN || '';
    this.clientKey = config.TIKTOK_CLIENT_KEY;
    this.clientSecret = config.TIKTOK_CLIENT_SECRET;
    this.apiBase = 'https://open.tiktokapis.com/v2';
  }

  isConfigured() {
    return !!(this.accessToken && this.openId);
  }

  /**
   * Refresh the access token using refresh_token
   */
  async _refreshAccessToken() {
    if (!this.refreshToken || !this.clientKey || !this.clientSecret) {
      logger.warn('TikTok refresh token not available — cannot auto-refresh');
      return false;
    }

    try {
      logger.info('TikTok: Refreshing access token...');
      const res = await axios.post(
        'https://open.tiktokapis.com/v2/oauth/token/',
        new URLSearchParams({
          client_key: this.clientKey,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken
        }).toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 15000
        }
      );

      const { access_token, refresh_token, open_id } = res.data;

      if (!access_token) {
        logger.error('TikTok token refresh returned no access_token', { data: res.data });
        return false;
      }

      // Update in memory
      this.accessToken = access_token;
      if (refresh_token) this.refreshToken = refresh_token;
      if (open_id) this.openId = open_id;

      // Update .env file
      try {
        const envPath = join(config.ROOT_DIR, '.env');
        let envContent = readFileSync(envPath, 'utf-8');
        envContent = envContent.replace(/TIKTOK_ACCESS_TOKEN=.*/, `TIKTOK_ACCESS_TOKEN=${access_token}`);
        if (refresh_token) {
          envContent = envContent.replace(/TIKTOK_REFRESH_TOKEN=.*/, `TIKTOK_REFRESH_TOKEN=${refresh_token}`);
        }
        if (open_id) {
          envContent = envContent.replace(/TIKTOK_OPEN_ID=.*/, `TIKTOK_OPEN_ID=${open_id}`);
        }
        writeFileSync(envPath, envContent);
        logger.info('TikTok: Tokens refreshed and saved to .env');
      } catch (envErr) {
        logger.warn('TikTok: Token refreshed in memory but failed to update .env', { error: envErr.message });
      }

      return true;
    } catch (error) {
      logger.error('TikTok token refresh failed', {
        error: error.response?.data || error.message
      });
      return false;
    }
  }

  /**
   * Publish a video to TikTok via Direct Post
   * @param {string} videoPath - Local path to video file
   * @param {string} caption - Video description/caption
   * @returns {string} Publish ID
   */
  async publishVideo(videoPath, caption) {
    if (!this.isConfigured()) {
      logger.warn('TikTok not configured — skipping publish');
      return null;
    }

    try {
      // Step 1: Query creator info (required before posting)
      let creatorInfo;
      try {
        creatorInfo = await this._getCreatorInfo();
      } catch (err) {
        const errorData = err.response?.data || {};
        const isExpired = err.response?.status === 401 || 
                         errorData.error?.code === 'access_token_invalid' ||
                         errorData.error?.code === 'token_expired';
        
        if (isExpired) {
          logger.info('TikTok token looks expired, attempting refresh...');
          const refreshed = await this._refreshAccessToken();
          if (!refreshed) {
            // If refresh fails, try to proceed with current token as a last resort
            logger.warn('TikTok refresh failed, attempting to proceed with current token anyway...');
          }
          creatorInfo = await this._getCreatorInfo();
        } else {
          throw err;
        }
      }

      logger.info('TikTok: Creator info retrieved', {
        maxDuration: creatorInfo.max_video_post_duration_sec
      });

      // Step 2: Initialize upload
      const videoBuffer = readFileSync(videoPath);
      const videoSize = videoBuffer.length;

      const initResponse = await axios.post(
        `${this.apiBase}/post/publish/video/init/`,
        {
          post_info: {
            title: caption.substring(0, 150),
            privacy_level: 'SELF_ONLY', // Obligatorio mientras la app esté 'In Review'
            disable_duet: false,
            disable_comment: false,
            disable_stitch: false
          },
          source_info: {
            source: 'FILE_UPLOAD',
            video_size: videoSize,
            chunk_size: videoSize,
            total_chunk_count: 1
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const { upload_url, publish_id } = initResponse.data.data;

      // Step 3: Upload video binary
      await axios.put(upload_url, videoBuffer, {
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Range': `bytes 0-${videoSize - 1}/${videoSize}`
        },
        timeout: 120000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      logger.info(`TikTok: Video uploaded! Publish ID: ${publish_id}`);

      // Step 4: Check publish status
      await this._checkStatus(publish_id);

      return publish_id;

    } catch (error) {
      logger.error('TikTok publish failed', {
        error: error.response?.data || error.message
      });
      throw error;
    }
  }

  async _getCreatorInfo() {
    const res = await axios.post(
      `${this.apiBase}/post/publish/creator_info/query/`,
      {},
      {
        headers: { 'Authorization': `Bearer ${this.accessToken}` },
        timeout: 10000
      }
    );
    return res.data.data;
  }

  async _checkStatus(publishId, maxAttempts = 10) {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, 5000));
      try {
        const res = await axios.post(
          `${this.apiBase}/post/publish/status/fetch/`,
          { publish_id: publishId },
          {
            headers: { 'Authorization': `Bearer ${this.accessToken}` },
            timeout: 10000
          }
        );
        const status = res.data.data?.status;
        logger.debug(`TikTok publish status: ${status}`);
        if (status === 'PUBLISH_COMPLETE') return true;
        if (status === 'FAILED') throw new Error('TikTok publish failed');
      } catch (err) {
        if (i === maxAttempts - 1) throw err;
      }
    }
  }
}

const tiktokPublisher = new TikTokPublisher();
export default tiktokPublisher;
