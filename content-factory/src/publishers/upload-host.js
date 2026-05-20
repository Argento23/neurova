import axios from 'axios';
import { readFileSync } from 'fs';
import { basename } from 'path';
import config from '../config.js';
import logger from '../logger.js';

/**
 * Upload Host — Hosts images temporarily on ImgBB (free) so that
 * Instagram Graph API can access them via public URL.
 *
 * ImgBB free tier: unlimited uploads, images stored for 6 months.
 * Get API key at: https://api.imgbb.com/
 *
 * For videos: serves them via the dashboard Express server
 * and returns the public URL using PUBLIC_URL config.
 */
class UploadHost {
  constructor() {
    this.apiKey = config.IMGBB_API_KEY;
  }

  isConfigured() {
    return !!this.apiKey;
  }

  /**
   * Upload a local image file and get a public URL
   * @param {string} imagePath - Local path to image
   * @returns {string} Public URL of the uploaded image
   */
  async upload(imagePath) {
    if (!this.isConfigured()) {
      throw new Error('IMGBB_API_KEY not configured — required for Instagram publishing');
    }

    try {
      const imageBuffer = readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');

      // Use POST body (not query params) to avoid 414 URI Too Long
      const formData = new URLSearchParams();
      formData.append('key', this.apiKey);
      formData.append('image', base64Image);
      formData.append('expiration', '604800'); // 7 days

      const response = await axios.post('https://api.imgbb.com/1/upload', formData.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      const url = response.data.data.url;
      logger.info(`Image uploaded to ImgBB`, { url: url.substring(0, 60) });
      return url;

    } catch (error) {
      logger.error('ImgBB upload failed', {
        error: error.response?.data?.error?.message || error.message
      });
      throw error;
    }
  }

  /**
   * Get public URL for a local video file (served by our Express dashboard)
   * @param {string} videoPath - Local path to video file
   * @returns {string} Public URL of the video
   */
  getVideoUrl(videoPath) {
    const filename = basename(videoPath);
    const url = `${config.PUBLIC_URL}/media/videos/${filename}`;
    logger.info(`Video URL generated`, { url });
    return url;
  }

  /**
   * Upload multiple images
   * @param {string[]} imagePaths
   * @returns {string[]} Array of public URLs
   */
  async uploadMultiple(imagePaths) {
    const urls = [];
    for (const path of imagePaths) {
      const url = await this.upload(path);
      urls.push(url);
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 1000));
    }
    return urls;
  }
}

const uploadHost = new UploadHost();
export default uploadHost;
