import { createClient } from '@supabase/supabase-js';
import config from '../config.js';
import logger from '../logger.js';

// ═══════════════════════════════════════════════════
// USERS DB — Multi-tenant user configuration layer
// ═══════════════════════════════════════════════════

const supabase = config.SUPABASE_URL && config.SUPABASE_KEY
  ? createClient(config.SUPABASE_URL, config.SUPABASE_KEY)
  : null;

function ensureClient() {
  if (!supabase) throw new Error('Supabase not configured');
  return supabase;
}

/**
 * Get all active subscribers that need content processing
 */
async function getActiveUsers() {
  const db = ensureClient();
  const { data, error } = await db.from('users_config')
    .select('*')
    .in('plan_status', ['active', 'trial'])
    .in('plan', ['starter', 'pro', 'enterprise']);

  if (error) throw error;
  return data || [];
}

/**
 * Get the master/owner account (Gustavo's config)
 */
async function getMasterUser() {
  const db = ensureClient();
  const { data, error } = await db.from('users_config')
    .select('*')
    .eq('plan', 'enterprise')
    .single();

  if (error) {
    logger.warn('Master user not found in DB, using .env fallback');
    return null;
  }
  return data;
}

/**
 * Get user config by ID
 */
async function getUserById(id) {
  const db = ensureClient();
  const { data, error } = await db.from('users_config')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Get user config by Auth User ID
 */
async function getUserByAuthId(userId) {
  const db = ensureClient();
  const { data, error } = await db.from('users_config')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Get user config by email
 */
async function getUserByEmail(email) {
  const db = ensureClient();
  const { data, error } = await db.from('users_config')
    .select('*')
    .eq('email', email)
    .single();
  if (error) return null;
  return data;
}

/**
 * Get user config by PayPal subscription ID
 */
async function getUserByPayPalSubscription(subscriptionId) {
  const db = ensureClient();
  const { data, error } = await db.from('users_config')
    .select('*')
    .eq('paypal_subscription_id', subscriptionId)
    .single();
  if (error) return null;
  return data;
}

/**
 * Create a new user config (called after Supabase Auth signup)
 */
async function createUser(userData) {
  const db = ensureClient();
  const { data, error } = await db.from('users_config')
    .insert(userData)
    .select()
    .single();
  if (error) throw error;
  logger.info(`New user config created: ${data.email}`, { id: data.id });
  return data;
}

/**
 * Update user config
 */
async function updateUser(id, updates) {
  const db = ensureClient();
  const { data, error } = await db.from('users_config')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Activate subscription after PayPal payment
 */
async function activateSubscription(userId, { plan, stripeCustomerId, stripeSubscriptionId }) {
  const db = ensureClient();
  const { data, error } = await db.from('users_config')
    .update({
      plan,
      plan_status: 'active',
      paypal_subscription_id: stripeSubscriptionId, // reused param name for compatibility
      plan_started_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  logger.info(`Subscription activated: ${data.email} → ${plan}`);
  return data;
}

/**
 * Cancel/expire subscription
 */
async function cancelSubscription(paypalSubscriptionId) {
  const db = ensureClient();
  const { data, error } = await db.from('users_config')
    .update({
      plan_status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('paypal_subscription_id', paypalSubscriptionId)
    .select()
    .single();
  if (error) throw error;
  logger.info(`Subscription cancelled: ${data.email}`);
  return data;
}

/**
 * Build a platform credentials object from user config
 * (used by publishers to authenticate per-user)
 */
function getUserCredentials(userConfig) {
  return {
    ig_access_token: userConfig.ig_access_token || config.IG_ACCESS_TOKEN,
    ig_user_id: userConfig.ig_user_id || config.IG_USER_ID,
    fb_page_id: userConfig.fb_page_id || config.FB_PAGE_ID,
    tiktok_client_key: userConfig.tiktok_client_key || config.TIKTOK_CLIENT_KEY,
    tiktok_client_secret: userConfig.tiktok_client_secret || config.TIKTOK_CLIENT_SECRET,
    tiktok_access_token: userConfig.tiktok_access_token || config.TIKTOK_ACCESS_TOKEN,
    tiktok_refresh_token: userConfig.tiktok_refresh_token || config.TIKTOK_REFRESH_TOKEN,
    tiktok_open_id: userConfig.tiktok_open_id || config.TIKTOK_OPEN_ID,
    youtube_client_id: userConfig.youtube_client_id || config.YOUTUBE_CLIENT_ID,
    youtube_client_secret: userConfig.youtube_client_secret || config.YOUTUBE_CLIENT_SECRET,
    youtube_refresh_token: userConfig.youtube_refresh_token || config.YOUTUBE_REFRESH_TOKEN,
    evolution_instance: userConfig.evolution_instance || config.EVOLUTION_INSTANCE,
    evolution_api_url: userConfig.evolution_api_url || config.EVOLUTION_API_URL,
    evolution_api_key: userConfig.evolution_api_key || config.EVOLUTION_API_KEY,
  };
}

/**
 * Log a PayPal webhook event
 */
async function logPayPalEvent(event) {
  const db = ensureClient();
  const { error } = await db.from('payment_events').insert({
    provider: 'paypal',
    event_id: event.id,
    event_type: event.event_type,
    customer_email: event.resource?.subscriber?.email_address || event.resource?.payer?.email_address,
    subscription_id: event.resource?.id || event.resource?.billing_agreement_id,
    amount: parseFloat(event.resource?.amount?.total || 0),
    currency: event.resource?.amount?.currency || 'USD',
    payload: event,
    processed: true
  });
  if (error) logger.error('Failed to log PayPal event', { error: error.message });
}

export default {
  getActiveUsers,
  getMasterUser,
  getUserById,
  getUserByAuthId,
  getUserByEmail,
  getUserByPayPalSubscription,
  createUser,
  updateUser,
  activateSubscription,
  cancelSubscription,
  getUserCredentials,
  logPayPalEvent,
  isConfigured: () => !!supabase
};
