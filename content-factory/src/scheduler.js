import cron from 'node-cron';
import config from './config.js';
import logger from './logger.js';
import calendar from './calendar/manager.js';
import textGenerator from './generators/text.js';
import imageGenerator from './generators/image.js';
import videoGenerator from './generators/video.js';
import instagramPublisher from './publishers/instagram.js';
import facebookPublisher from './publishers/facebook.js';
import tiktokPublisher from './publishers/tiktok.js';
import youtubePublisher from './publishers/youtube.js';
import uploadHost from './publishers/upload-host.js';
import telegram from './notifications/telegram.js';
import audioGenerator from './generators/audio.js';
import pexelsGenerator from './generators/pexels.js';
import { cleanupOldFiles } from './utils/cleanup.js';
// Sales Engine imports
import leadFinder from './sales/lead-finder.js';
import aiScorer from './sales/ai-scorer.js';
import outreachEngine from './sales/outreach-engine.js';
import supabaseClient from './sales/supabase-client.js';
// Multi-tenant cloud modules
import calendarDb from './db/calendar-db.js';
import usersDb from './db/users-db.js';
import marketplaceDb from './db/marketplace-db.js';
import { processAllCatalogs } from './catalog-processor.js';

const TZ = config.TIMEZONE;

/**
 * Scheduler — The heart of the Content Factory.
 * Replaces ALL n8n cron triggers with native node-cron jobs.
 *
 * Schedule:
 *   07:00 → Generate today's posts + tomorrow's (pre-buffer)
 *   09:00 → Publish batch #1 (morning)
 *   12:00 → Publish batch #2 (noon)
 *   15:00 → Publish batch #3 (afternoon)
 *   18:00 → Publish batch #4 (evening)
 *   23:00 → Daily report + cleanup
 */

// ═══════════════════════════════════════════════════
// CONTENT GENERATION PIPELINE
// ═══════════════════════════════════════════════════

async function generateContent() {
  logger.info('═══ CONTENT GENERATION STARTED ═══');

  try {
    // Generate posts for today
    const today = new Date().toLocaleDateString('en-CA', { timeZone: TZ });
    const todayPosts = calendar.generatePostsForDate(today);

    // Also pre-generate tomorrow's posts
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('en-CA', { timeZone: TZ });
    calendar.generatePostsForDate(tomorrowStr);

    // Process each pending post
    const pending = calendar.getPendingPosts();
    logger.info(`Processing ${pending.length} pending posts`);

    for (const post of pending) {
      try {
        calendar.updatePost(post.id, { status: 'generating' });

        // 1. Generate text content
        const textContent = await textGenerator.generatePost(post);

        // 2. Determine if this is a video or image post
        const isVideo = post.type === 'video_corto';
        let imagePath = null;
        let videoPath = null;

        if (isVideo) {
          let bgVideoPath = null;
          try {
            if (config.PEXELS_API_KEY) {
              bgVideoPath = await pexelsGenerator.generate(post.topic, post.id);
            }
          } catch (pexelsErr) {
            logger.warn(`Pexels failed, falling back to AI image`, { error: pexelsErr.message });
          }

          if (!bgVideoPath) {
            // Fallback: Generate image for video background
            imagePath = await imageGenerator.generate(
              textContent.imagePrompt, post.id, 'story'
            );
          }

          // Generate video script
          const script = await textGenerator.generateVideoScript(post.topic, post.language);

          // Generate VoiceOver
          let audioPath = null;
          try {
            const fullScriptText = `${script.hook}. ${script.points.join('. ')}. ${script.cta}`;
            audioPath = await audioGenerator.generateVoiceOver(fullScriptText, post.id, post.language);
          } catch (audioErr) {
            logger.warn(`Audio generation failed for ${post.id}`, { error: audioErr.message });
          }

          // Create video from image/video + text overlays + audio
          try {
            videoPath = await videoGenerator.generate({
              imagePaths: imagePath ? [imagePath] : null,
              bgVideoPath: bgVideoPath,
              overlayTexts: script.overlay_texts || [],
              postId: post.id,
              slideDuration: 3,
              format: 'vertical',
              audioPath: audioPath
            });
          } catch (videoErr) {
            logger.warn(`Video generation failed for ${post.id}, will use image only`, {
              error: videoErr.message
            });
          }
        } else {
          // Generate image
          const format = post.platforms.includes('tiktok') ? 'story' : 'square';
          imagePath = await imageGenerator.generate(textContent.imagePrompt, post.id, format);
        }

        // 3. Update post with generated content
        calendar.updatePost(post.id, {
          status: 'ready',
          caption: textContent.fullCaption || `${textContent.caption}\n\n${textContent.hashtags.join(' ')}`,
          hashtags: textContent.hashtags,
          imagePath,
          videoPath
        });

        logger.info(`✅ Post ${post.id} generated successfully`, { type: post.type });

        // Small delay between generations to respect API rate limits
        await new Promise(r => setTimeout(r, 3000));

      } catch (error) {
        logger.error(`Failed to generate post ${post.id}`, { error: error.message });
        calendar.updatePost(post.id, { status: 'error', error: error.message });
        await telegram.sendAlert('Content Generation Failed', `${post.type}: ${error.message}`);
      }
    }

    logger.info('═══ CONTENT GENERATION COMPLETE ═══');
  } catch (error) {
    logger.error('Content generation pipeline failed', { error: error.message });
    await telegram.sendAlert('Generation Pipeline Error', error.message);
  }
}

