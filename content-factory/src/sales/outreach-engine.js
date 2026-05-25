import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import config from '../config.js';
import logger from '../logger.js';
import supabase from './supabase-client.js';
import templates from './outreach-templates.js';
import telegram from '../notifications/telegram.js';

// ═══════════════════════════════════════════════════
// OUTREACH ENGINE — Automated Multi-Channel Contact
// ═══════════════════════════════════════════════════

// ─── FREE TIER SAFE LIMITS ─────────────────────────
// Meta Cloud API: 1,000 free service conversations/month
// Business-initiated (outreach) = paid per template, BUT
// we use free-form text within 24h windows when possible
// Conservative limits to stay 100% free:
const DAILY_LIMITS = {
  whatsapp_new: 8,        // ~240/month — conservative for free tier
  whatsapp_followup: 10,  // Only to leads who already replied (free service window)
  email: 50,              // Email is independent
  linkedin: 20,           // LinkedIn is independent
  social_dm: 50           // IG/FB DMs
};

let dailyCounters = { whatsapp_new: 0, whatsapp_followup: 0, email: 0, linkedin: 0, social_dm: 0 };

const INDUSTRIAL_INDUSTRIES = [
  'logistica_petrolera', 'servicios_mineria', 'seguridad_industrial', 
  'mantenimiento_industrial', 'consultora_ambiental'
];

// ─── AI MESSAGE GENERATION ──────────────────────────

async function generateAIOutreach(lead, category = 'outreach_industrial') {
  try {
    const promptPath = path.join(process.cwd(), 'data', 'prompt_library.json');
    const library = JSON.parse(await fs.readFile(promptPath, 'utf8'));
    const entry = library[category];
    if (!entry) throw new Error(`Category ${category} not found`);

    let prompt = entry.prompt
      .replace('{name}', lead.name || 'amigo/a')
      .replace('{company}', lead.company || 'tu empresa')
      .replace('{industry}', lead.industry || 'el sector')
      .replace('{city}', lead.city || 'Argentina');

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: entry.system },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8, max_tokens: 200
    }, { headers: { 'Authorization': `Bearer ${config.GROQ_API_KEY}`, 'Content-Type': 'application/json' } });

    return response.data.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    logger.error('AI outreach generation failed', { error: error.message });
    return null;
  }
}

function resetDailyCounters() {
  dailyCounters = { whatsapp_new: 0, whatsapp_followup: 0, email: 0, linkedin: 0, social_dm: 0 };
  logger.info('Outreach daily counters reset');
}

// ─── WHATSAPP PROVIDER DETECTION ───────────────────

function getWhatsAppProvider() {
  const provider = config.WHATSAPP_PROVIDER;
  
  if (provider === 'cloud_api') {
    if (config.META_CLOUD_TOKEN && config.META_PHONE_NUMBER_ID) {
      return 'cloud_api';
    }
    logger.error('WHATSAPP_PROVIDER is set to cloud_api, but META_CLOUD_TOKEN or META_PHONE_NUMBER_ID is missing!');
    return null;
  }
  
  if (provider === 'evolution') {
    if (config.EVOLUTION_API_URL && config.EVOLUTION_API_KEY) {
      return 'evolution';
    }
    logger.error('WHATSAPP_PROVIDER is set to evolution, but EVOLUTION_API_URL or EVOLUTION_API_KEY is missing!');
    return null;
  }

  // Fallback ONLY if WHATSAPP_PROVIDER is not explicitly set
  if (config.META_CLOUD_TOKEN && config.META_PHONE_NUMBER_ID) return 'cloud_api';
  if (config.EVOLUTION_API_URL && config.EVOLUTION_API_KEY) return 'evolution';
  return null;
}

// ─── HEALTH CHECK (supports both providers) ────────

