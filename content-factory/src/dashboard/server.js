import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import config from '../config.js';
import logger from '../logger.js';
import calendar from '../calendar/manager.js';
import {
  generateContent, publishContent, dailyReport,
  runLeadDiscovery, runLeadScoring, runOutreach, runFollowUps
} from '../scheduler.js';
import instagramPublisher from '../publishers/instagram.js';
import facebookPublisher from '../publishers/facebook.js';
import tiktokPublisher from '../publishers/tiktok.js';
import youtubePublisher from '../publishers/youtube.js';
// Sales Engine
import supabaseClient from '../sales/supabase-client.js';
import leadFinder from '../sales/lead-finder.js';
import outreachEngine from '../sales/outreach-engine.js';
import outreachTemplates from '../sales/outreach-templates.js';
// Multi-tenant modules
import usersDb from '../db/users-db.js';
import calendarDb from '../db/calendar-db.js';
import marketplaceDb from '../db/marketplace-db.js';
import stripeWebhook from '../payments/stripe-webhook.js';
import whatsappWebhook, { verifyWhatsAppWebhook } from '../sales/whatsapp-webhook.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Serve video files publicly (needed for Instagram Reels)
app.use('/media/videos', express.static(join(config.ROOT_DIR, 'output', 'videos')));
// Serve image files publicly
app.use('/media/images', express.static(join(config.ROOT_DIR, 'output', 'images')));

// Storefront (public landing page)
app.get('/storefront', (req, res) => res.sendFile(join(__dirname, 'public', 'index.html')));
app.get('/tienda', (req, res) => res.sendFile(join(__dirname, 'public', 'index.html')));

// Master Agency Panel (Gustavo's private panel)
app.get('/admin', (req, res) => res.sendFile(join(__dirname, 'public', 'admin.html')));

// Client SaaS UI routes
app.get('/auth', (req, res) => res.sendFile(join(__dirname, 'public', 'auth.html')));
app.get('/app', (req, res) => res.sendFile(join(__dirname, 'public', 'app.html')));
app.get('/marketplace', (req, res) => res.sendFile(join(__dirname, 'public', 'marketplace.html')));

