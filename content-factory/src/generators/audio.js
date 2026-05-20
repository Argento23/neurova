import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import config from '../config.js';
import logger from '../logger.js';

// Ensure audio directory exists
const AUDIO_DIR = join(config.OUTPUT_DIR, 'audio');
try { mkdirSync(AUDIO_DIR, { recursive: true }); } catch {}

class AudioGenerator {
  /**
   * Generate VoiceOver (TTS) from text and save as MP3
   * @param {string} text - Text to synthesize
   * @param {string} postId - Unique post identifier
   * @param {string} language - 'es' or 'en'
   * @returns {string} Path to the generated MP3 file
   */
  async generateVoiceOver(text, postId, language = 'es') {
    const outputPath = join(AUDIO_DIR, `${postId}_tts.mp3`);
    // Microsoft Edge TTS Neural Voices (Male)
    const voice = language === 'en' ? 'en-US-ChristopherNeural' : 'es-MX-JorgeNeural';

    logger.info(`Generating Edge TTS VoiceOver for ${postId}`, { voice });

    try {
      // Clean and escape text for CLI, and fix robotic pronunciations
      const cleanText = text
        .replace(/"/g, "'")
        .replace(/\n/g, " ")
        .replace(/24\/7/g, "veinticuatro siete")
        .replace(/%/g, " por ciento ")
        .replace(/&/g, " y ");
      
      const cmd = `edge-tts --voice ${voice} --text "${cleanText}" --write-media "${outputPath}"`;
      execSync(cmd, { stdio: 'pipe', timeout: 60000 });

      if (!existsSync(outputPath)) {
        throw new Error('TTS file was not created by edge-tts');
      }

      logger.info(`✅ VoiceOver generated successfully`, { outputPath });
      return outputPath;
    } catch (error) {
      logger.error('Failed to generate VoiceOver', { error: error.message });
      throw error;
    }
  }
}

const audioGenerator = new AudioGenerator();
export default audioGenerator;