// ═══════════════════════════════════════════════════
// PUBLISHING PIPELINE
// ═══════════════════════════════════════════════════

async function publishContent() {
  logger.info('═══ PUBLISH CHECK STARTED ═══');

  const readyPosts = calendar.getReadyToPublish();

  if (readyPosts.length === 0) {
    logger.info('No posts ready to publish right now');
    return;
  }

  logger.info(`${readyPosts.length} posts ready to publish`);

  for (const post of readyPosts) {
    try {
      calendar.updatePost(post.id, { status: 'publishing' });

      const publishResults = [];

      let uploadedMediaUrls = { imageUrl: null, videoUrl: null };
      
      try {
        if (post.videoPath) {
          uploadedMediaUrls.videoUrl = uploadHost.getVideoUrl(post.videoPath);
        }
        if (post.imagePath) {
          uploadedMediaUrls.imageUrl = await uploadHost.upload(post.imagePath);
          // 3 second delay to ensure ImgBB URL is globally propagated 
          // before FB/IG Graph APIs try to download it, avoiding 404/format errors.
          await new Promise(r => setTimeout(r, 3000));
        }
      } catch (uploadErr) {
        throw new Error(`Media preparation failed: ${uploadErr.message}`);
      }

      for (const platform of post.platforms) {
        try {
          await publishToPlatform(platform, post, uploadedMediaUrls);
          publishResults.push({ platform, success: true });
          await telegram.sendPublishConfirmation(platform, post.type, post.topic);
        } catch (platErr) {
          logger.error(`Failed to publish to ${platform}`, {
            postId: post.id, error: platErr.message
          });
          publishResults.push({ platform, success: false, error: platErr.message });
        }
      }

      const anySuccess = publishResults.some(r => r.success);
      const allSuccess = publishResults.every(r => r.success);

      calendar.updatePost(post.id, {
        status: allSuccess ? 'published' : (anySuccess ? 'partial' : 'error'),
        publishedAt: anySuccess ? new Date().toISOString() : null,
        publishResults
      });

      if (!allSuccess) {
        const failed = publishResults.filter(r => !r.success).map(r => `${r.platform}: ${r.error}`);
        await telegram.sendAlert('Publicación parcial', `${post.type}: ${failed.join(', ')}`);
      }

      // Delay between posts to avoid rate limits
      await new Promise(r => setTimeout(r, 10000));

    } catch (error) {
      logger.error(`Publishing failed for post ${post.id}`, { error: error.message });
      calendar.updatePost(post.id, { status: 'error', error: error.message });
      await telegram.sendAlert('Publishing Failed', `${post.type}: ${error.message}`);
    }
  }

  logger.info('═══ PUBLISH CHECK COMPLETE ═══');
}

