import axios from 'axios';
import { createWriteStream, mkdirSync } from 'fs';
import { join } from 'path';
import config from '../config.js';
import logger from '../logger.js';

// Ensure videos directory exists
try { mkdirSync(config.VIDEOS_DIR, { recursive: true }); } catch {}

class PexelsGenerator {
  /**
   * Search for a vertical B-Roll video on Pexels and download it
   * @param {string} topic - The topic to search for (used as context)
   * @param {string} postId - Unique post identifier
   * @returns {Promise<string>} Path to the downloaded MP4 file
   */
  async generate(topic, postId) {
    if (!config.PEXELS_API_KEY) {
      throw new Error('PEXELS_API_KEY is not configured');
    }

    // Use generic but highly relevant tech/business keywords for better b-roll
    const keywords = ['technology', 'server room', 'office business', 'typing laptop', 'artificial intelligence', 'data center', 'city timelapse'];
    const query = keywords[Math.floor(Math.random() * keywords.length)];

    logger.info(`Searching Pexels for B-Roll video`, { query, postId });

    try {
      // 1. Search Pexels for vertical videos
      const searchRes = await axios.get('https://api.pexels.com/videos/search', {
        headers: { Authorization: config.PEXELS_API_KEY },
        params: {
          query: query,
          orientation: 'portrait',
          size: 'medium', // HD is usually around 10-30MB
          per_page: 15
        }
      });

      const videos = searchRes.data.videos;
      if (!videos || videos.length === 0) {
        throw new Error(`No vertical videos found for query: ${query}`);
      }

      // Pick a random video from the top results
      const video = videos[Math.floor(Math.random() * videos.length)];
      
      // Find the best MP4 file (prefer 1080p, avoid massive 4K files)
      const hdFiles = video.video_files.filter(f => f.file_type === 'video/mp4' && f.height <= 1080 && f.height >= 720);
      const fileToDownload = hdFiles.length > 0 ? hdFiles[0] : video.video_files[0];

      logger.info(`Downloading Pexels video`, { url: fileToDownload.link, quality: fileToDownload.quality });

      // 2. Download the MP4 file
      const outputPath = join(config.VIDEOS_DIR, `${postId}_raw_broll.mp4`);
      
      const downloadRes = await axios({
        method: 'GET',
        url: fileToDownload.link,
        responseType: 'stream'
      });

      return new Promise((resolve, reject) => {
        const writer = createWriteStream(outputPath);
        downloadRes.data.pipe(writer);
        let error = null;

        writer.on('error', err => {
          error = err;
          writer.close();
          reject(err);
        });

        writer.on('close', () => {
          if (!error) {
            logger.info(`✅ Pexels B-Roll downloaded successfully`, { outputPath });
            resolve(outputPath);
          }
        });
      });

    } catch (error) {
      logger.error('Failed to get video from Pexels', { error: error.response?.data || error.message });
      throw error;
    }
  }
}

export default new PexelsGenerator();
