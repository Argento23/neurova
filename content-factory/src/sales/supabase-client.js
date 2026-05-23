import { createClient } from '@supabase/supabase-js';
import config from '../config.js';
import logger from '../logger.js';

// ═══════════════════════════════════════════════════
// SUPABASE CLIENT — Sales Engine Data Layer
// ═══════════════════════════════════════════════════

const supabase = config.SUPABASE_URL && config.SUPABASE_KEY
  ? createClient(config.SUPABASE_URL, config.SUPABASE_KEY)
  : null;

function ensureClient() {
  if (!supabase) {
    throw new Error('Supabase not configured. Set SUPABASE_URL and SUPABASE_KEY in .env');
  }
  return supabase;
}

// ─── LEADS CRUD ──────────────────────────────────

async function upsertLead(lead) {
  const db = ensureClient();

  // Check if lead already exists by phone or email
  let existing = null;
  if (lead.phone) {
    const { data } = await db.from('sales_leads').select('id').eq('phone', lead.phone).maybeSingle();
    existing = data;
  }
  if (!existing && lead.email) {
    const { data } = await db.from('sales_leads').select('id').eq('email', lead.email).maybeSingle();
    existing = data;
  }

  if (existing) {
    // Update existing lead (don't overwrite certain fields)
    const { data, error } = await db.from('sales_leads')
      .update({
        ...lead,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    logger.info(`Updated existing lead: ${data.name}`, { id: data.id });
    return { data, isNew: false };
  }

  // Insert new lead — ensure V2 defaults
  const insertData = {
    ...lead,
    ai_score: lead.ai_score || lead.lead_score || 0,
    pipeline_stage: lead.pipeline_stage || 'discovered',
    outreach_status: lead.outreach_status || 'pending'
  };
  const { data, error } = await db.from('sales_leads')
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;
  logger.info(`Created new lead: ${data.name}`, { id: data.id });
  return { data, isNew: true };
}

async function getLeads(filters = {}) {
  const db = ensureClient();
  let query = db.from('sales_leads').select('*');

  if (filters.pipeline_stage) query = query.eq('pipeline_stage', filters.pipeline_stage);
  if (filters.industry) query = query.eq('industry', filters.industry);
  if (filters.outreach_status) query = query.eq('outreach_status', filters.outreach_status);
  if (filters.min_score) {
    // Consider both ai_score and lead_score (Panel V1 compat)
    query = query.or(`ai_score.gte.${filters.min_score},lead_score.gte.${filters.min_score}`);
  }
  if (filters.region) query = query.eq('region', filters.region);
  if (filters.city) query = query.eq('city', filters.city);

  // Order by creation date to show the newest leads first
  query = query.order('created_at', { ascending: false });
  query = query.limit(filters.limit || 100);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function getLeadById(id) {
  const db = ensureClient();
  const { data, error } = await db.from('sales_leads').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

async function updateLead(id, updates) {
  const db = ensureClient();
  const { data, error } = await db.from('sales_leads')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function getUnscoredLeads(limit = 50) {
  const db = ensureClient();
  const { data, error } = await db.from('sales_leads')
    .select('*')
    .or('ai_score.eq.0,ai_score.is.null')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

async function getPendingOutreach(limit = 20) {
  const db = ensureClient();
  const { data, error } = await db.from('sales_leads')
    .select('*')
    .eq('outreach_status', 'pending')
    .gte('ai_score', 50)
    .not('pipeline_stage', 'in', '(rejected,dead,unsubscribed)')
    .order('ai_score', { ascending: false })
    .limit(limit);
  if (error) throw error;
  // Extra filter: only leads with at least phone or email
  return (data || []).filter(l => l.phone || l.email);
}

async function getFollowUpLeads(limit = 20) {
  const db = ensureClient();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 5); // Wait 5 days between follow-ups (was 2)

  const { data, error } = await db.from('sales_leads')
    .select('*')
    .eq('outreach_status', 'contacted')
    .not('pipeline_stage', 'in', '(rejected,dead,unsubscribed)')
    .lt('outreach_last_at', cutoff.toISOString())
    .lte('outreach_count', 2) // Max 2 total contacts (1 initial + 1 follow-up)
    .gte('ai_score', 60)
    .order('ai_score', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

async function markLeadRejected(id, reason = 'declined') {
  const db = ensureClient();
  const { data, error } = await db.from('sales_leads')
    .update({
      outreach_status: 'rejected',
      pipeline_stage: 'rejected',
      rejection_reason: reason,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  logger.info(`Lead ${id} marked as rejected: ${reason}`);
  return data;
}

// ─── OUTREACH LOG ──────────────────────────────────

async function logOutreach(entry) {
  const db = ensureClient();
  const { data, error } = await db.from('sales_outreach_log')
    .insert(entry)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function getOutreachHistory(leadId) {
  const db = ensureClient();
  const { data, error } = await db.from('sales_outreach_log')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ─── DISCOVERY BATCHES ──────────────────────────────────

async function logDiscoveryBatch(batch) {
  const db = ensureClient();
  const { data, error } = await db.from('sales_discovery_batches')
    .insert(batch)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── PIPELINE STATS ──────────────────────────────────

async function getPipelineStats() {
  const db = ensureClient();
  const { data, error } = await db.from('sales_pipeline_view').select('*');
  if (error) {
    // Fallback if view doesn't exist yet
    logger.warn('Pipeline view not available, computing manually');
    const { data: leads } = await db.from('sales_leads').select('pipeline_stage, ai_score, deal_value, outreach_status');
    if (!leads) return [];

    const stages = {};
    for (const lead of leads) {
      const s = lead.pipeline_stage || 'discovered';
      if (!stages[s]) stages[s] = { pipeline_stage: s, lead_count: 0, total_score: 0, total_pipeline_value: 0, replied_count: 0 };
      stages[s].lead_count++;
      stages[s].total_score += lead.ai_score || 0;
      stages[s].total_pipeline_value += parseFloat(lead.deal_value || 0);
      if (lead.outreach_status === 'replied') stages[s].replied_count++;
    }

    return Object.values(stages).map(s => ({
      ...s,
      avg_score: s.lead_count ? Math.round(s.total_score / s.lead_count) : 0
    }));
  }
  return data;
}

async function getSalesStats() {
  const db = ensureClient();

  const [
    { count: totalLeads },
    { count: hotByAiScore },
    { count: hotByLeadScore },
    { count: contacted },
    { count: replied },
    { count: closed }
  ] = await Promise.all([
    db.from('sales_leads').select('*', { count: 'exact', head: true }),
    db.from('sales_leads').select('*', { count: 'exact', head: true }).gte('ai_score', 70),
    db.from('sales_leads').select('*', { count: 'exact', head: true }).gte('lead_score', 70),
    db.from('sales_leads').select('*', { count: 'exact', head: true }).eq('outreach_status', 'contacted'),
    db.from('sales_leads').select('*', { count: 'exact', head: true }).eq('outreach_status', 'replied'),
    db.from('sales_leads').select('*', { count: 'exact', head: true }).eq('pipeline_stage', 'closed'),
  ]);

  // Hot leads = whichever score system has more (they should converge after sync)
  const hotLeads = Math.max(hotByAiScore || 0, hotByLeadScore || 0);

  // Revenue from closed deals
  const { data: closedDeals } = await db.from('sales_leads')
    .select('deal_value')
    .eq('pipeline_stage', 'closed');

  const totalRevenue = (closedDeals || []).reduce((sum, d) => sum + parseFloat(d.deal_value || 0), 0);

  return {
    totalLeads: totalLeads || 0,
    hotLeads,
    contacted: contacted || 0,
    replied: replied || 0,
    closed: closed || 0,
    totalRevenue,
    conversionRate: totalLeads > 0 ? ((closed || 0) / totalLeads * 100).toFixed(1) : '0.0'
  };
}

export default {
  upsertLead,
  getLeads,
  getLeadById,
  updateLead,
  getUnscoredLeads,
  getPendingOutreach,
  getFollowUpLeads,
  markLeadRejected,
  logOutreach,
  getOutreachHistory,
  logDiscoveryBatch,
  getPipelineStats,
  getSalesStats,
  isConfigured: () => !!supabase
};