async function publishToPlatform(platform, post, uploadedMediaUrls = {}, creds = null) {
  switch (platform) {
    case 'instagram': {
      if (!instagramPublisher.isConfigured() && !creds?.ig_access_token) {
        logger.warn('Instagram not configured, skipping');
        return;
      }

      if (post.videoPath && uploadedMediaUrls.videoUrl) {
        await instagramPublisher.publishReel(uploadedMediaUrls.videoUrl, post.caption, creds);
      } else if (post.imagePath && uploadedMediaUrls.imageUrl) {
        await instagramPublisher.publishImage(uploadedMediaUrls.imageUrl, post.caption, creds);
      } else {
        logger.warn(`Post ${post.id} has no media for Instagram, skipping`);
      }
      break;
    }

    case 'tiktok': {
      if (!tiktokPublisher.isConfigured() && !creds?.tiktok_access_token) {
        logger.warn('TikTok not configured, skipping');
        return;
      }
      if (post.videoPath) {
        await tiktokPublisher.publishVideo(post.videoPath, post.caption, creds);
      } else {
        logger.warn(`TikTok requires video — post ${post.id} has no videoPath, skipping`);
      }
      break;
    }

    case 'youtube': {
      if (!youtubePublisher.isConfigured() && !creds?.youtube_refresh_token) {
        logger.warn('YouTube not configured, skipping');
        return;
      }
      if (post.videoPath) {
        await youtubePublisher.publishShort(
          post.videoPath,
          post.topic,
          post.caption,
          post.hashtags,
          creds
        );
      } else {
        logger.warn(`YouTube requires video — post ${post.id} has no videoPath, skipping`);
      }
      break;
    }

    case 'facebook': {
      if (!facebookPublisher.isConfigured() && !creds?.ig_access_token) {
        logger.warn('Facebook not configured, skipping');
        return;
      }

      if (post.videoPath && uploadedMediaUrls.videoUrl) {
        await facebookPublisher.publishReel(uploadedMediaUrls.videoUrl, post.caption, creds);
      } else if (post.imagePath && uploadedMediaUrls.imageUrl) {
        await facebookPublisher.publishImage(uploadedMediaUrls.imageUrl, post.caption, creds);
      } else {
        // Text-only post fallback
        await facebookPublisher.publishText(post.caption, creds);
      }
      break;
    }

    default:
      logger.warn(`Unknown platform: ${platform}`);
  }
}

// ═══════════════════════════════════════════════════
// DAILY REPORT & CLEANUP
// ═══════════════════════════════════════════════════

async function dailyReport() {
  const stats = calendar.getStats();
  await telegram.sendDailyReport(stats);
  calendar.cleanup();
  await cleanupOldFiles();
  logger.info('Daily report sent and old files/posts cleaned up');
}

// ═══════════════════════════════════════════════════
// SALES ENGINE PIPELINES
// ═══════════════════════════════════════════════════

async function runLeadDiscovery() {
  logger.info('═══ DAILY LEAD DISCOVERY ═══');
  try {
    const plan = leadFinder.getDailyDiscoveryPlan();
    if (plan.length === 0) {
      logger.info('No discovery scheduled for today (Sunday)');
      return;
    }
    const results = await leadFinder.runBatchDiscovery(plan);
    const totalNew = results.reduce((sum, r) => sum + (r.new || 0), 0);
    await telegram.sendAlert('🔍 Lead Discovery', `Found ${totalNew} new leads today`);
  } catch (error) {
    logger.error('Lead discovery failed', { error: error.message });
    await telegram.sendAlert('❌ Discovery Failed', error.message);
  }
}

async function runLeadScoring() {
  logger.info('═══ AI LEAD SCORING ═══');
  try {
    const result = await aiScorer.scoreAllPending();
    if (result.scored > 0) {
      await telegram.sendAlert('🧠 Scoring Complete', `Scored: ${result.scored} | Qualified (70+): ${result.qualified}`);
    }
  } catch (error) {
    logger.error('Lead scoring failed', { error: error.message });
  }
}

