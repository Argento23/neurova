import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

dotenvConfig({ path: join(ROOT_DIR, '.env') });

const config = {
  // Paths
  ROOT_DIR,
  DATA_DIR: join(ROOT_DIR, 'data'),
  OUTPUT_DIR: join(ROOT_DIR, 'output'),
  IMAGES_DIR: join(ROOT_DIR, 'output', 'images'),
  VIDEOS_DIR: join(ROOT_DIR, 'output', 'videos'),
  LOGS_DIR: join(ROOT_DIR, 'data', 'logs'),

  // AI APIs
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  TOGETHER_API_KEY: process.env.TOGETHER_API_KEY || '',
  PEXELS_API_KEY: process.env.PEXELS_API_KEY || '',

  // Instagram
  IG_ACCESS_TOKEN: process.env.IG_ACCESS_TOKEN || '',
  IG_USER_ID: process.env.IG_USER_ID || '',

  // Facebook Page (uses same Meta token as Instagram)
  FB_PAGE_ID: process.env.FB_PAGE_ID || '', // Auto-detected if empty

  // TikTok
  TIKTOK_CLIENT_KEY: process.env.TIKTOK_CLIENT_KEY || '',
  TIKTOK_CLIENT_SECRET: process.env.TIKTOK_CLIENT_SECRET || '',
  TIKTOK_ACCESS_TOKEN: process.env.TIKTOK_ACCESS_TOKEN || '',
  TIKTOK_REFRESH_TOKEN: process.env.TIKTOK_REFRESH_TOKEN || '',
  TIKTOK_OPEN_ID: process.env.TIKTOK_OPEN_ID || '',

  // YouTube
  YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID || '',
  YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET || '',
  YOUTUBE_REFRESH_TOKEN: process.env.YOUTUBE_REFRESH_TOKEN || '',

  // Image Hosting
  IMGBB_API_KEY: process.env.IMGBB_API_KEY || '',

  // ─── SALES ENGINE ─────────────────────────
  // Supabase (Leads Database)
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_KEY || '',

  // Lead Discovery
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
  SERPAPI_KEY: process.env.SERPAPI_KEY || '',

  // WhatsApp Outreach — Meta Cloud API (Official, no bans)
  META_CLOUD_TOKEN: process.env.META_CLOUD_TOKEN || '',
  META_PHONE_NUMBER_ID: process.env.META_PHONE_NUMBER_ID || '',
  META_WABA_ID: process.env.META_WABA_ID || '',
  META_API_VERSION: process.env.META_API_VERSION || 'v25.0',

  // WhatsApp Outreach — Evolution API (Legacy/fallback)
  EVOLUTION_API_URL: process.env.EVOLUTION_API_URL || '',
  EVOLUTION_API_KEY: process.env.EVOLUTION_API_KEY || '',
  EVOLUTION_INSTANCE: process.env.EVOLUTION_INSTANCE || 'neurova',
  DISABLE_FOLLOWUPS: process.env.DISABLE_FOLLOWUPS || 'false',

  // Email Outreach
  BREVO_API_KEY: process.env.BREVO_API_KEY || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'gustavo@generarise.space',
  EMAIL_SMTP_HOST: process.env.EMAIL_SMTP_HOST || '',
  CHATWOOT_API_TOKEN: process.env.CHATWOOT_API_TOKEN || '',

  // Telegram
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '',

  // Branding
  BRAND_NAME: process.env.BRAND_NAME || 'GenerArise',
  BRAND_URL: process.env.BRAND_URL || 'https://generarise.space',
  BRAND_TAGLINE: process.env.BRAND_TAGLINE || 'Automatización Inteligente con IA',
  BRAND_TAGLINE_EN: process.env.BRAND_TAGLINE_EN || 'Intelligent Automation with AI',

  // System
  TIMEZONE: process.env.TIMEZONE || 'America/Argentina/Buenos_Aires',
  DASHBOARD_PORT: parseInt(process.env.DASHBOARD_PORT || '4000'),
  PUBLIC_URL: process.env.PUBLIC_URL || `http://localhost:${parseInt(process.env.DASHBOARD_PORT || '4000')}`,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Content Settings
  CONTENT: {
    IMAGE_SIZE_SQUARE: { width: 1080, height: 1080 },
    IMAGE_SIZE_STORY: { width: 1080, height: 1920 },
    IMAGE_SIZE_LANDSCAPE: { width: 1920, height: 1080 },
    MAX_CAPTION_LENGTH: 2200, // Instagram limit
    MAX_HASHTAGS: 30,
    DEFAULT_HASHTAGS: [
      '#GenerArise', '#AutomatizacionIA', '#InteligenciaArtificial',
      '#AI', '#Automation', '#BusinessAI', '#AIAgents',
      '#VentasB2B', '#MarketingDigital', '#TechStartup'
    ],
    LANGUAGES: ['es', 'en'],
    POST_TYPES: [
      'tip_practico', 'caso_uso', 'tendencia_ia', 'behind_scenes',
      'quote', 'educacion', 'community', 'video_corto'
    ]
  }
};

// Validate critical config
export function validateConfig() {
  const warnings = [];
  const errors = [];

  if (!config.GROQ_API_KEY) errors.push('GROQ_API_KEY is required for text generation');
  if (!config.TOGETHER_API_KEY) warnings.push('TOGETHER_API_KEY missing — image generation will use fallback');
  if (!config.IG_ACCESS_TOKEN) warnings.push('IG_ACCESS_TOKEN missing — Instagram & Facebook publishing disabled');
  if (!config.IG_USER_ID) warnings.push('IG_USER_ID missing — Instagram publishing disabled');
  if (!config.FB_PAGE_ID) warnings.push('FB_PAGE_ID missing — will auto-detect from token');
  if (!config.TELEGRAM_BOT_TOKEN) warnings.push('TELEGRAM_BOT_TOKEN missing — notifications disabled');
  // Sales Engine warnings
  if (!config.SUPABASE_URL) warnings.push('SUPABASE_URL missing — Sales Engine disabled');
  if (!config.GOOGLE_MAPS_API_KEY && !config.SERPAPI_KEY) warnings.push('No lead discovery API configured (GOOGLE_MAPS_API_KEY or SERPAPI_KEY)');
  if (!config.META_CLOUD_TOKEN && !config.EVOLUTION_API_URL) warnings.push('No WhatsApp API configured — set META_CLOUD_TOKEN (recommended) or EVOLUTION_API_URL');

  return { warnings, errors, isValid: errors.length === 0 };
}

export default config;
