import { createClient } from '@supabase/supabase-js';
import config from '../config.js';
import logger from '../logger.js';

// ═══════════════════════════════════════════════════
// LEAD MARKETPLACE — Buy/sell qualified B2B leads
// ═══════════════════════════════════════════════════

const supabase = config.SUPABASE_URL && config.SUPABASE_KEY
  ? createClient(config.SUPABASE_URL, config.SUPABASE_KEY)
  : null;

function ensureClient() {
  if (!supabase) throw new Error('Supabase not configured');
  return supabase;
}

/**
 * List a lead on the marketplace (called after scoring)
 * Only lists leads with score >= 60 and valid contact info
 */
async function listLead(lead, priceUsd = 25.00) {
  const db = ensureClient();

  // Don't list if already listed
  const { data: existing } = await db.from('lead_marketplace')
    .select('id')
    .eq('lead_id', lead.id)
    .maybeSingle();

  if (existing) return null;

  // Create anonymized description
  const description = buildDescription(lead);

  const { data, error } = await db.from('lead_marketplace')
    .insert({
      lead_id: lead.id,
      industry: lead.industry || 'General',
      city: lead.city || null,
      country: lead.country || null,
      ai_score: lead.ai_score || 0,
      has_phone: !!lead.phone,
      has_email: !!lead.email,
      has_website: !!lead.website_url,
      description,
      price_usd: priceUsd
    })
    .select()
    .single();

  if (error) throw error;
  logger.info(`Lead listed on marketplace: ${lead.industry} in ${lead.city}`, { id: data.id });
  return data;
}

/**
 * Get available listings with optional filters
 */
async function getListings(filters = {}) {
  const db = ensureClient();
  let query = db.from('lead_marketplace')
    .select('*')
    .eq('status', 'available')
    .gt('expires_at', new Date().toISOString());

  if (filters.industry) query = query.eq('industry', filters.industry);
  if (filters.city) query = query.ilike('city', `%${filters.city}%`);
  if (filters.country) query = query.eq('country', filters.country);
  if (filters.minScore) query = query.gte('ai_score', filters.minScore);
  if (filters.maxPrice) query = query.lte('price_usd', filters.maxPrice);

  query = query.order('ai_score', { ascending: false });
  query = query.limit(filters.limit || 50);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Get marketplace stats
 */
async function getStats() {
  const db = ensureClient();

  const [availableRes, soldRes, revenueRes] = await Promise.all([
    db.from('lead_marketplace').select('id', { count: 'exact', head: true }).eq('status', 'available'),
    db.from('lead_marketplace').select('id', { count: 'exact', head: true }).eq('status', 'sold'),
    db.from('lead_marketplace').select('price_usd').eq('status', 'sold')
  ]);

  const totalRevenue = (revenueRes.data || []).reduce((sum, l) => sum + parseFloat(l.price_usd || 0), 0);

  return {
    available: availableRes.count || 0,
    sold: soldRes.count || 0,
    totalRevenue,
    avgPrice: (soldRes.count || 0) > 0 ? (totalRevenue / soldRes.count).toFixed(2) : '0.00'
  };
}

/**
 * Purchase a lead — reveals contact info to buyer
 */
async function purchaseLead(listingId, buyerId) {
  const db = ensureClient();

  // Get the listing
  const { data: listing, error: listErr } = await db.from('lead_marketplace')
    .select('*, sales_leads(*)')
    .eq('id', listingId)
    .eq('status', 'available')
    .single();

  if (listErr || !listing) {
    throw new Error('Listing not found or already sold');
  }

  // Mark as sold
  const { error: updateErr } = await db.from('lead_marketplace')
    .update({
      status: 'sold',
      purchased_by: buyerId,
      purchased_at: new Date().toISOString()
    })
    .eq('id', listingId);

  if (updateErr) throw updateErr;

  // Return the full lead data (with contact info now visible)
  logger.info(`Lead purchased: ${listing.industry} → buyer ${buyerId}`);
  return {
    name: listing.sales_leads?.name,
    company: listing.sales_leads?.company,
    phone: listing.sales_leads?.phone,
    email: listing.sales_leads?.email,
    website: listing.sales_leads?.website_url,
    industry: listing.industry,
    city: listing.city,
    country: listing.country,
    aiScore: listing.ai_score,
    googleRating: listing.sales_leads?.google_rating,
    googleReviews: listing.sales_leads?.google_reviews_count
  };
}

/**
 * Auto-list qualifying leads after scoring
 * Called by the scoring pipeline
 */
async function autoListQualifiedLeads() {
  const db = ensureClient();

  // Find scored leads not yet listed (master account leads or unowned)
  const { data: leads, error } = await db.from('sales_leads')
    .select('*')
    .gte('ai_score', 60)
    .not('pipeline_stage', 'in', '(closed,dead,rejected,unsubscribed)')
    .order('ai_score', { ascending: false })
    .limit(100);

  if (error) throw error;
  if (!leads || leads.length === 0) return { listed: 0 };

  let listed = 0;
  for (const lead of leads) {
    try {
      // Price based on score
      let price = 25;
      if (lead.ai_score >= 90) price = 75;
      else if (lead.ai_score >= 80) price = 50;
      else if (lead.ai_score >= 70) price = 35;

      const result = await listLead(lead, price);
      if (result) listed++;
    } catch (err) {
      // Skip duplicates silently
    }
  }

  if (listed > 0) {
    logger.info(`Auto-listed ${listed} leads on marketplace`);
  }
  return { listed };
}

/**
 * Build an anonymized but compelling description
 */
function buildDescription(lead) {
  const parts = [];
  if (lead.company) parts.push(`${lead.industry || 'Business'} company`);
  if (lead.city) parts.push(`in ${lead.city}`);
  if (lead.google_rating) parts.push(`${lead.google_rating}★ Google rating`);
  if (lead.google_reviews_count > 10) parts.push(`${lead.google_reviews_count} reviews`);
  if (lead.ig_followers > 100) parts.push(`${lead.ig_followers} IG followers`);
  if (lead.website_url) parts.push(`has website`);
  return parts.join(', ') || `${lead.industry || 'Business'} lead`;
}

/**
 * Get available industries for marketplace filtering
 */
async function getAvailableIndustries() {
  const db = ensureClient();
  const { data, error } = await db.from('lead_marketplace')
    .select('industry')
    .eq('status', 'available');

  if (error) return [];
  const unique = [...new Set((data || []).map(d => d.industry))];
  return unique.sort();
}

export default {
  listLead,
  getListings,
  getStats,
  purchaseLead,
  autoListQualifiedLeads,
  getAvailableIndustries,
  isConfigured: () => !!supabase
};