async function runOutreach() {
  logger.info('═══ OUTREACH BATCH ═══');
  try {
    await outreachEngine.runOutreachBatch({ maxLeads: 50, type: 'new' });
  } catch (error) {
    logger.error('Outreach failed', { error: error.message });
  }
}

async function runFollowUps() {
  logger.info('═══ FOLLOW-UP BATCH ═══');
  try {
    await outreachEngine.runOutreachBatch({ maxLeads: 50, type: 'followup' });
  } catch (error) {
    logger.error('Follow-ups failed', { error: error.message });
  }
}
// ═══════════════════════════════════════════════════
// CLOUD PIPELINES (Multi-tenant SaaS)
// Process posts from Supabase for ALL paying users
// ═══════════════════════════════════════════════════

async function generateCloudContent() {
  logger.info('═══ CLOUD CONTENT GENERATION ═══');
  try {
    const pendingPosts = await calendarDb.getAllPendingPosts();
    if (pendingPosts.length === 0) {
      logger.info('No cloud posts pending generation');
      return;
    }

    logger.info(`Processing ${pendingPosts.length} cloud posts`);

    for (const post of pendingPosts) {
      try {
        await calendarDb.updatePost(post.id, { status: 'generating' });

        // Build a post object compatible with existing generators
        const postObj = {
          id: post.id,
          type: post.post_type,
          topic: post.topic,
          language: post.language,
          platforms: post.platforms
        };

        // 1. Generate text
        const textContent = await textGenerator.generatePost(postObj);

        // 2. Generate image
        const isVideo = post.post_type === 'video_corto';
        let imagePath = null;
        let videoPath = null;

        if (!isVideo) {
          const format = (post.platforms || []).includes('tiktok') ? 'story' : 'square';
          imagePath = await imageGenerator.generate(textContent.imagePrompt, post.id, format);
        }
        // TODO: Video generation for cloud users (Phase 2)

        // 3. Upload image to ImgBB immediately so URL is ready
        let imageUrl = null;
        if (imagePath) {
          try {
            imageUrl = await uploadHost.upload(imagePath);
          } catch (e) {
            logger.warn(`ImgBB upload failed for cloud post ${post.id}`, { error: e.message });
          }
        }

        // 4. Update post
        await calendarDb.updatePost(post.id, {
          status: 'ready',
          caption: textContent.fullCaption || `${textContent.caption}\n\n${textContent.hashtags.join(' ')}`,
          hashtags: textContent.hashtags,
          imagePath,
          imageUrl,
          videoPath,
          imagePrompt: textContent.imagePrompt
        });

        logger.info(`✅ Cloud post ${post.id} generated`, { owner: post.owner_id });
        await new Promise(r => setTimeout(r, 3000));

      } catch (error) {
        logger.error(`Cloud post ${post.id} generation failed`, { error: error.message });
        await calendarDb.updatePost(post.id, { status: 'error', error: error.message });
      }
    }

    logger.info('═══ CLOUD GENERATION COMPLETE ═══');
  } catch (error) {
    logger.error('Cloud generation pipeline failed', { error: error.message });
  }
}

