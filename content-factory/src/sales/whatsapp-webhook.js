import config from '../config.js';
import logger from '../logger.js';
import supabase from './supabase-client.js';
import outreachEngine from './outreach-engine.js';
import aiResponder from './ai-responder.js';
import telegram from '../notifications/telegram.js';
import chatwoot from './chatwoot.js';

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

  if (mode === 'subscribe' && (token === verifyToken || token === 'neurova_api')) {
    logger.info(`Meta WhatsApp webhook verified successfully${token === 'neurova_api' ? ' (using neurova_api fallback)' : ''}`);
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

    if (body.event === 'message_created' || (body.event && body.event.startsWith('message_'))) {
      // ═══ CHATWOOT WEBHOOK FORMAT ═══
      return await handleChatwootWebhook(body, res);
    }

    // Unknown format — acknowledge to avoid retries
    logger.warn('WhatsApp Webhook: Unknown payload format', { keys: Object.keys(body) });
    return res.status(200).send('Unknown format — ignored');

  } catch (error) {
    logger.error('WhatsApp Webhook Error', { error: error.message, stack: error.stack });
    res.status(500).send('Error');
  }
}

// ─── CHATWOOT WEBHOOK HANDLER ──────────────────────

async function handleChatwootWebhook(body, res) {
  const event = body.event;
  const messageType = body.message_type;

  // We only care about incoming messages from the customer
  if (messageType !== 'incoming') {
    return res.status(200).send('Outgoing or system message ignored');
  }

  // Extract phone number from different possible locations
  let phone = body.sender?.phone_number || body.contact?.phone_number || body.conversation?.contact_inbox?.source_id;
  if (!phone) {
    logger.warn('Chatwoot Webhook: No phone number found in payload', { event });
    return res.status(200).send('No phone number');
  }

  // Clean phone number (keep digits only)
  const cleanPhone = phone.replace(/[^\d]/g, '');
  if (!cleanPhone) {
    logger.warn('Chatwoot Webhook: Phone number contains no digits', { phone });
    return res.status(200).send('Invalid phone');
  }

  const text = body.content || '';
  const contactName = body.sender?.name || body.contact?.name || cleanPhone;

  logger.info(`WhatsApp Reply (Chatwoot Webhook) from ${contactName} (${cleanPhone}): ${text.substring(0, 80)}...`);

  if (supabase.isConfigured()) {
    // Argentine phone handling: Meta webhook might send cleanPhone with or without '9' prefix,
    // and database might store it differently. To make it extremely robust, let's search for cleanPhone,
    // and if not found and it's Argentine (starts with 54), try matching with/without the '9' at index 2.
    let leads = await supabase.getLeads({ phone: cleanPhone });
    
    // Fallback: Argentina 9 prefix handling (e.g. 54911... vs 5411...)
    if ((!leads || leads.length === 0) && cleanPhone.startsWith('54')) {
      if (cleanPhone.startsWith('549')) {
        const without9 = '54' + cleanPhone.substring(3);
        logger.info(`Argentine number fallback: searching without 9 prefix: ${without9}`);
        leads = await supabase.getLeads({ phone: without9 });
      } else {
        const with9 = '549' + cleanPhone.substring(2);
        logger.info(`Argentine number fallback: searching with 9 prefix: ${with9}`);
        leads = await supabase.getLeads({ phone: with9 });
      }
    }

    if (leads && leads.length > 0) {
      const conversationId = body.conversation?.id;
      if (conversationId) {
        await chatwoot.saveChatwootConversationId(leads[0].phone, conversationId);
      }
      await processInboundMessage(leads[0].phone, text, contactName);
    } else {
      logger.info(`Inbound WhatsApp (Chatwoot) from unknown number ${cleanPhone} — not in leads DB`);
    }
  }

  return res.status(200).send('EVENT_RECEIVED');
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
    let leads = await supabase.getLeads({ phone });

    // Fallback: Argentina 9 prefix handling (e.g. 54911... vs 5411...)
    if ((!leads || leads.length === 0) && phone.startsWith('54')) {
      if (phone.startsWith('549')) {
        const without9 = '54' + phone.substring(3);
        logger.info(`Argentine number fallback in processInboundMessage: searching without 9 prefix: ${without9}`);
        leads = await supabase.getLeads({ phone: without9 });
      } else {
        const with9 = '549' + phone.substring(2);
        logger.info(`Argentine number fallback in processInboundMessage: searching with 9 prefix: ${with9}`);
        leads = await supabase.getLeads({ phone: with9 });
      }
    }

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
      Object.assign(lead, updateData);

      // 3. Log the inbound interaction
      await supabase.logOutreach({
        lead_id: lead.id,
        channel: 'whatsapp',
        direction: 'inbound',
        message_preview: text.substring(0, 200),
        status: 'received'
      });

      logger.info(`Lead ${lead.name} marked as RESPONDED. Generating AI Auto-Reply...`);

      // 4. Generate AI response and send it back
      const aiResult = await aiResponder.generateAIResponse(lead, text);
      if (aiResult && aiResult.reply) {
        const { reply, gracefulExit } = aiResult;
        
        logger.info(`Sending AI Auto-Reply to ${lead.name} (${phone}): "${reply.substring(0, 60)}..."`);
        
        // Send free-text WhatsApp message since we are in the active 24h user window
        const sendResult = await outreachEngine.sendWhatsApp(phone, reply);

        if (sendResult.success) {
          // Log the outbound interaction
          await supabase.logOutreach({
            lead_id: lead.id,
            channel: 'whatsapp',
            direction: 'outbound',
            message_preview: reply.substring(0, 200),
            status: 'sent'
          });

          // Sync outbound AI reply to Chatwoot dashboard
          await chatwoot.syncMessageToChatwoot(lead, reply, 'outgoing');

          logger.info(`AI Auto-Reply sent successfully to ${lead.name}`);

          // Notify via Telegram
          let notificationTitle = '🤖 AI Auto-Replied';
          let notificationBody = `Lead: ${lead.name} (${lead.company || 'Sin Empresa'})\nPhone: ${phone}\n\nLead dijo:\n"${text}"\n\nAI contestó:\n"${reply}"`;
          
          if (gracefulExit) {
            notificationTitle = '👋 AI Farewell (Graceful Exit)';
            notificationBody += `\n\n⚠️ Desinterés detectado. Se cerró el lead automáticamente.`;
            
            // Mark as rejected in Supabase
            await supabase.markLeadRejected(lead.id, 'Disinterest detected by AI');
          }

          await telegram.sendAlert(notificationTitle, notificationBody);
        } else {
          logger.error(`Failed to send AI Auto-Reply via WhatsApp provider`, { error: sendResult.error });
        }
      } else {
        logger.warn(`No AI reply generated for ${lead.name}`);
      }
    } else {
      // Unknown number — could be a new inbound lead
      logger.info(`Inbound WhatsApp from unknown number ${phone} — not in leads DB`);
    }
  } catch (error) {
    logger.error('Error processing inbound message', { phone, error: error.message });
  }
}

export default handleWhatsAppWebhook;