// TikTok Auth Callback (for reviewers and manual script)
app.get('/callback/tiktok', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>TikTok Auth Success - GenerArise</title>
        <style>
          body { background: #030307; color: #fff; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .box { background: #0a0a0f; border: 1px solid rgba(34,211,238,0.3); padding: 40px; border-radius: 16px; text-align: center; max-width: 400px; }
          h1 { color: #22d3ee; margin-top: 0; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>✅ Autorización Exitosa</h1>
          <p>Has conectado tu cuenta de TikTok con GenerArise correctamente.</p>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">Por favor, copia la URL completa de esta página si el equipo de soporte te la solicitó, o simplemente cierra esta ventana para volver a tu panel.</p>
        </div>
      </body>
    </html>
  `);
});

// Public config for Supabase Auth in frontend
app.get('/api/public-config', (req, res) => {
  res.json({
    supabaseUrl: config.SUPABASE_URL,
    supabaseAnonKey: config.SUPABASE_KEY, // In a real app this should be the ANON key, not service role!
    paypalClientId: process.env.PAYPAL_CLIENT_ID,
    tiktokClientKey: process.env.TIKTOK_CLIENT_KEY
  });
});

// ═══════════════════════════════════════════════════
// CONTENT FACTORY API ROUTES
// ═══════════════════════════════════════════════════

app.get('/api/status', (req, res) => {
  const stats = calendar.getStats();
  const platforms = {
    instagram: { configured: instagramPublisher.isConfigured(), name: 'Instagram' },
    facebook: { configured: facebookPublisher.isConfigured(), name: 'Facebook' },
    tiktok: { configured: tiktokPublisher.isConfigured(), name: 'TikTok' },
    youtube: { configured: youtubePublisher.isConfigured(), name: 'YouTube' }
  };
  res.json({
    brand: config.BRAND_NAME,
    timezone: config.TIMEZONE,
    serverTime: new Date().toLocaleString('es-AR', { timeZone: config.TIMEZONE }),
    stats, platforms,
    uptime: process.uptime(),
    salesEngine: supabaseClient.isConfigured()
  });
});

app.get('/api/posts/today', (req, res) => { res.json(calendar.getTodaysPosts()); });
app.get('/api/posts', (req, res) => { res.json(calendar.calendar.posts.slice(-50).reverse()); });

app.post('/api/actions/generate', async (req, res) => {
  res.json({ started: true, message: 'Content generation started' });
  generateContent().catch(err => logger.error('Manual generation failed', { error: err.message }));
});

app.post('/api/actions/publish', async (req, res) => {
  res.json({ started: true, message: 'Publishing started' });
  publishContent().catch(err => logger.error('Manual publish failed', { error: err.message }));
});

app.post('/api/actions/report', async (req, res) => {
  try { await dailyReport(); res.json({ sent: true }); }
  catch (err) { res.status(500).json({ sent: false, error: err.message }); }
});

app.get('/api/validate/instagram', async (req, res) => {
  const result = await instagramPublisher.validateToken();
  res.json(result);
});

// ═══════════════════════════════════════════════════
// SALES ENGINE API ROUTES
// ═══════════════════════════════════════════════════

// Get all leads with filters
app.get('/api/sales/leads', async (req, res) => {
  try {
    const filters = {
      pipeline_stage: req.query.stage,
      industry: req.query.industry,
      outreach_status: req.query.outreach,
      min_score: req.query.min_score ? parseInt(req.query.min_score) : undefined,
      region: req.query.region,
      city: req.query.city,
      limit: req.query.limit ? parseInt(req.query.limit) : 50
    };
    const leads = await supabaseClient.getLeads(filters);
    res.json(leads);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get single lead
app.get('/api/sales/leads/:id', async (req, res) => {
  try {
    const lead = await supabaseClient.getLeadById(req.params.id);
    const history = await supabaseClient.getOutreachHistory(req.params.id);
    res.json({ ...lead, outreach_history: history });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update lead stage/status
app.patch('/api/sales/leads/:id', async (req, res) => {
  try {
    const lead = await supabaseClient.updateLead(req.params.id, req.body);
    res.json(lead);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete lead
app.delete('/api/sales/leads/:id', async (req, res) => {
  try {
    await supabaseClient.deleteLead(req.params.id);
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    logger.error('Error deleting lead', { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// Get pre-rendered draft for a lead
app.get('/api/sales/leads/:id/draft', async (req, res) => {
  try {
    const { id } = req.params;
    const { channel, step, category } = req.query;

    const lead = await supabaseClient.getLeadById(id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    if (channel === 'email') {
      const subject = outreachTemplates.renderEmailSubject(lead);
      const body = outreachTemplates.renderEmailBody(lead);
      return res.json({ subject, body });
    }

    if (channel === 'whatsapp') {
      let message = '';
      if (step === '1') message = outreachTemplates.renderMessage(lead, 'whatsapp_first');
      else if (step === '2') message = outreachTemplates.renderMessage(lead, 'whatsapp_second');
      else if (step === '3') message = outreachTemplates.renderMessage(lead, 'whatsapp_third');
      else if (step === '5') message = outreachTemplates.renderMessage(lead, 'whatsapp_closing');
      else message = outreachTemplates.renderMessage(lead, 'whatsapp_first'); // Fallback

      return res.json({ message });
    }

    if (channel === 'ia') {
      const msg = await outreachEngine.generateAIOutreach(lead, category || 'outreach_industrial');
      if (msg) {
        return res.json({ message: msg });
      } else {
        return res.json({ message: outreachTemplates.renderMessage(lead, 'whatsapp_first'), fallback: true });
      }
    }

    res.status(400).json({ error: 'Invalid channel. Use "whatsapp", "email", or "ia"' });
  } catch (err) {
    logger.error('Error generating lead draft', { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// Send manual WhatsApp message (official Meta priority with manual Evolution fallback support)
app.post('/api/sales/leads/:id/whatsapp', async (req, res) => {
  try {
    const { id } = req.params;
    const { message, step, provider } = req.body;
    if (!message) return res.status(400).json({ error: 'Message content is required' });

    const lead = await supabaseClient.getLeadById(id);
    if (!lead || !lead.phone) return res.status(404).json({ error: 'Lead not found or has no phone' });

    logger.info(`Sending manual WhatsApp to ${lead.name} using provider: ${provider || 'default (config)'}`);
    const result = await outreachEngine.sendWhatsApp(lead.phone, message, null, provider);

    if (result.success) {
      // Update lead stages/status
      const updateData = {
        outreach_last_at: new Date().toISOString(),
        outreach_count: (lead.outreach_count || 0) + 1
      };
      
      if (step) {
        const stepNum = parseInt(step);
        if (stepNum === 1) {
          updateData.pipeline_stage = 'contacted';
          updateData.outreach_status = 'contacted';
          updateData.step1_sent_at = new Date().toISOString();
        } else if (stepNum === 2) {
          updateData.pipeline_stage = 'demo';
          updateData.step2_sent_at = new Date().toISOString();
        } else if (stepNum === 3) {
          updateData.pipeline_stage = 'responded';
          updateData.form_sent = true;
        } else if (stepNum === 5) {
          updateData.pipeline_stage = 'closed';
        }
      }
      
      await supabaseClient.updateLead(id, updateData);

      // Log to history
      await supabaseClient.logOutreach({
        lead_id: id,
        channel: 'whatsapp',
        status: 'sent',
        message_sent: message,
        created_at: new Date().toISOString()
      });

      res.json({ success: true, provider: result.provider, messageId: result.messageId });
    } else {
      res.status(500).json({ error: result.error || 'Failed to send WhatsApp message' });
    }
  } catch (err) {
    logger.error('Error sending manual WhatsApp', { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// Send manual Email (SMTP Brevo)
app.post('/api/sales/leads/:id/email', async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, body } = req.body;
    if (!subject || !body) return res.status(400).json({ error: 'Subject and body are required' });

    const lead = await supabaseClient.getLeadById(id);
    if (!lead || !lead.email) return res.status(404).json({ error: 'Lead not found or has no email' });

    logger.info(`Sending manual Email to ${lead.name} (${lead.email})`);
    const result = await outreachEngine.sendEmail(lead.email, subject, body);

    if (result.success) {
      const updateData = {
        outreach_last_at: new Date().toISOString(),
        outreach_count: (lead.outreach_count || 0) + 1
      };
      await supabaseClient.updateLead(id, updateData);

      // Log to history
      await supabaseClient.logOutreach({
        lead_id: id,
        channel: 'email',
        status: 'sent',
        message_sent: `Subject: ${subject}\n\n${body}`,
        created_at: new Date().toISOString()
      });

      res.json({ success: true, messageId: result.messageId });
    } else {
      res.status(500).json({ error: result.error || 'Failed to send email' });
    }
  } catch (err) {
    logger.error('Error sending manual Email', { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// Get pipeline stats
app.get('/api/sales/pipeline', async (req, res) => {
  try {
    const pipeline = await supabaseClient.getPipelineStats();
    res.json(pipeline);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get sales stats (KPIs)
app.get('/api/sales/stats', async (req, res) => {
  try {
    const stats = await supabaseClient.getSalesStats();
    res.json(stats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Instagram Webhook Verification
app.get('/api/webhooks/instagram', (req, res) => {
  const challenge = req.query['hub.challenge'];
  if (challenge) res.status(200).send(challenge);
  else res.status(400).send('No challenge provided');
});

// Instagram Webhook Payload (Inbound DMs -> Leads)
app.post('/api/webhooks/instagram', async (req, res) => {
  try {
    const body = req.body;
    if (body.object === 'instagram') {
      for (const entry of body.entry || []) {
        for (const msg of entry.messaging || []) {
          if (msg.message && msg.sender && msg.sender.id) {
            const igUserId = msg.sender.id;
            await supabaseClient.upsertLead({
              name: `IG User ${igUserId}`,
              company: `Instagram Account`,
              industry: 'unknown',
              discovery_source: 'instagram_dm',
              pipeline_stage: 'contacted',
              outreach_status: 'responded',
              source: 'inbound_social'
            });
            logger.info(`Registered Inbound IG Lead: ${igUserId}`);
          }
        }
      }
    }
    res.status(200).send('EVENT_RECEIVED');
  } catch (err) {
    logger.error('Instagram Webhook Error', { error: err.message });
    res.sendStatus(500);
  }
});

// WhatsApp Webhook — Meta Cloud API (primary) + Evolution API (legacy fallback)
app.get('/api/webhooks/whatsapp', verifyWhatsAppWebhook);
app.post('/api/webhooks/whatsapp', whatsappWebhook);

// Generic B2B Ingestion Webhook (e.g., from n8n / LinkedIn)
app.post('/api/sales/ingest', async (req, res) => {
  try {
    const { name, company, position, linkedin_url, email, source } = req.body;
    if (!name || !company) return res.status(400).json({ error: 'Name and company required' });

    await supabaseClient.upsertLead({
      name, company,
      industry: 'B2B/Corporate',
      website_url: linkedin_url,
      email,
      discovery_source: source || 'b2b_automation',
      pipeline_stage: 'discovered',
      outreach_status: 'pending',
      source: 'b2b_ingest'
    });
    
    logger.info(`Ingested B2B Lead: ${name} at ${company}`);
    res.json({ success: true, message: 'Lead ingested successfully' });
  } catch (err) {
    logger.error('B2B Ingest Error', { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// Trigger lead discovery manually
app.post('/api/sales/discover', async (req, res) => {
  const { industry, regionKey, industries, regions, maxResults } = req.body;
  
  const indList = industries || (industry ? [industry] : ['hotel']);
  const regList = regions || (regionKey ? [regionKey] : ['buenos_aires']);
  
  const configs = [];
  for (const i of indList) {
    for (const r of regList) {
      configs.push({ industry: i, regionKey: r, maxResults: maxResults || 15 });
    }
  }

  res.json({ started: true, message: `Batch discovering ${configs.length} combinations` });
  leadFinder.runBatchDiscovery(configs)
    .catch(err => logger.error('Manual batch discovery failed', { error: err.message }));
});

// Trigger outreach manually
app.post('/api/sales/outreach', async (req, res) => {
  const { type, maxLeads, dryRun } = req.body;
  res.json({ started: true, message: `Outreach ${type || 'new'} started (dryRun: ${!!dryRun})` });
  outreachEngine.runOutreachBatch({ type: type || 'new', maxLeads: maxLeads || 5, dryRun: !!dryRun })
    .catch(err => logger.error('Manual outreach failed', { error: err.message }));
});

// Trigger scoring manually
app.post('/api/sales/score', async (req, res) => {
  res.json({ started: true, message: 'Scoring started' });
  runLeadScoring().catch(err => logger.error('Manual scoring failed', { error: err.message }));
});

// Get available industries and regions
app.get('/api/sales/options', (req, res) => {
  res.json({
    industries: Object.keys(leadFinder.INDUSTRY_QUERIES),
    regions: Object.keys(leadFinder.REGIONS).map(k => ({
      key: k,
      ...leadFinder.REGIONS[k]
    }))
  });
});

// ═══════════════════════════════════════════════════
// STRIPE WEBHOOK (must use raw body parser)
// ═══════════════════════════════════════════════════

app.use('/api/stripe', stripeWebhook);

// ═══════════════════════════════════════════════════
// MARKETPLACE API ROUTES
// ═══════════════════════════════════════════════════

app.get('/api/marketplace/listings', async (req, res) => {
  try {
    const filters = {
      industry: req.query.industry,
      city: req.query.city,
      country: req.query.country,
      minScore: req.query.min_score ? parseInt(req.query.min_score) : undefined,
      maxPrice: req.query.max_price ? parseFloat(req.query.max_price) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit) : 50
    };
    const listings = await marketplaceDb.getListings(filters);
    res.json(listings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/marketplace/stats', async (req, res) => {
  try {
    const stats = await marketplaceDb.getStats();
    res.json(stats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/marketplace/industries', async (req, res) => {
  try {
    const industries = await marketplaceDb.getAvailableIndustries();
    res.json(industries);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/marketplace/purchase/:id', async (req, res) => {
  try {
    const { buyerId } = req.body;
    if (!buyerId) return res.status(400).json({ error: 'buyerId required' });
    const lead = await marketplaceDb.purchaseLead(req.params.id, buyerId);
    res.json(lead);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════════════════════════════════════════
// USER CONFIG API ROUTES
// ═══════════════════════════════════════════════════

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await usersDb.getUserById(req.params.id);
    // Strip sensitive credentials from response
    const { ig_access_token, youtube_client_secret, tiktok_client_secret, 
            evolution_api_key, stripe_customer_id, ...safe } = user;
    res.json(safe);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/users/init', async (req, res) => {
  try {
    const { user_id, email } = req.body;
    let user;
    
    try {
      // Check if user already exists
      user = await usersDb.getUserByAuthId(user_id);
    } catch (e) {
      // PGRST116 means zero rows returned
      if (e.code === 'PGRST116') {
        user = await usersDb.createUser({
          user_id, email,
          brand_name: '', content_niche: '', language: 'es', platforms_enabled: [], plan_status: 'trial'
        });
      } else {
        throw e;
      }
    }
    
    res.json(user);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

app.patch('/api/users/:id', async (req, res) => {
  try {
    const user = await usersDb.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════════════════════════════════════════
// CLOUD CALENDAR API ROUTES (multi-tenant)
// ═══════════════════════════════════════════════════

app.get('/api/calendar/posts/:ownerId', async (req, res) => {
  try {
    const date = req.query.date || calendarDb.getToday();
    const posts = await calendarDb.getUserPosts(req.params.ownerId, date);
    res.json(posts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/calendar/recent/:ownerId', async (req, res) => {
  try {
    const posts = await calendarDb.getUserRecentPosts(req.params.ownerId, 50);
    res.json(posts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/calendar/stats/:ownerId', async (req, res) => {
  try {
    const stats = await calendarDb.getUserStats(req.params.ownerId);
    res.json(stats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/calendar/posts', async (req, res) => {
  try {
    const post = await calendarDb.createPost(req.body);
    res.json(post);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: global stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const [calStats, salesStats, mktStats] = await Promise.all([
      calendarDb.getGlobalStats(),
      supabaseClient.getSalesStats(),
      marketplaceDb.getStats()
    ]);
    res.json({ calendar: calStats, sales: salesStats, marketplace: mktStats });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════════════════════════════════════════

export function startDashboard() {
  app.listen(config.DASHBOARD_PORT, () => {
    logger.info(`📊 Dashboard running at http://localhost:${config.DASHBOARD_PORT}`);
    logger.info(`📁 Media served at ${config.PUBLIC_URL}/media/videos/`);
    if (supabaseClient.isConfigured()) {
      logger.info(`🎯 Sales Engine API active`);
    }
    if (usersDb.isConfigured()) {
      logger.info(`👥 Multi-tenant API active`);
      logger.info(`🛒 Marketplace API active`);
      logger.info(`💳 Stripe webhook at /api/stripe/webhook`);
    }
  });
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  startDashboard();
}

export default app;
