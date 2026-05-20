import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, unlinkSync, readdirSync, renameSync } from 'fs';
import { join } from 'path';
import config from '../config.js';
import logger from '../logger.js';

try { mkdirSync(config.VIDEOS_DIR, { recursive: true }); } catch {}

/**
 * Video Generator — Creates slideshow-style videos using ffmpeg (FREE).
 * Combines AI-generated images + text overlays + transitions + background music.
 * Perfect for TikTok and YouTube Shorts.
 * Replaces the D-ID/Synthesia dependency entirely.
 */
class VideoGenerator {
  constructor() {
    this._checkFfmpeg();
  }

  _checkFfmpeg() {
    try {
      execSync('ffmpeg -version', { stdio: 'pipe' });
      this.ffmpegAvailable = true;
    } catch {
      logger.warn('ffmpeg not found in PATH — video generation will be disabled');
      logger.warn('Install ffmpeg: https://ffmpeg.org/download.html');
      this.ffmpegAvailable = false;
    }
  }

  _getAudioDuration(audioPath) {
    if (!audioPath) return null;
    try {
      const output = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`, { stdio: 'pipe' }).toString().trim();
      const duration = parseFloat(output);
      return isNaN(duration) ? null : duration;
    } catch (e) {
      logger.warn(`Failed to get audio duration for ${audioPath}: ${e.message}`);
      return null;
    }
  }

  /**
   * Generate a slideshow video from images and text overlays
   * @param {Object} options
   * @param {string[]} options.imagePaths - Paths to images (1-4 images)
   * @param {string[]} options.overlayTexts - Text to overlay on each slide
   * @param {string} options.postId - Unique identifier
   * @param {number} options.slideDuration - Seconds per slide (default: 3)
   * @param {string} options.format - 'vertical' (9:16) or 'square' (1:1)
   * @param {string} [options.audioPath] - Optional path to voiceover MP3
   * @param {string} [options.bgVideoPath] - Optional path to raw B-Roll MP4
   * @returns {string} Path to output video file
   */
  async generate({ imagePaths, overlayTexts = [], postId, slideDuration = 3, format = 'vertical', audioPath = null, bgVideoPath = null }) {
    if (!this.ffmpegAvailable) {
      throw new Error('ffmpeg is not installed');
    }

    if (!bgVideoPath && (!imagePaths || imagePaths.length === 0)) {
      throw new Error('At least one image or a bgVideoPath is required');
    }

    const outputPath = join(config.VIDEOS_DIR, `${postId}.mp4`);
    const silentPath = join(config.VIDEOS_DIR, `${postId}_silent.mp4`);
    const size = format === 'vertical' ? '1080:1920' : '1080:1080';
    const [w, h] = size.split(':').map(Number);

    try {
      let duration = 60; // Max default duration, will be cut to TTS audio length via -shortest later
      let currentSlideDuration = slideDuration;

      // Sincronizar duración del video con el audio
      const audioDuration = this._getAudioDuration(audioPath);
      if (audioDuration) {
        duration = Math.ceil(audioDuration);
        if (imagePaths && imagePaths.length > 1) {
          // Ajustar duración de cada slide para que el collage cubra todo el audio exacto
          currentSlideDuration = audioDuration / imagePaths.length;
        }
      }

      if (bgVideoPath) {
        // Real B-Roll video
        await this._brollVideo(bgVideoPath, overlayTexts, silentPath, w, h, duration);
      } else if (imagePaths && imagePaths.length === 1) {
        // Ken Burns effect video
        await this._kenBurnsVideo(imagePaths[0], overlayTexts, silentPath, w, h, duration);
      } else if (imagePaths && imagePaths.length > 1) {
        // Slideshow video
        await this._slideshowVideo(imagePaths, overlayTexts, silentPath, w, h, currentSlideDuration);
      } else {
        throw new Error('No bgVideoPath or imagePaths provided');
      }

      // Mix Audio
      const bgMusicPath = this._getBackgroundMusic();
      if (audioPath || bgMusicPath) {
        return await this._mixAudio(silentPath, audioPath, bgMusicPath, outputPath, duration);
      } else {
        // Rename silent to output if no audio
        renameSync(silentPath, outputPath);
        return outputPath;
      }

    } catch (error) {
      logger.error('Video generation failed', { error: error.message, postId });
      throw error;
    }
  }

  /**
   * Ken Burns effect on a single image (zoom + pan)
   */
  async _kenBurnsVideo(imagePath, overlayTexts, outputPath, w, h, duration) {
    // Build text overlay filter
    const textFilters = this._buildTextFilters(overlayTexts, duration, w, h);

    const filterComplex = [
      // Scale image larger than output for zoom room
      `[0:v]scale=${w * 2}:${h * 2},`,
      // Slow zoom in effect
      `zoompan=z='min(zoom+0.0008,1.3)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${duration * 30}:s=${w}x${h}:fps=30,`,
      // Apply text overlays
      `format=yuv420p${textFilters}`
    ].join('');

    const cmd = [
      'ffmpeg -y',
      `-loop 1 -i "${imagePath}"`,
      `-filter_complex "${filterComplex}"`,
      `-t ${duration}`,
      `-c:v libx264 -preset ultrafast -crf 28`,
      `-pix_fmt yuv420p`,
      `"${outputPath}"`
    ].join(' ');

    execSync(cmd, { stdio: 'pipe', timeout: 600000 });
    logger.info(`Ken Burns video created`, { outputPath, duration });
    return outputPath;
  }