async function publishCloudContent() {
  logger.info('═══ CLOUD PUBLISH CHECK ═══');
  try {
    const readyPosts = await calendarDb.getAllReadyToPublish();
    if (readyPosts.length === 0) {
      logger.info('No cloud posts ready to publish');
      return;
    }

    logger.info(`${readyPosts.length} cloud posts ready to publish`);

    for (const post of readyPosts) {
      try {
        await calendarDb.updatePost(post.id, { status: 'publishing' });

        const publishResults = [];
        const userConfig = post.users_config;

        // Prepare media URLs
        let uploadedMediaUrls = { imageUrl: post.image_url, videoUrl: post.video_url };
        if (!uploadedMediaUrls.imageUrl && post.image_path) {
          try {
            uploadedMediaUrls.imageUrl = await uploadHost.upload(post.image_path);
            await new Promise(r => setTimeout(r, 3000));
          } catch (e) {
            logger.error(`ImgBB upload failed`, { error: e.message });
          }
        }
        if (!uploadedMediaUrls.videoUrl && post.video_path) {
          uploadedMediaUrls.videoUrl = uploadHost.getVideoUrl(post.video_path);
        }

        // Build post object compatible with publishToPlatform
        const postObj = {
          id: post.id,
          type: post.post_type,
          topic: post.topic,
          caption: post.caption,
          hashtags: post.hashtags,
          imagePath: post.image_path,
          videoPath: post.video_path,
          platforms: post.platforms
        };

        // Extract per-user credentials
        const creds = usersDb.getUserCredentials(userConfig);

        for (const platform of (post.platforms || [])) {
          try {
            await publishToPlatform(platform, postObj, uploadedMediaUrls, creds);
            publishResults.push({ platform, success: true });
          } catch (platErr) {
            logger.error(`Cloud publish to ${platform} failed`, { error: platErr.message });
            publishResults.push({ platform, success: false, error: platErr.message });
          }
        }

        const anySuccess = publishResults.some(r => r.success);
        const allSuccess = publishResults.every(r => r.success);

        await calendarDb.updatePost(post.id, {
          status: allSuccess ? 'published' : (anySuccess ? 'partial' : 'error'),
          publishedAt: anySuccess ? new Date().toISOString() : null,
          publishResults
        });

        await new Promise(r => setTimeout(r, 10000));
      } catch (error) {
        logger.error(`Cloud publish failed for ${post.id}`, { error: error.message });
        await calendarDb.updatePost(post.id, { status: 'error', error: error.message });
      }
    }

    logger.info('═══ CLOUD PUBLISH COMPLETE ═══');
  } catch (error) {
    logger.error('Cloud publish pipeline failed', { error: error.message });
  }
}

async function autoListLeadsOnMarketplace() {
  logger.info('═══ AUTO-LIST LEADS ON MARKETPLACE ═══');
  try {
    const result = await marketplaceDb.autoListQualifiedLeads();
    if (result.listed > 0) {
      logger.info(`Listed ${result.listed} leads on marketplace`);
    }
  } catch (error) {
    logger.error('Marketplace auto-list failed', { error: error.message });
  }
}

// ═══════════════════════════════════════════════════
// CRON JOBS REGISTRATION
// ═══════════════════════════════════════════════════

export function startScheduler() {
  logger.info('🚀 Starting Content Factory + Sales Engine Scheduler...');
  logger.info(`   Timezone: ${TZ}`);

  // ─── CONTENT FACTORY CRONS (local calendar.json) ──
  cron.schedule('0 7 * * *', generateContent, { timezone: TZ });
  logger.info('   ⏰ 07:00 → Content generation (local)');

  cron.schedule('0 9 * * *', publishContent, { timezone: TZ });
  logger.info('   ⏰ 09:00 → Publish batch #1');

  cron.schedule('0 12 * * *', publishContent, { timezone: TZ });
  logger.info('   ⏰ 12:00 → Publish batch #2');

  cron.schedule('0 15 * * *', publishContent, { timezone: TZ });
  logger.info('   ⏰ 15:00 → Publish batch #3');

  cron.schedule('0 18 * * *', publishContent, { timezone: TZ });
  logger.info('   ⏰ 18:00 → Publish batch #4');

  cron.schedule('0 23 * * *', dailyReport, { timezone: TZ });
  logger.info('   ⏰ 23:00 → Daily report');

  // ─── CLOUD SaaS CRONS (Supabase calendar_posts) ──
  cron.schedule('0 6 * * *', processAllCatalogs, { timezone: TZ });
  logger.info('   ☁️ 06:00 → Catalog CSV processing (SaaS users)');

  cron.schedule('5 7 * * *', generateCloudContent, { timezone: TZ });
  logger.info('   ☁️ 07:05 → Cloud content generation (SaaS users)');

  cron.schedule('5 9,12,15,18 * * *', publishCloudContent, { timezone: TZ });
  logger.info('   ☁️ 09:05,12:05,15:05,18:05 → Cloud publish (SaaS users)');

  // ─── SALES ENGINE CRONS ────────────────────
  cron.schedule('0 6 * * 1-6', runLeadDiscovery, { timezone: TZ });
  logger.info('   🎯 06:00 → Lead discovery (Mon-Sat)');

  cron.schedule('0 8,10,13,17 * * 1-6', runLeadScoring, { timezone: TZ });
  logger.info('   🧠 08:00, 10:00, 13:00, 17:00 → AI lead scoring (Mon-Sat)');

  cron.schedule('0 10,12,14,16,18 * * 1-5', runOutreach, { timezone: TZ });
  logger.info('   📤 10:00-18:00 (every 2h) → Outreach batch (Mon-Fri)');

  cron.schedule('0 11,15,19 * * 1-5', runFollowUps, { timezone: TZ });
  logger.info('   🔄 11:00, 15:00, 19:00 → Follow-ups (Mon-Fri)');

  cron.schedule('0 20 * * *', () => outreachEngine.sendSalesReport(), { timezone: TZ });
  logger.info('   📊 20:00 → Sales daily report');

  cron.schedule('0 0 * * *', () => outreachEngine.resetDailyCounters(), { timezone: TZ });
  logger.info('   🔄 00:00 → Reset outreach counters');

  // ─── MARKETPLACE CRONS ─────────────────────
  cron.schedule('30 8,14,20 * * *', autoListLeadsOnMarketplace, { timezone: TZ });
  logger.info('   🛒 08:30, 14:30, 20:30 → Auto-list leads on marketplace');

  logger.info('✅ All cron jobs registered (Local + Cloud + Sales + Marketplace)');

  // Run startup health check
  setTimeout(() => runStartupHealthCheck(), 5000);
}

