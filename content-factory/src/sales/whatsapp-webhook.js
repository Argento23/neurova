import logger from '../logger.js';
import supabase from './supabase-client.js';

/**
 * Handle incoming webhooks from Evolution API
 * This allows the system to automatically detect replies and stop follow-ups.
 */
export async function handleWhatsAppWebhook(req, res) {
  try {
    const { event, data } = req.body;
    
    // We only care about messages received (upsert)
    if (event !== 'messages.upsert') {
      return res.status(200).send('Event ignored');
    }

    const message = data.message;
    const fromMe = data.key?.fromMe;
    const remoteJid = data.key?.remoteJid; // e.g. "5491122334455@s.whatsapp.net"
    
    // Ignore messages sent by us
    if (fromMe) return res.status(200).send('Self-message ignored');

    // Extract phone number
    const phone = remoteJid.split('@')[0];
    const text = message?.conversation || message?.extendedTextMessage?.text || '';

    logger.info(`WhatsApp Reply Received from ${phone}: ${text.substring(0, 50)}...`);

    if (supabase.isConfigured()) {
      // 1. Find lead by phone
      const leads = await supabase.getLeads({ phone: phone });
      
      if (leads && leads.length > 0) {
        const lead = leads[0];
        
        // 2. Update status to 'responded'
        await supabase.updateLead(lead.id, {
          outreach_status: 'responded',
          pipeline_stage: 'contacted', // Or move to 'replied' if you have that stage
          updated_at: new Date().toISOString()
        });
        
        // 3. Log the interaction
        await supabase.logOutreach({
          lead_id: lead.id,
          channel: 'whatsapp',
          direction: 'inbound',
          message_preview: text.substring(0, 200),
          status: 'received'
        });

        logger.info(`Lead ${lead.name} marked as RESPONDED. Follow-ups stopped.`);
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    logger.error('WhatsApp Webhook Error', { error: error.message });
    res.status(500).send('Error');
  }
}

export default handleWhatsAppWebhook;
