import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import config from '../config.js';
import logger from '../logger.js';

const CALENDAR_PATH = join(config.DATA_DIR, 'calendar.json');

/**
 * Calendar Manager — Handles content scheduling, topic selection,
 * and post state management. Replaces n8n's Google Sheets integration.
 */
class CalendarManager {
  constructor() {
    this.calendar = this._load();
  }

  _load() {
    try {
      const raw = readFileSync(CALENDAR_PATH, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      logger.error('Failed to load calendar', { error: err.message });
      return { posts: [], topicBank: {}, weekTemplate: [] };
    }
  }

  _save() {
    writeFileSync(CALENDAR_PATH, JSON.stringify(this.calendar, null, 2), 'utf-8');
  }

  /**
   * Get today's date string in YYYY-MM-DD format (Argentina timezone)
   */
  _today() {
    return new Date().toLocaleDateString('en-CA', { timeZone: config.TIMEZONE });
  }

  /**
   * Get current day of week (0=Sunday, 1=Monday, etc.)
   */
  _dayOfWeek() {
    return new Date().toLocaleDateString('en-US', { timeZone: config.TIMEZONE, weekday: 'short' });
  }

  _dayOfWeekNum() {
    const d = new Date();
    // Get day number in Argentina timezone
    const dayStr = d.toLocaleDateString('en-US', { timeZone: config.TIMEZONE, weekday: 'long' });
    const map = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
    return map[dayStr] ?? 0;
  }

  /**
   * Generate posts for a given date based on the weekly template
   */
  generatePostsForDate(dateStr) {
    const date = new Date(dateStr + 'T12:00:00');
    const dayNum = date.getDay();
    const dayTemplate = this.calendar.weekTemplate.find(d => d.dayOfWeek === dayNum);

    if (!dayTemplate || !dayTemplate.slots.length) {
      logger.info(`No slots configured for day ${dayNum} (${dateStr})`);
      return [];
    }

    const newPosts = [];
    for (const slot of dayTemplate.slots) {
      // Check if post already exists for this date+time+type
      const exists = this.calendar.posts.some(
        p => p.date === dateStr && p.publishTime === slot.time && p.type === slot.type
      );
      if (exists) continue;

      // Pick a random topic from the bank
      const topic = this._pickTopic(slot.type, slot.language);

      const post = {
        id: `post_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        date: dateStr,
        type: slot.type,
        topic,
        language: slot.language,
        platforms: [...slot.platforms],
        publishTime: slot.time,
        caption: null,
        hashtags: null,
        imageUrl: null,
        imagePath: null,
        videoPath: null,
        status: 'pending', // pending → generating → ready → publishing → published → error
        error: null,
        createdAt: new Date().toISOString(),
        publishedAt: null
      };

      newPosts.push(post);
      this.calendar.posts.push(post);
    }

    if (newPosts.length > 0) {
      this._save();
      logger.info(`Generated ${newPosts.length} posts for ${dateStr}`);
    }

    return newPosts;
  }

  /**
   * Pick a random topic from the topic bank, avoiding recent repeats
   */
  _pickTopic(type, language) {
    const bank = this.calendar.topicBank[type] || [];
    if (bank.length === 0) return `Default ${type} topic`;

    // Filter by language if possible
    const langFiltered = bank.filter(t => {
      if (language === 'en') return /^[A-Z]/.test(t) || /[a-z]/.test(t.charAt(0));
      return true;
    });
    const pool = langFiltered.length > 0 ? langFiltered : bank;

    // Get recently used topics
    const recentTopics = this.calendar.posts
      .filter(p => p.type === type)
      .slice(-10)
      .map(p => p.topic);

    // Try to pick one not recently used
    const available = pool.filter(t => !recentTopics.includes(t));
    const finalPool = available.length > 0 ? available : pool;

    return finalPool[Math.floor(Math.random() * finalPool.length)];
  }

  /**
   * Get all posts for today
   */
  getTodaysPosts() {
    const today = this._today();
    return this.calendar.posts.filter(p => p.date === today);
  }

  /**
   * Get posts ready to generate (status = pending)
   */
  getPendingPosts() {
    const today = this._today();
    return this.calendar.posts.filter(p => p.date === today && p.status === 'pending');
  }

  /**
   * Get posts ready to publish (status = ready, time has passed)
   */
  getReadyToPublish() {
    const today = this._today();
    const now = new Date().toLocaleTimeString('en-GB', {
      timeZone: config.TIMEZONE,
      hour: '2-digit',
      minute: '2-digit'
    });

    return this.calendar.posts.filter(
      p => p.date === today && p.status === 'ready' && p.publishTime <= now
    );
  }

  /**
   * Update a post's status and data
   */
  updatePost(postId, updates) {
    const post = this.calendar.posts.find(p => p.id === postId);
    if (!post) {
      logger.error(`Post ${postId} not found`);
      return null;
    }

    Object.assign(post, updates);
    this._save();
    logger.info(`Post ${postId} updated`, { status: post.status, type: post.type });
    return post;
  }

  /**
   * Get statistics
   */
  getStats() {
    const today = this._today();
    const todayPosts = this.calendar.posts.filter(p => p.date === today);

    return {
      total: this.calendar.posts.length,
      today: {
        total: todayPosts.length,
        pending: todayPosts.filter(p => p.status === 'pending').length,
        generating: todayPosts.filter(p => p.status === 'generating').length,
        ready: todayPosts.filter(p => p.status === 'ready').length,
        published: todayPosts.filter(p => p.status === 'published').length,
        error: todayPosts.filter(p => p.status === 'error').length
      },
      thisWeek: {
        published: this.calendar.posts.filter(p => {
          const postDate = new Date(p.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return postDate >= weekAgo && p.status === 'published';
        }).length
      }
    };
  }

  /**
   * Clean up old posts (older than 30 days) to keep calendar lean
   */
  cleanup() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    const before = this.calendar.posts.length;
    this.calendar.posts = this.calendar.posts.filter(
      p => p.date >= cutoffStr || p.status !== 'published'
    );

    const removed = before - this.calendar.posts.length;
    if (removed > 0) {
      this._save();
      logger.info(`Cleaned up ${removed} old posts`);
    }
  }
}

// ═══════════════════════════════════════════════════
// CLI HANDLER
// ═══════════════════════════════════════════════════

if (process.argv[1] && process.argv[1].includes('manager.js')) {
  const args = process.argv.slice(2);
  const manager = new CalendarManager();

  if (args.includes('--list')) {
    console.table(manager.getTodaysPosts().map(p => ({
      Time: p.publishTime,
      Status: p.status,
      Topic: p.topic.substring(0, 40),
      Platforms: p.platforms.join(', ')
    })));
  }

  if (args.includes('--force-post')) {
    const topicIdx = args.indexOf('--force-post') + 1;
    const timeIdx = args.indexOf('--time') + 1;
    
    const topic = args[topicIdx] || 'Custom Topic';
    const time = args[timeIdx] || '15:00';
    const date = manager._today();

    const post = {
      id: `manual_${Date.now()}`,
      date,
      type: 'video_corto',
      topic,
      language: 'es',
      platforms: ['instagram', 'tiktok', 'youtube'],
      publishTime: time,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    manager.calendar.posts.push(post);
    manager._save();
    console.log(`✅ Post forzado creado: "${topic}" a las ${time}`);
  }
}

export default new CalendarManager();