async function checkEvolutionHealth() {
  const provider = getWhatsAppProvider();
  
  if (provider === 'cloud_api') {
    // Meta Cloud API — check by verifying the phone number status
    try {
      const res = await axios.get(
        `https://graph.facebook.com/${config.META_API_VERSION}/${config.META_PHONE_NUMBER_ID}`,
        { headers: { 'Authorization': `Bearer ${config.META_CLOUD_TOKEN}` }, timeout: 10000 }
      );
      const status = res.data?.quality_rating || 'unknown';
      return { healthy: true, state: 'cloud_api_connected', provider: 'cloud_api', quality: status };
    } catch (err) {
      return { healthy: false, state: 'error', provider: 'cloud_api', reason: err.response?.data?.error?.message || err.message };
    }
  }
  
  if (provider === 'evolution') {
    const baseUrl = config.EVOLUTION_API_URL.endsWith('/') 
      ? config.EVOLUTION_API_URL.slice(0, -1) 
      : config.EVOLUTION_API_URL;
    try {
      const res = await axios.get(`${baseUrl}/instance/connectionState/${config.EVOLUTION_INSTANCE}`, {
        headers: { 'apikey': config.EVOLUTION_API_KEY }, timeout: 10000
      });
      const state = res.data?.instance?.state || res.data?.state || 'unknown';
      return { healthy: state === 'open', state, provider: 'evolution', reason: state !== 'open' ? `Instance state: ${state}` : null };
    } catch (err) {
      return { healthy: false, state: 'error', provider: 'evolution', reason: err.response?.status === 500 ? 'Evolution API server error (500)' : err.message };
    }
  }
  
  return { healthy: false, reason: 'no_whatsapp_provider_configured' };
}

// ─── WHATSAPP VIA META CLOUD API (Official — no bans) ───

