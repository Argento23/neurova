import { createClient } from '@supabase/supabase-js';
import config from '../config.js';
import logger from '../logger.js';

// ═══════════════════════════════════════════════════
// CALENDAR DB — Cloud-based calendar replacing calendar.json
// Supports multi-tenant: each user has their own posts
// ═══════════════════════════════════════════════════

const supabase = config.SUPABASE_URL && config.SUPABASE_KEY
  ? createClient(config.SUPABASE_URL, config.SUPABASE_KEY)
  : null;

function ensureClient() {
  if (!supabase) throw new Error('Supabase not configured');
  return supabase;
}

/**
 * Get today's date string in YYYY-MM-DD for a given timezone
 */
function getToday(tz = config.TIMEZONE) {
  return new Date().toLocaleDateString('en-CA', { timeZone: tz });
}

/**
 * Get current time as HH:MM for a given timezone
 */
function getNow(tz = config.TIMEZONE) {
  return new Date().toLocaleTimeString('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ─── POSTS CRUD ──────────────────────────────────

/**
 * Create a new post in the calendar
 */
async function createPost(post) {
  const db = ensureClient();
  const { data, error } = await db.from('calendar_posts')
    .insert({
      owner_id: post.ownerId,
      post_date: post.date,
      publish_time: post.publishTime,
      post_type: post.type,
      topic: post.topic,
      language: post.language || 'es',
      platforms: post.platforms || ['instagram', 'facebook'],
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  logger.info(`Post created: ${data.topic.substring(0, 40)}`, { id: data.id, owner: post.ownerId });
  return data;
}

/**
 * Create multiple posts at once
 */
async function createPosts(posts) {
  const db = ensureClient();
  const rows = posts.map(p => ({
    owner_id: p.ownerId,
    post_date: p.date,
    publish_time: p.publishTime,
    post_type: p.type,
    topic: p.topic,
    language: p.language || 'es',
    platforms: p.platforms || ['instagram', 'facebook'],
    status: 'pending'
  }));

  const { data, error } = await db.from('calendar_posts')
    .insert(rows)
    .select();

  if (error) throw error;
  logger.info(`${data.length} posts created in batch`);
  return data;
}

/**
 * Get all pending posts that need content generation (across all users)
 */
async function getAllPendingPosts() {
  const db = ensureClient();
  const today = getToday();

  const { data, error } = await db.from('calendar_posts')
    .select('*, users_config!inner(brand_name, content_niche, language, timezone)')
    .eq('post_date', today)
    .eq('status', 'pending')
    .order('publish_time', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get all posts ready to publish that are past their scheduled time
 */
async function getAllReadyToPublish() {
  const db = ensureClient();
  const today = getToday();
  const now = getNow();

  const { data, error } = await db.from('calendar_posts')
    .select('*, users_config!inner(*)')
    .eq('post_date', today)
    .eq('status', 'ready')
    .lte('publish_time', now)
    .order('publish_time', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get posts for a specific user on a specific date
 */
async function getUserPosts(ownerId, date) {
  const db = ensureClient();
  const { data, error } = await db.from('calendar_posts')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('post_date', date || getToday())
    .order('publish_time', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get recent posts for a user (for dashboard display)
 */
async function getUserRecentPosts(ownerId, limit = 50) {
  const db = ensureClient();
  const { data, error } = await db.from('calendar_posts')
    .select('*')
    .eq('owner_id', ownerId)
    .order('post_date', { ascending: false })
    .order('publish_time', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * Update a post
 */
async function updatePost(postId, updates) {
  const db = ensureClient();
  
  // Map from internal names to DB column names
  const dbUpdates = {};
  const fieldMap = {
    status: 'status',
    caption: 'caption',
    hashtags: 'hashtags',
    imagePath: 'image_path',
    imageUrl: 'image_url',
    videoPath: 'video_path',
    videoUrl: 'video_url',
    error: 'error',
    publishedAt: 'published_at',
    publishResults: 'publish_results',
    imagePrompt: 'image_prompt'
  };

  for (const [key, value] of Object.entries(updates)) {
    const dbKey = fieldMap[key] || key;
    dbUpdates[dbKey] = value;
  }
  dbUpdates.updated_at = new Date().toISOString();

  const { data, error } = await db.from('calendar_posts')
    .update(dbUpdates)
    .eq('id', postId)
    .select()
    .single();

  if (error) throw error;
  logger.info(`Post ${postId} updated`, { status: data.status });
  return data;
}

/**
 * Check if a post already exists for a user/date/time/type combo
 */
async function postExists(ownerId, date, publishTime, postType) {
  const db = ensureClient();
  const { data } = await db.from('calendar_posts')
    .select('id')
    .eq('owner_id', ownerId)
    .eq('post_date', date)
    .eq('publish_time', publishTime)
    .eq('post_type', postType)
    .maybeSingle();

  return !!data;
}

// ─── STATS ──────────────────────────────────

/**
 * Get stats for a specific user
 */
async function getUserStats(ownerId) {
  const db = ensureClient();
  const today = getToday();

  const [todayRes, weekRes, totalRes] = await Promise.all([
    db.from('calendar_posts').select('status').eq('owner_id', ownerId).eq('post_date', today),
    db.from('calendar_posts').select('id', { count: 'exact', head: true })
      .eq('owner_id', ownerId)
      .eq('status', 'published')
      .gte('post_date', new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]),
    db.from('calendar_posts').select('id', { count: 'exact', head: true }).eq('owner_id', ownerId)
  ]);

  const todayPosts = todayRes.data || [];
  return {
    total: totalRes.count || 0,
    today: {
      total: todayPosts.length,
      pending: todayPosts.filter(p => p.status === 'pending').length,
      generating: todayPosts.filter(p => p.status === 'generating').length,
      ready: todayPosts.filter(p => p.status === 'ready').length,
      published: todayPosts.filter(p => p.status === 'published').length,
      error: todayPosts.filter(p => p.status === 'error').length
    },
    thisWeek: { published: weekRes.count || 0 }
  };
}

/**
 * Get global stats (for admin dashboard)
 */
async function getGlobalStats() {
  const db = ensureClient();
  const today = getToday();

  const [todayRes, usersRes] = await Promise.all([
    db.from('calendar_posts').select('status, owner_id').eq('post_date', today),
    db.from('users_config').select('id', { count: 'exact', head: true }).in('plan_status', ['active', 'trial'])
  ]);

  const todayPosts = todayRes.data || [];
  return {
    activeUsers: usersRes.count || 0,
    todayPosts: todayPosts.length,
    todayPublished: todayPosts.filter(p => p.status === 'published').length,
    todayErrors: todayPosts.filter(p => p.status === 'error').length,
    uniqueUsersToday: new Set(todayPosts.map(p => p.owner_id)).size
  };
}

// ─── CLEANUP ──────────────────────────────────

/**
 * Remove old published posts (older than 30 days)
 */
async function cleanup(daysOld = 30) {
  const db = ensureClient();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysOld);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  const { count, error } = await db.from('calendar_posts')
    .delete({ count: 'exact' })
    .eq('status', 'published')
    .lt('post_date', cutoffStr);

  if (error) {
    logger.error('Calendar cleanup failed', { error: error.message });
    return 0;
  }
  
  if (count > 0) {
    logger.info(`Cleaned up ${count} old published posts`);
  }
  return count;
}

export default {
  getToday,
  getNow,
  createPost,
  createPosts,
  getAllPendingPosts,
  getAllReadyToPublish,
  getUserPosts,
  getUserRecentPosts,
  updatePost,
  postExists,
  getUserStats,
  getGlobalStats,
  cleanup,
  isConfigured: () => !!supabase
};
