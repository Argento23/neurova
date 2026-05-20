import axios from 'axios';
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join } from 'path';
import config from '../config.js';
import logger from '../logger.js';

// Ensure output directories exist
try { mkdirSync(config.IMAGES_DIR, { recursive: true }); } catch {}

/**
 * Image Generator — Multi-provider with automatic fallback chain:
 *   1. Pollinations AI (FREE, no key needed, Flux models)
 *   2. Together AI (if configured and has credits)
 *   3. Branded gradient fallback (always works)
 *
 * Post-processes all images with Sharp for resizing and watermark.
 * Replaces n8n's Leonardo AI integration.
 */
class ImageGenerator {
  constructor() {
    this.togetherKey = config.TOGETHER_API_KEY;
  }

  /**
   * Generate an image from a text prompt
   * @param {string} prompt - Image description
   * @param {string} postId - Unique post identifier for filename
   * @param {string} format - 'square' (1080x1080), 'story' (1080x1920), 'landscape' (1920x1080)
   * @returns {string} Path to generated image file
   */
  async generate(prompt, postId, format = 'square') {
    const enhancedPrompt = `${prompt}. Ultra high quality, professional social media graphic, 4K resolution, sharp details, vibrant colors on dark background, modern tech aesthetic, no text, no watermarks, no logos.`;

    // Try providers in order
    const providers = [
      () => this._pollinations(enhancedPrompt, postId, format),
      () => this._togetherAI(enhancedPrompt, postId, format),
    ];

    for (const provider of providers) {
      try {
        const result = await provider();
        if (result) return result;
      } catch (err) {
        logger.warn(`Provider failed, trying next...`, { error: err.message });
      }
    }

    // All providers failed — use branded fallback
    logger.warn(`All image providers failed for ${postId}, using fallback`);
    return await this._generateFallback(postId, format);
  }

  /**
   * Provider 1: Pollinations AI — 100% FREE, no API key needed
   * Uses Flux models via simple URL-based API
   * Docs: https://pollinations.ai/
   */
  async _pollinations(prompt, postId, format) {
    const sizes = {
      square: { width: 1024, height: 1024 },
      story: { width: 768, height: 1344 },
      landscape: { width: 1344, height: 768 }
    };
    const size = sizes[format] || sizes.square;

    logger.info(`Generating image via Pollinations AI`, { postId, format });

    // Pollinations uses URL-encoded prompts
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${size.width}&height=${size.height}&model=flux&nologo=true&seed=${Date.now()}`;

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 90000, // Can take up to 60s for first generation
      maxRedirects: 5
    });

    const imageBuffer = Buffer.from(response.data);

    // Validate we got actual image data (not an error page)
    if (imageBuffer.length < 10000) {
      throw new Error('Pollinations returned too-small image, likely an error');
    }

    const outputPath = await this._postProcess(imageBuffer, postId, format);
    logger.info(`✅ Image generated via Pollinations AI`, { postId, size: imageBuffer.length });
    return outputPath;
  }

  /**
   * Provider 2: Together AI — Requires API key + credits
   */
  async _togetherAI(prompt, postId, format) {
    if (!this.togetherKey || this.togetherKey.includes('your_')) {
      throw new Error('Together AI not configured');
    }

    const sizes = {
      square: { width: 1024, height: 1024 },
      story: { width: 768, height: 1344 },
      landscape: { width: 1344, height: 768 }
    };
    const size = sizes[format] || sizes.square;

    logger.info(`Generating image via Together AI`, { postId, format });

    const response = await axios.post('https://api.together.xyz/v1/images/generations', {
      model: 'black-forest-labs/FLUX.1-schnell-Free',
      prompt,
      width: size.width,
      height: size.height,
      steps: 4,
      n: 1,
      response_format: 'b64_json'
    }, {
      headers: {
        'Authorization': `Bearer ${this.togetherKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    });

    const imageData = response.data.data[0].b64_json;
    const imageBuffer = Buffer.from(imageData, 'base64');
    const outputPath = await this._postProcess(imageBuffer, postId, format);
    logger.info(`✅ Image generated via Together AI`, { postId });
    return outputPath;
  }

  /**
   * Post-process: resize to exact social media dimensions and add subtle watermark
   */
  async _postProcess(imageBuffer, postId, format) {
    const finalSizes = {
      square: config.CONTENT.IMAGE_SIZE_SQUARE,
      story: config.CONTENT.IMAGE_SIZE_STORY,
      landscape: config.CONTENT.IMAGE_SIZE_LANDSCAPE
    };

    const finalSize = finalSizes[format] || finalSizes.square;
    const outputPath = join(config.IMAGES_DIR, `${postId}.jpg`);

    // Create watermark SVG
    const watermarkSvg = `
      <svg width="${finalSize.width}" height="${finalSize.height}">
        <text
          x="${finalSize.width - 20}"
          y="${finalSize.height - 15}"
          font-family="Arial, Helvetica, sans-serif"
          font-size="14"
          font-weight="600"
          fill="rgba(255,255,255,0.35)"
          text-anchor="end"
          letter-spacing="2"
        >${config.BRAND_NAME}</text>
      </svg>
    `;

    await sharp(imageBuffer)
      .resize(finalSize.width, finalSize.height, { fit: 'cover' })
      .composite([{
        input: Buffer.from(watermarkSvg),
        gravity: 'southeast'
      }])
      .jpeg({ quality: 92 })
      .toFile(outputPath);

    return outputPath;
  }

  /**
   * Generate a branded gradient fallback image when all providers fail
   */
  async _generateFallback(postId, format) {
    const finalSizes = {
      square: config.CONTENT.IMAGE_SIZE_SQUARE,
      story: config.CONTENT.IMAGE_SIZE_STORY,
      landscape: config.CONTENT.IMAGE_SIZE_LANDSCAPE
    };

    const size = finalSizes[format] || finalSizes.square;
    const outputPath = join(config.IMAGES_DIR, `${postId}_fallback.jpg`);

    const svg = `
      <svg width="${size.width}" height="${size.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a0533;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#0f172a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0c1220;stop-opacity:1" />
          </linearGradient>
          <radialGradient id="glow" cx="30%" cy="40%" r="60%">
            <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <rect width="100%" height="100%" fill="url(#glow)"/>
        <text
          x="50%"
          y="45%"
          font-family="Arial, Helvetica, sans-serif"
          font-size="48"
          font-weight="800"
          fill="#ffffff"
          text-anchor="middle"
          letter-spacing="4"
        >${config.BRAND_NAME.toUpperCase()}</text>
        <text
          x="50%"
          y="55%"
          font-family="Arial, Helvetica, sans-serif"
          font-size="18"
          fill="rgba(255,255,255,0.6)"
          text-anchor="middle"
          letter-spacing="2"
        >${config.BRAND_TAGLINE}</text>
      </svg>
    `;

    await sharp(Buffer.from(svg))
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    logger.warn(`Using fallback gradient image for ${postId}`);
    return outputPath;
  }
}

const imageGenerator = new ImageGenerator();

// CLI test mode
if (process.argv[1] && process.argv[1].includes('image.js')) {
  console.log('\n🧪 Testing Image Generator (Pollinations AI — FREE)...\n');
  imageGenerator.generate(
    'Futuristic AI dashboard with glowing neural networks, dark background, neon purple and cyan accents, abstract tech visualization',
    'test_ai_image',
    'square'
  ).then(path => {
    console.log(`\n✅ Image saved to: ${path}`);
  }).catch(err => {
    console.error('❌ Error:', err.message);
  });
}

export default imageGenerator;
