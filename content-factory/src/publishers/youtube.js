import axios from 'axios';
import { readFileSync, createReadStream } from 'fs';
import config from '../config.js';
import logger from '../logger.js';

/**
 * YouTube Publisher — Uploads YouTube Shorts via the Data API v3.
 * Stub ready for when the YouTube channel and Google Cloud project are set up.
 *
 * Setup requirements:
 * 1. Google Cloud Console → Enable YouTube Data API v3
 * 2. Create OAuth2 credentials (Desktop app)
 * 3. Run initial auth flow to get refresh token
 * 4. Store refresh token in .env
 */
class YouTubePublisher {
  constructor() {
    this.clientId = config.YOUTUBE_CLIENT_ID;
    this.clientSecret = config.YOUTUBE_CLIENT_SECRET;
    this.refreshToken = config.YOUTUBE_REFRESH_TOKEN;
    this.accessToken = null;
    this.tokenExpiry = 0;
  }

  isConfigured() {
    return !!(this.clientId && this.clientSecret && this.refreshToken);
  }

  /**
   * Get a fresh access token using refresh token
   */
  async _getAccessToken() {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const res = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token'
    });

    this.accessToken = res.data.access_token;
    this.tokenExpiry = Date.now() + (res.data.expires_in - 60) * 1000;
    return this.accessToken;
  }

  /**
   * Upload a YouTube Short
   * @param {string} videoPath - Local path to video file
   * @param {string} title - Video title (max 100 chars)
   * @param {string} description - Video description
   * @param {string[]} tags - Video tags
   * @returns {string} YouTube video ID
   */
  async publishShort(videoPath, title, description, tags = [], creds = null) {
    // If per-user creds provided, use them; otherwise use default
    const hasUserCreds = creds?.youtube_refresh_token && creds?.youtube_client_id && creds?.youtube_client_secret;
    if (!this.isConfigured() && !hasUserCreds) {
      logger.warn('YouTube not configured — skipping publish');
      return null;
    }

    try {
      let token;
      if (hasUserCreds) {
        const res = await axios.post('https://oauth2.googleapis.com/token', {
          client_id: creds.youtube_client_id,
          client_secret: creds.youtube_client_secret,
          refresh_token: creds.youtube_refresh_token,
          grant_type: 'refresh_token'
        });
        token = res.data.access_token;
      } else {
        token = await this._getAccessToken();
      }
      const videoBuffer = readFileSync(videoPath);

      // Ensure title including '#Shorts' does not exceed 100 characters
      let cleanTitle = title || 'Video Corto';
      if (cleanTitle.length > 90) {
        cleanTitle = cleanTitle.substring(0, 90);
      }
      const finalTitle = `${cleanTitle} #Shorts`;

      // Step 1: Start resumable upload
      const initRes = await axios.post(
        'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
        {
          snippet: {
            title: finalTitle,
            description: `${description}\n\n${config.BRAND_NAME} — ${config.BRAND_TAGLINE}\n${config.BRAND_URL}`,
            tags: [...tags, 'Shorts', 'AI', 'Automation', config.BRAND_NAME],
            categoryId: '28', // Science & Technology
            defaultLanguage: 'es'
          },
          status: {
            privacyStatus: 'public',
            selfDeclaredMadeForKids: false,
            embeddable: true
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Upload-Content-Type': 'video/mp4',
            'X-Upload-Content-Length': videoBuffer.length
          },
          timeout: 30000
        }
      );

      const uploadUrl = initRes.headers.location;

      // Step 2: Upload video data
      const uploadRes = await axios.put(uploadUrl, videoBuffer, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'video/mp4'
        },
        timeout: 300000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      const videoId = uploadRes.data.id;
      logger.info(`YouTube: Short uploaded! Video ID: ${videoId}`);
      logger.info(`YouTube: URL: https://youtube.com/shorts/${videoId}`);

      return videoId;

    } catch (error) {
      logger.error('YouTube upload failed', {
        error: error.response?.data?.error?.message || error.message
      });
      throw error;
    }
  }
}

const youtubePublisher = new YouTubePublisher();
export default youtubePublisher;