async function sendWhatsAppCloudAPI(phone, message, templateData = null) {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  try {
    let payload;
    
    if (templateData) {
      // Send official WhatsApp Template (No bans!)
      payload = {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'template',
        template: {
          name: templateData.name || 'neurova_outreach',
          language: { code: templateData.language || 'es' },
          components: [
            {
              type: 'body',
              parameters: templateData.parameters.map(text => ({
                type: 'text',
                text: text.substring(0, 1000) // Meta body parameters limit
              }))
            }
          ]
        }
      };
      logger.info(`Sending WhatsApp Cloud API Template "${payload.template.name}" to ${cleanPhone}`);
    } else {
      // Send regular text message (only works if 24h customer window is open)
      payload = {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'text',
        text: { body: message }
      };
      logger.info(`Sending WhatsApp Cloud API free-text to ${cleanPhone}`);
    }

    const response = await axios.post(
      `https://graph.facebook.com/${config.META_API_VERSION}/${config.META_PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${config.META_CLOUD_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    const msgId = response.data?.messages?.[0]?.id;
    logger.info(`WhatsApp (Cloud API) sent successfully to ${cleanPhone}`, { messageId: msgId });
    return { success: true, messageId: msgId, provider: 'cloud_api' };
  } catch (error) {
    const metaError = error.response?.data?.error;
    let errorMsg = metaError?.message || error.message;
    const errorCode = metaError?.code;
    
    // Common error codes
    const isInvalid = errorCode === 131026 || // Number not on WhatsApp
                      errorCode === 131021 || // Recipient not valid
                      errorMsg.includes('not a valid WhatsApp');
    
    const isRateLimit = errorCode === 131056 || // Rate limit hit
                        errorCode === 130429;   // Too many requests
    
    if (isRateLimit) {
      logger.warn(`Cloud API rate limit hit — pausing outreach`, { phone: cleanPhone });
    }
    
    logger.error(`WhatsApp (Cloud API) failed`, { phone: cleanPhone, error: errorMsg, code: errorCode });
    return { success: false, error: errorMsg, isInvalid, isRateLimit, provider: 'cloud_api' };
  }
}

// ─── WHATSAPP VIA EVOLUTION API (Legacy fallback) ───

async function sendWhatsAppEvolution(phone, message) {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  const baseUrl = config.EVOLUTION_API_URL.endsWith('/') 
    ? config.EVOLUTION_API_URL.slice(0, -1) 
    : config.EVOLUTION_API_URL;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await axios.post(
        `${baseUrl}/message/sendText/${config.EVOLUTION_INSTANCE}`,
        { number: cleanPhone, text: message, options: { delay: 1200, presence: 'composing', linkPreview: true } },
        { headers: { 'Content-Type': 'application/json', 'apikey': config.EVOLUTION_API_KEY }, timeout: 30000 }
      );
      logger.info(`WhatsApp (Evolution) sent to ${cleanPhone}`);
      return { success: true, messageId: response.data?.key?.id || response.data?.item?.key?.id, provider: 'evolution' };
    } catch (error) {
      let errorMsg = error.message;
      if (error.response?.data?.response?.message?.[0]?.exists === false) errorMsg = 'Number does not exist on WhatsApp';
      else if (error.response?.data?.message) errorMsg = typeof error.response.data.message === 'string' ? error.response.data.message : JSON.stringify(error.response.data.message);
      
      const is5xx = error.response?.status >= 500;
      if (is5xx && attempt === 0) {
        logger.warn(`Evolution got ${error.response?.status}, retrying in 10s...`, { phone: cleanPhone });
        await new Promise(r => setTimeout(r, 10000));
        continue;
      }
      logger.error(`WhatsApp (Evolution) failed`, { phone: cleanPhone, error: errorMsg });
      return { success: false, error: errorMsg, isInvalid: errorMsg.includes('does not exist') || error.response?.status === 400, provider: 'evolution' };
    }
  }
}

// ─── UNIFIED WHATSAPP SENDER (auto-selects provider) ───

async function sendWhatsApp(phone, message, templateData = null, forceProvider = null) {
  if (!phone) return { success: false, error: 'No phone number' };
  
  const provider = forceProvider || getWhatsAppProvider();
  
  if (provider === 'cloud_api') {
    return sendWhatsAppCloudAPI(phone, message, templateData);
  } else if (provider === 'evolution') {
    return sendWhatsAppEvolution(phone, message);
  }
  
  logger.warn('No WhatsApp provider configured (set META_CLOUD_TOKEN or EVOLUTION_API_URL)');
  return { success: false, error: 'No WhatsApp provider configured' };
}

// ─── EMAIL VIA SMTP ─────────────────────────────────

async function sendEmail(to, subject, body) {
  if (!config.EMAIL_SMTP_HOST) {
    logger.warn('Email SMTP not configured');
    return { success: false, error: 'SMTP not configured' };
  }
  if (!to) return { success: false, error: 'No email address' };

  try {
    // Use Brevo/Sendinblue API if configured
    if (config.BREVO_API_KEY) {
      const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
        sender: { name: 'Gustavo - Neurova', email: config.EMAIL_FROM || 'gustavo@generarise.space' },
        to: [{ email: to }],
        subject: subject,
        textContent: body,
      }, {
        headers: {
          'api-key': config.BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      logger.info(`Email sent to ${to} via Brevo`);
      return { success: true, messageId: response.data?.messageId };
    }

    // Fallback: use generic SMTP via axios (simplified)
    logger.warn('No Brevo key, email not sent (configure BREVO_API_KEY)');
    return { success: false, error: 'No email provider configured' };

  } catch (error) {
    logger.error(`Email send failed`, { to, error: error.message });
    return { success: false, error: error.message };
  }
}
// ─── SOCIAL DMs VIA CHATWOOT ─────────────────────────

async function sendSocialDM(leadId, message, channel = 'instagram') {
  if (!config.CHATWOOT_API_TOKEN) {
    logger.warn('Chatwoot API not configured — cannot send social DM');
    return { success: false, error: 'Chatwoot not configured' };
  }

  // NOTE: This requires the lead to already have a Chatwoot conversation.
  // For cold outreach, this usually requires first creating a contact.
  logger.info(`Social DM (${channel}) logic triggered for lead ${leadId} (Placeholder)`);
  return { success: true, status: 'pending_chatwoot', message };
}

// ─── LINKEDIN (MANUAL / AUTOMATION HELPER) ──────────

async function sendLinkedIn(lead, message) {
  logger.info(`LinkedIn outreach for ${lead.name} — Message generated`);
  // If we had Waalaxy/PhantomBuster API, we'd call it here.
  return { 
    success: true, 
    status: 'manual_copy', 
    message,
    profileUrl: lead.linkedin_url || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(lead.name + ' ' + (lead.company || ''))}`
  };
}

// ─── OUTREACH SINGLE LEAD ──────────────────────────

async function contactLead(lead, { dryRun = false, channel = 'auto' } = {}) {
  // Determine channel
  if (channel === 'auto') {
    if (lead.phone) channel = 'whatsapp';
    else if (lead.linkedin_url) channel = 'linkedin';
    else if (lead.email) channel = 'email';
    else channel = null;
  }
  if (!channel) {
    logger.warn(`No contact channel for ${lead.name}`);
    return { success: false, error: 'No contact info' };
  }

  const isFollowUp = lead.outreach_count > 0;
  
  if (isFollowUp && config.DISABLE_FOLLOWUPS === 'true') {
    logger.info(`Skipping follow-up for ${lead.name} (DISABLE_FOLLOWUPS is true)`);
    return { success: false, error: 'Follow-ups disabled' };
  }

  const templateType = isFollowUp ? 'whatsapp_followup' : 'whatsapp_first';
  const counterKey = isFollowUp ? 'whatsapp_followup' : 'whatsapp_new';

  // Check daily limits
  if (channel === 'whatsapp' && dailyCounters[counterKey] >= DAILY_LIMITS[counterKey]) {
    logger.warn(`Daily WhatsApp limit reached (${counterKey})`);
    return { success: false, error: 'Daily limit reached' };
  }
  if (channel === 'email' && dailyCounters.email >= DAILY_LIMITS.email) {
    logger.warn('Daily email limit reached');
    return { success: false, error: 'Daily limit reached' };
  }

  let result;

  if (dryRun) {
    let message = '';
    if (INDUSTRIAL_INDUSTRIES.includes(lead.industry)) {
      message = await generateAIOutreach(lead) || templates.renderMessage(lead, templateType);
    } else if (channel === 'whatsapp') {
      message = templates.renderMessage(lead, templateType);
    } else if (channel === 'email') {
      message = `Subject: ${templates.renderEmailSubject(lead)}\n\n${templates.renderEmailBody(lead)}`;
    } else if (channel === 'linkedin') {
      message = templates.renderLinkedInIntro(lead);
    } else {
      message = templates.renderMessage(lead, 'whatsapp_first');
    }

    logger.info(`[DRY RUN] Would send ${channel} to ${lead.name}: ${message.substring(0, 100)}...`);
    return { success: true, dryRun: true, channel, message };
  }

  if (channel === 'whatsapp') {
    let message;
    if (INDUSTRIAL_INDUSTRIES.includes(lead.industry)) {
      message = await generateAIOutreach(lead) || templates.renderMessage(lead, templateType);
    } else {
      message = templates.renderMessage(lead, templateType);
    }

    const provider = getWhatsAppProvider();
    let templateData = null;

    if (provider === 'cloud_api') {
      // Clean up the greeting "Hola [Nombre]..." from the AI message to prevent duplication
      // since the Meta template is: "Hola {{1}}, vi tu empresa {{2}}. {{3}}"
      let cleanMessage = message;
      
      // Remove patterns like "Hola [Name], ", "Hola, ", "¡Hola! ", etc. at the start of the message
      cleanMessage = cleanMessage.replace(/^Hola\s+[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s,]+[.!]\s*/i, '');
      cleanMessage = cleanMessage.replace(/^¡?Hola!?,?\s*/i, '');
      
      // Also remove introductory parts like "vi tu empresa..." if AI hallucinated it
      cleanMessage = cleanMessage.replace(/^vi\s+(que\s+)?tu\s+empresa\s+[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s,]+[.!]\s*/i, '');

      templateData = {
        name: 'neurova_outreach',
        language: 'es',
        parameters: [
          lead.name || 'amigo/a',
          lead.company || lead.industry || 'tu negocio',
          cleanMessage
        ]
      };
    }

    result = await sendWhatsApp(lead.phone, message, templateData);
    if (result.success) dailyCounters[counterKey]++;

    // Log to Supabase
    if (supabase.isConfigured()) {
      await supabase.logOutreach({
        lead_id: lead.id,
        channel: 'whatsapp',
        direction: 'outbound',
        message_preview: templateData 
          ? `[Template: neurova_outreach] | ${templateData.parameters[2].substring(0, 150)}`
          : message.substring(0, 200),
        template_used: templateData ? 'meta_template_neurova_outreach' : templateType,
        status: result.success ? 'sent' : 'failed',
        error_message: result.error || null
      });
    }
  } else if (channel === 'email') {
    const subject = templates.renderEmailSubject(lead);
    const body = templates.renderEmailBody(lead);
    result = await sendEmail(lead.email, subject, body);
    if (result.success) dailyCounters.email++;

    if (supabase.isConfigured()) {
      await supabase.logOutreach({
        lead_id: lead.id,
        channel: 'email',
        direction: 'outbound',
        message_preview: `Subject: ${subject}`,
        template_used: 'email_body',
        status: result.success ? 'sent' : 'failed',
        error_message: result.error || null
      });
    }
  } else if (channel === 'linkedin') {
    const message = templates.renderLinkedInIntro(lead);
    result = await sendLinkedIn(lead, message);
    if (result.success) dailyCounters.linkedin++;

    if (supabase.isConfigured()) {
      await supabase.logOutreach({
        lead_id: lead.id,
        channel: 'linkedin',
        direction: 'outbound',
        message_preview: message.substring(0, 200),
        template_used: 'linkedin_intro',
        status: 'manual_ready',
      });
    }
  } else if (channel === 'instagram' || channel === 'facebook') {
    const message = templates.renderMessage(lead, 'whatsapp_first'); // Reuse WhatsApp style for DMs
    result = await sendSocialDM(lead.id, message, channel);
    if (result.success) dailyCounters.social_dm++;

    if (supabase.isConfigured()) {
      await supabase.logOutreach({
        lead_id: lead.id,
        channel: channel,
        direction: 'outbound',
        message_preview: message.substring(0, 200),
        status: 'pending',
      });
    }
  }

  // Update lead status
  if (supabase.isConfigured()) {
    if (result?.success) {
      const now = new Date().toISOString();
      const newCount = (lead.outreach_count || 0) + 1;
      
      // If this was the 2nd contact (max), mark as dead — stop contacting
      const finalStatus = newCount >= 2 ? 'dead' : 'contacted';
      const finalStage = newCount >= 2 ? 'dead' : (lead.pipeline_stage === 'discovered' ? 'contacted' : lead.pipeline_stage);
      
      await supabase.updateLead(lead.id, {
        outreach_status: finalStatus,
        outreach_channel: channel,
        outreach_last_at: now,
        outreach_count: newCount,
        ...(lead.outreach_count === 0 ? { outreach_first_at: now } : {}),
        pipeline_stage: finalStage
      });
      
      if (newCount >= 2) {
        logger.info(`Lead ${lead.name} auto-closed after ${newCount} contacts without reply`);
      }
    } else if (result?.isInvalid) {
      await supabase.updateLead(lead.id, {
        outreach_status: 'failed',
        pipeline_stage: 'dead',
        rejection_reason: 'Invalid contact number'
      });
      logger.info(`Lead ${lead.name} marked as dead due to invalid number`);
    }
  }

  return result;
}

// ─── BATCH OUTREACH ────────────────────────────────

async function runOutreachBatch({ dryRun = false, maxLeads = 50, type = 'new' } = {}) {
  logger.info(`═══ OUTREACH ${type.toUpperCase()} BATCH (${dryRun ? 'DRY RUN' : 'LIVE'}) ═══`);

  if (!supabase.isConfigured()) {
    logger.error('Supabase not configured');
    return { contacted: 0, failed: 0 };
  }

  // Pre-flight: Check if WhatsApp is healthy before burning through leads
  if (!dryRun) {
    const health = await checkEvolutionHealth();
    if (!health.healthy) {
      const providerLabel = health.provider === 'cloud_api' ? 'Meta Cloud API' : 'Evolution API';
      logger.error(`${providerLabel} unhealthy — aborting outreach batch`, { state: health.state, reason: health.reason });
      const fixMsg = health.provider === 'cloud_api'
        ? `Fix: Check META_CLOUD_TOKEN and META_PHONE_NUMBER_ID in environment variables.`
        : `Fix: Verify Evolution API instance "${config.EVOLUTION_INSTANCE}" is running and phone is connected.`;
      await telegram.sendAlert(
        `🚨 Outreach Aborted — WhatsApp Down (${providerLabel})`,
        `${providerLabel} state: ${health.state}\nReason: ${health.reason}\n\n${fixMsg}`
      );
      return { contacted: 0, failed: 0, aborted: true, reason: health.reason };
    }
    const providerLabel = health.provider === 'cloud_api' ? 'Meta Cloud API' : 'Evolution API';
    logger.info(`${providerLabel} healthy (state: ${health.state})`);
  }

  let leads;
  if (type === 'followup') {
    leads = await supabase.getFollowUpLeads(maxLeads);
  } else {
    leads = await supabase.getPendingOutreach(maxLeads);
  }

  logger.info(`${leads.length} leads in ${type} batch`);
  let contacted = 0, failed = 0;

  for (const lead of leads) {
    try {
      const result = await contactLead(lead, { dryRun });
      if (result.success) {
        contacted++;
        // Notify via Telegram for hot leads
        if (lead.ai_score >= 80 && !dryRun) {
          await telegram.sendAlert(
            '🔥 Hot Lead Contacted',
            `${lead.name} (${lead.company}) — Score: ${lead.ai_score}/100\nIndustry: ${lead.industry} | ${lead.city}, ${lead.country}`
          );
        }
      } else {
        failed++;
      }

      // Anti-Ban Delay: 5 a 10 MINUTOS entre cada mensaje (no segundos)
      const delay = dryRun ? 500 : (300000 + Math.random() * 300000);
      await new Promise(r => setTimeout(r, delay));

    } catch (error) {
      logger.error(`Outreach failed for ${lead.name}`, { error: error.message });
      failed++;
    }
  }

  logger.info(`═══ OUTREACH COMPLETE: ${contacted} contacted, ${failed} failed ═══`);

  if (!dryRun) {
    await telegram.sendAlert(
      '📊 Outreach Report',
      `Type: ${type}\nContacted: ${contacted}\nFailed: ${failed}\nRemaining limits: WA=${DAILY_LIMITS.whatsapp_new - dailyCounters.whatsapp_new}, Email=${DAILY_LIMITS.email - dailyCounters.email}`
    );
  }

  return { contacted, failed };
}

// ─── SALES REPORT ──────────────────────────────────

async function sendSalesReport() {
  if (!supabase.isConfigured()) return;

  try {
    const stats = await supabase.getSalesStats();
    const pipeline = await supabase.getPipelineStats();

    const pipelineText = pipeline.map(p =>
      `  ${p.pipeline_stage}: ${p.lead_count} leads (avg score: ${p.avg_score || 0})`
    ).join('\n');

    const report = `📊 SALES DAILY REPORT\n\n` +
      `Total Leads: ${stats.totalLeads}\n` +
      `Hot Leads (70+): ${stats.hotLeads}\n` +
      `Contacted: ${stats.contacted}\n` +
      `Replied: ${stats.replied}\n` +
      `Closed: ${stats.closed}\n` +
      `Revenue: $${stats.totalRevenue}\n` +
      `Conversion: ${stats.conversionRate}%\n\n` +
      `Pipeline:\n${pipelineText}`;

    await telegram.sendAlert('📊 Sales Report', report);
    logger.info('Sales daily report sent');
  } catch (error) {
    logger.error('Sales report failed', { error: error.message });
  }
}

export default {
  contactLead,
  runOutreachBatch,
  sendSalesReport,
  resetDailyCounters,
  sendWhatsApp,
  sendEmail,
  checkEvolutionHealth,
  generateAIOutreach
};