  /**
   * Slideshow with multiple images and crossfade
   */
  async _slideshowVideo(imagePaths, overlayTexts, outputPath, w, h, slideDuration) {
    // Create a concat file for ffmpeg
    const concatFile = join(config.VIDEOS_DIR, `concat_${Date.now()}.txt`);
    const entries = imagePaths.map(p => `file '${p.replace(/\\/g, '/')}'\nduration ${slideDuration}`);
    // Add last image again (ffmpeg concat needs it)
    entries.push(`file '${imagePaths[imagePaths.length - 1].replace(/\\/g, '/')}'`);
    writeFileSync(concatFile, entries.join('\n'));

    const totalDuration = imagePaths.length * slideDuration;
    const textFilters = this._buildTextFilters(overlayTexts, totalDuration, w, h);

    const cmd = [
      'ffmpeg -y',
      `-f concat -safe 0 -i "${concatFile}"`,
      `-vf "scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2:black,format=yuv420p${textFilters}"`,
      `-c:v libx264 -preset ultrafast -crf 28`,
      `-pix_fmt yuv420p`,
      `-t ${totalDuration}`,
      `"${outputPath}"`
    ].join(' ');

    try {
      execSync(cmd, { stdio: 'pipe', timeout: 600000 });
    } finally {
      // Clean up concat file
      try { unlinkSync(concatFile); } catch {}
    }

    logger.info(`Slideshow video created`, { outputPath, slides: imagePaths.length, duration: totalDuration });
    return outputPath;
  }

  /**
   * B-Roll video (looping a stock video)
   */
  async _brollVideo(bgVideoPath, overlayTexts, outputPath, w, h, duration) {
    const textFilters = this._buildTextFilters(overlayTexts, duration, w, h);

    const cmd = [
      'ffmpeg -y',
      `-stream_loop -1`,
      `-i "${bgVideoPath}"`,
      `-t ${duration}`,
      `-vf "scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},format=yuv420p${textFilters}"`,
      `-c:v libx264 -preset ultrafast -crf 28`,
      `-pix_fmt yuv420p`,
      `"${outputPath}"`
    ].join(' ');

    execSync(cmd, { stdio: 'pipe', timeout: 600000 });
    logger.info(`B-Roll video created`, { outputPath });
    try { unlinkSync(bgVideoPath); } catch {} // Clean up raw downloaded video
    return outputPath;
  }

  /**
   * Build ffmpeg text overlay filters for sequential text display
   */
  _buildTextFilters(texts, totalDuration, w, h) {
    if (!texts || texts.length === 0) return '';

    const segmentDuration = totalDuration / texts.length;
    // Use local font to avoid Windows absolute path issues in ffmpeg
    const fontfile = 'assets/fonts/arial.ttf';

    return texts.map((text, i) => {
      const start = i * segmentDuration;
      const end = start + segmentDuration;
      // Escape special characters for ffmpeg
      const escaped = text.replace(/'/g, "'\\''").replace(/:/g, '\\:').replace(/\\/g, '\\\\');

      return `,drawtext=fontfile='${fontfile}':text='${escaped}':fontsize=52:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=20:x=(w-text_w)/2:y=h-h/4:enable='between(t,${start},${end})'`;
    }).join('');
  }

  /**
   * Get random background music from assets/music
   */
  _getBackgroundMusic() {
    const musicDir = join(config.ROOT_DIR, 'assets', 'music');
    try {
      if (!existsSync(musicDir)) mkdirSync(musicDir, { recursive: true });
      const files = readdirSync(musicDir).filter(f => f.toLowerCase().endsWith('.mp3'));
      if (files.length > 0) {
        const track = files[Math.floor(Math.random() * files.length)];
        return join(musicDir, track);
      }
    } catch (e) {}
    return null;
  }

  /**
   * Mix silent video with TTS and Background Music
   */
  async _mixAudio(silentPath, audioPath, bgMusicPath, outputPath, duration) {
    logger.info('Mixing audio tracks into video...');
    let cmd = '';
    
    if (audioPath && bgMusicPath) {
      cmd = `ffmpeg -y -i "${silentPath}" -i "${audioPath}" -stream_loop -1 -i "${bgMusicPath}" ` +
            `-filter_complex "[2:a]volume=0.08[bg];[1:a][bg]amix=inputs=2:duration=first[aout]" ` +
            `-map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 128k -shortest "${outputPath}"`;
    } else if (audioPath) {
      cmd = `ffmpeg -y -i "${silentPath}" -i "${audioPath}" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest "${outputPath}"`;
    } else if (bgMusicPath) {
      cmd = `ffmpeg -y -i "${silentPath}" -stream_loop -1 -i "${bgMusicPath}" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest "${outputPath}"`;
    }

    try {
      execSync(cmd, { stdio: 'pipe', timeout: 300000 });
      try { unlinkSync(silentPath); } catch {}
      return outputPath;
    } catch (error) {
      logger.error('Audio mix failed, returning silent video', { error: error.message });
      renameSync(silentPath, outputPath);
      return outputPath;
    }
  }
}

const videoGenerator = new VideoGenerator();
export default videoGenerator;
