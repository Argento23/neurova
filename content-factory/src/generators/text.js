import axios from 'axios';
import { readFileSync } from 'fs';
import { join } from 'path';
import config from '../config.js';
import logger from '../logger.js';

// Load prompt library from existing asset
let promptLibrary = {};
try {
  const libPath = join(config.DATA_DIR, 'prompt_library.json');
  promptLibrary = JSON.parse(readFileSync(libPath, 'utf-8'));
} catch {
  logger.warn('prompt_library.json not found in data/, using defaults');
}

/**
 * Text Generator — Uses Groq API (free, fast) to generate
 * captions, hashtags, and video scripts for social media posts.
 * Replaces n8n's AI nodes.
 */
class TextGenerator {
  constructor() {
    this.apiKey = config.GROQ_API_KEY;
    this.baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.model = 'llama-3.3-70b-versatile';
  }

  async _call(systemPrompt, userPrompt, maxTokens = 800) {
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    const response = await axios.post(this.baseUrl, {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.8,
      top_p: 0.9
    }, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    return response.data.choices[0].message.content.trim();
  }

  /**
   * Generate a complete social media post (caption + hashtags + image prompt)
   */
  async generatePost(post) {
    const { type, topic, language } = post;
    const lang = language === 'en' ? 'English' : 'Spanish';
    const brand = config.BRAND_NAME;

    // Use existing prompt library if available, otherwise use built-in
    const templatePrompts = promptLibrary[type] || {};

    const systemPrompt = templatePrompts.system ||
      `You are an elite social media manager and copywriter for ${brand}, an AI automation agency. You specialize in viral, high-converting content with massive engagement. Write entirely in ${lang}.`;

    const userPrompt = `Create a social media post about: "${topic}"

BRAND: ${brand} (${config.BRAND_URL})
LANGUAGE: ${lang}
POST TYPE: ${type}
CURRENT DATE: ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

REQUIREMENTS:
- Write exclusively in ${lang}
- VIRAL HOOK (Crucial): The very first line MUST be a highly controversial, counter-intuitive, or curiosity-inducing hook to stop the scroll. (e.g. "El error que arruina tu...", "Por qué todos mienten sobre..."). Never start with "Hola" or boring introductions.
- SEO OPTIMIZATION: Naturally weave at least 3-5 high-search-volume keywords related to the topic into the text. Think about what people type into the TikTok/Google search bar.
- ENGAGEMENT FARMING (Lead Magnet): The CTA at the end MUST force interaction. Offer a free resource or ask a polarizing question. (e.g., "Comenta 'INFO' y te envío la guía gratuita", or "Comenta 'YO' si te pasa esto").
- Be professional but highly conversational and dynamic (avoid boring corporate tone).
- Use the brand name ${brand} naturally (max 1 mention).
- Format with short, punchy paragraphs and strategic emojis.
- Analyze the CURRENT DATE. Si hoy es una efeméride relevante, úsala como gancho secundario.

RESPOND IN THIS EXACT JSON FORMAT (no markdown, no code blocks):
{
  "caption": "The full caption text with line breaks as \\n",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7", "hashtag8"],
  "image_prompt": "A detailed prompt for AI image generation: describe the visual concept, style, colors, composition. Must be illustrative/abstract tech imagery, NOT photos of real people. Style: modern, clean, vibrant gradients, dark background with neon accents, futuristic tech aesthetic."
}`;

    try {
      const raw = await this._call(systemPrompt, userPrompt, 1000);

      // Extract JSON from response (handle possible markdown wrapping)
      let jsonStr = raw;
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) jsonStr = jsonMatch[0];

      const result = JSON.parse(jsonStr);

      // Add default brand hashtags and normalize (ensure all start with #)
      const rawHashtags = [
        ...(result.hashtags || []),
        ...config.CONTENT.DEFAULT_HASHTAGS.slice(0, 3)
      ].slice(0, 12);

      const allHashtags = rawHashtags.map(h => {
        const cleaned = h.replace(/^#+/, '').trim();
        return cleaned ? `#${cleaned}` : null;
      }).filter(Boolean);

      logger.info(`Text generated for post type=${type}`, { topic, language });

      return {
        caption: result.caption || '',
        hashtags: allHashtags,
        imagePrompt: result.image_prompt || this._fallbackImagePrompt(type),
        fullCaption: `${result.caption}\n\n${allHashtags.join(' ')}`
      };
    } catch (error) {
      logger.error('Text generation failed', { error: error.message, type, topic });
      return this._fallbackContent(type, topic, language);
    }
  }

  /**
   * Generate a video script
   */
  async generateVideoScript(topic, language = 'es') {
    const lang = language === 'en' ? 'English' : 'Spanish';

    const script = await this._call(
      `You are an elite TikTok/YouTube Shorts viral scriptwriter for ${config.BRAND_NAME}. Your expertise is high-retention, fast-paced, highly engaging content in ${lang}.`,
      `Write a highly viral 30-second video script about: "${topic}"

Context:
- CURRENT DATE: ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
- Analyze the CURRENT DATE. Si hoy es una efeméride o fecha especial, úsalo como un gancho de actualidad.

Virality Requirements:
1. The language MUST be 100% in ${lang}, sounding native, energetic, and conversational.
2. The Hook MUST be controversial, counter-intuitive, or create a massive curiosity gap (pattern interrupt).
3. Keep sentences extremely short. High pace. No fluff.
4. Deliver mind-blowing value or a highly relatable pain point quickly.

Structure:
- HOOK (3 seconds): A provocative opening line that stops the scroll immediately. (e.g., "Te están mintiendo sobre...")
- BODY (20 seconds): 3 rapid-fire key points or steps. Include SEO keywords naturally.
- CTA (5 seconds): A strong LEAD MAGNET Call To Action to force comments. (e.g., "Comenta 'GUIA' y te mando el PDF gratis", "Comenta 'YO' si te pasa"). Do NOT use generic CTAs like "Síguenos para más".

Format your response as JSON:
{
  "hook": "The opening hook text",
  "points": ["Point 1", "Point 2", "Point 3"],
  "cta": "The closing CTA",
  "overlay_texts": ["Text overlay 1", "Text overlay 2", "Text overlay 3", "Text overlay 4"]
}`,
      600
    );

    try {
      const jsonMatch = script.match(/\{[\s\S]*\}/);
      return JSON.parse(jsonMatch ? jsonMatch[0] : script);
    } catch {
      return {
        hook: topic,
        points: ['Automatiza tus procesos', 'Escala con IA', 'Resultados en días'],
        cta: `Seguinos para más → ${config.BRAND_NAME}`,
        overlay_texts: [topic, '🤖 AI Automation', '📈 Scale Fast', `@${config.BRAND_NAME}`]
      };
    }
  }

  _fallbackImagePrompt(type) {
    const prompts = {
      tip_practico: 'Sleek futuristic dashboard interface with glowing data widgets, dark background with electric blue and purple neon accents, abstract tech visualization, clean minimal design',
      caso_uso: 'Split screen before/after business transformation, left side chaotic office, right side organized AI-powered workflow, vibrant gradient colors, modern illustration style',
      tendencia_ia: 'Abstract neural network visualization with flowing data streams, deep space background, neon purple and cyan connections, futuristic tech art',
      behind_scenes: 'Developer workspace with multiple glowing monitors showing code and dashboards, dark moody lighting, tech aesthetic, top-down view',
      quote: 'Minimalist dark gradient background with subtle geometric patterns, space for text overlay, elegant purple to blue gradient, premium design',
      educacion: 'Step-by-step process diagram with glowing nodes and connections, infographic style, dark background with green and blue neon highlights',
      community: 'Network of connected people icons with AI brain at center, collaborative tech illustration, warm gradients on dark background',
      video_corto: 'Dynamic motion blur effect with tech elements, speed lines, vibrant neon colors on black, energy and movement, thumbnail style'
    };
    return prompts[type] || prompts.tip_practico;
  }

  _fallbackContent(type, topic, language) {
    const isEn = language === 'en';
    return {
      caption: isEn
        ? `💡 ${topic}\n\nAI automation is transforming how businesses operate. Stay ahead of the curve.\n\n${config.BRAND_NAME} — ${config.BRAND_TAGLINE_EN}`
        : `💡 ${topic}\n\nLa automatización con IA está transformando los negocios. No te quedes atrás.\n\n${config.BRAND_NAME} — ${config.BRAND_TAGLINE}`,
      hashtags: config.CONTENT.DEFAULT_HASHTAGS.slice(0, 8),
      imagePrompt: this._fallbackImagePrompt(type),
      fullCaption: ''
    };
  }
}

const textGenerator = new TextGenerator();

// CLI test mode
if (process.argv[1] && process.argv[1].includes('text.js')) {
  console.log('\n🧪 Testing Text Generator...\n');
  textGenerator.generatePost({
    type: 'tip_practico',
    topic: 'Cómo automatizar respuestas de WhatsApp con IA',
    language: 'es'
  }).then(result => {
    console.log('✅ Caption:', result.caption?.substring(0, 100) + '...');
    console.log('✅ Hashtags:', result.hashtags?.join(', '));
    console.log('✅ Image Prompt:', result.imagePrompt?.substring(0, 80) + '...');
  }).catch(err => {
    console.error('❌ Error:', err.message);
  });
}

export default textGenerator;
