import config from '../config.js';
import logger from '../logger.js';
import supabase from './supabase-client.js';

/**
 * Handle incoming webhooks from Meta Cloud API (primary) or Evolution API (legacy fallback).
 *
 * Meta Cloud API payload format:
 *   POST body = {
 *     object: "whatsapp_business_account",
 *     entry: [{ id, changes: [{ value: { messages: [...], contacts: [...], ... }, field: "messages" }] }]
 *   }
 *
 * Evolution API payload format (legacy):
 *   POST body = { event: "messages.upsert", data: { key: { fromMe, remoteJid }, message: { conversation } } }
 */

// ─── META WEBHOOK VERIFICATION (GET) ───────────────
// Meta requires a GET endpoint that echoes hub.challenge.
// Set META_WEBHOOK_VERIFY_TOKEN in your .env to a secret string,
// then use the same string when subscribing the webhook in Meta Dashboard.

export function verifyWhatsAppWebhook(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const verifyToken = config.META_WEBHOOK_VERIFY_TOKEN || 'neurova_verify';

  if (mode === 'subscribe' && token === verifyToken) {
    logger.info('Meta WhatsApp webhook verified successfully');
    return res.status(200).send(challenge);
  }

  logger.warn('Meta WhatsApp webhook verification failed', { mode, token });
  return res.status(403).send('Forbidden');
}

// ─── INCOMING MESSAGE HANDLER (POST) ───────────────

export async function handleWhatsAppWebhook(req, res) {
  try {
    const body = req.body;

    // ── Detect provider format ──────────────────────
    if (body.object === 'whatsapp_business_account') {
      // ═══ META CLOUD API FORMAT ═══
      return await handleMetaCloudWebhook(body, res);
    }

    if (body.event === 'messages.upsert') {
      // ═══ EVOLUTION API FORMAT (legacy fallback) ═══
      return await handleEvolutionWebhook(body, res);
    }

    // Unknown format — acknowledge to avoid retries
    logger.warn('WhatsApp Webhook: Unknown payload format', { keys: Object.keys(body) });
    return res.status(200).send('Unknown format — ignored');

  } catch (error) {
    logger.error('WhatsApp Webhook Error', { error: error.message, stack: error.stack });
    res.status(500).send('Error');
  }
}

// ─── META CLOUD API HANDLER ────────────────────────

async function handleMetaCloudWebhook(body, res) {
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field !== 'messages') continue;

      const value = change.value;
      if (!value) continue;

      // Process status updates (sent, delivered, read)
      for (const status of value.statuses || []) {
        logger.info(`WhatsApp status update: ${status.status} for ${status.recipient_id}`, {
          messageId: status.id,
          status: status.status,
          timestamp: status.timestamp
        });

        // If message was read, we could update outreach status
        if (status.status === 'read' && supabase.isConfigured()) {
          const phone = status.recipient_id;
          const leads = await supabase.getLeads({ phone });
          if (leads && leads.length > 0) {
            await supabase.updateLead(leads[0].id, {
              outreach_status: 'read',
              updated_at: new Date().toISOString()
            });
            logger.info(`Lead ${leads[0].name} message marked as READ`);
          }
        }
      }

      // Process incoming messages
      for (const message of value.messages || []) {
        const phone = message.from; // e.g. "5491122334455"
        const msgType = message.type; // text, image, audio, etc.
        let text = '';

        if (msgType === 'text') {
          text = message.text?.body || '';
        } else if (msgType === 'button') {
          text = message.button?.text || '[button reply]';
        } else if (msgType === 'interactive') {
          text = message.interactive?.button_reply?.title ||
                 message.interactive?.list_reply?.title || '[interactive reply]';
        } else if (msgType === 'reaction') {
          text = `[reaction: ${message.reaction?.emoji || '?'}]`;
        } else {
          text = `[${msgType}]`;
        }

        // Get contact name from Meta's contacts array
        const contactInfo = (value.contacts || []).find(c => c.wa_id === phone);
        const contactName = contactInfo?.profile?.name || phone;

        logger.info(`WhatsApp Reply (Cloud API) from ${contactName} (${phone}): ${text.substring(0, 80)}...`);

        if (supabase.isConfigured()) {
          await processInboundMessage(phone, text, contactName);
        }
      }
    }
  }

  // Meta requires 200 response within 20s or it retries
  return res.status(200).send('EVENT_RECEIVED');
}

// ─── EVOLUTION API HANDLER (legacy) ────────────────

async function handleEvolutionWebhook(body, res) {
  const data = body.data;
  const fromMe = data?.key?.fromMe;
  const remoteJid = data?.key?.remoteJid; // e.g. "5491122334455@s.whatsapp.net"

  // Ignore messages sent by us
  if (fromMe) return res.status(200).send('Self-message ignored');

  // Extract phone number
  const phone = remoteJid?.split('@')[0];
  if (!phone) return res.status(200).send('No phone');

  const message = data?.message;
  const text = message?.conversation || message?.extendedTextMessage?.text || '';

  logger.info(`WhatsApp Reply (Evolution) from ${phone}: ${text.substring(0, 80)}...`);

  if (supabase.isConfigured()) {
    await processInboundMessage(phone, text);
  }

  return res.status(200).send('OK');
}

// ─── SHARED: Process inbound message ───────────────

async function processInboundMessage(phone, text, contactName = null) {
  try {
    // 1. Find lead by phone
    const leads = await supabase.getLeads({ phone });

    if (leads && leads.length > 0) {
      const lead = leads[0];

      // 2. Update status to 'responded'
      const updateData = {
        outreach_status: 'responded',
        pipeline_stage: lead.pipeline_stage === 'discovered' ? 'contacted' : lead.pipeline_stage,
        updated_at: new Date().toISOString()
      };

      // Update name if we got it from Meta contacts and lead has a placeholder name
      if (contactName && (!lead.name || lead.name.startsWith('Lead ') || lead.name.startsWith('IG User'))) {
        updateData.name = contactName;
      }

      await supabase.updateLead(lead.id, updateData);

      // 3. Log the interaction
      await supabase.logOutreach({
        lead_id: lead.id,
        channel: 'whatsapp',
        direction: 'inbound',
        message_preview: text.substring(0, 200),
        status: 'received'
      });

      logger.info(`Lead ${lead.name} marked as RESPONDED. Follow-ups stopped.`);
    } else {
      // Unknown number — could be a new inbound lead
      logger.info(`Inbound WhatsApp from unknown number ${phone} — not in leads DB`);
    }
  } catch (error) {
    logger.error('Error processing inbound message', { phone, error: error.message });
  }
}

export default handleWhatsAppWebhook;