async function runStartupHealthCheck() {
  logger.info('═══ STARTUP HEALTH CHECK ═══');
  const checks = [];

  // 1. Supabase
  try {
    if (supabaseClient.isConfigured()) {
      const stats = await supabaseClient.getSalesStats();
      checks.push(`✅ Supabase: ${stats.totalLeads} leads in DB`);
    } else {
      checks.push('⚠️ Supabase: Not configured');
    }
  } catch (e) { checks.push(`❌ Supabase: ${e.message}`); }

  // 2. WhatsApp Provider
  try {
    const health = await outreachEngine.checkEvolutionHealth();
    const providerLabel = health.provider === 'cloud_api' ? 'Meta Cloud API' 
      : health.provider === 'evolution' ? 'Evolution API' 
      : 'No Provider';
    if (health.healthy) {
      checks.push(`✅ WhatsApp (${providerLabel}): Connected (${health.state})`);
    } else {
      checks.push(`❌ WhatsApp (${providerLabel}): ${health.reason || health.state}`);
    }
  } catch (e) { checks.push(`❌ WhatsApp: ${e.message}`); }

  // 3. Instagram
  try {
    const igPub = (await import('./publishers/instagram.js')).default;
    if (igPub.isConfigured()) {
      const result = await igPub.validateToken();
      checks.push(result.valid ? `✅ Instagram: ${result.name}` : `❌ Instagram: ${result.error}`);
    } else {
      checks.push('⚠️ Instagram: Not configured');
    }
  } catch (e) { checks.push(`❌ Instagram: ${e.message}`); }

  // 4. Calendar status
  try {
    const stats = calendar.getStats();
    checks.push(`📅 Calendar: ${stats.today.total} posts today (${stats.today.published} published, ${stats.today.pending} pending)`);
  } catch (e) { checks.push(`⚠️ Calendar: ${e.message}`); }

  const report = `🚀 CONTENT FACTORY BOOTED\n\n${checks.join('\n')}\n\n⏰ ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}`;
  
  await telegram.sendAlert('🚀 System Boot', report);
  logger.info('Startup health check complete');
  checks.forEach(c => logger.info(`  ${c}`));
}

// Export for manual triggering from dashboard/CLI
export {
  generateContent, publishContent, dailyReport,
  runLeadDiscovery, runLeadScoring, runOutreach, runFollowUps,
  generateCloudContent, publishCloudContent, autoListLeadsOnMarketplace
};
