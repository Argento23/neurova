import axios from 'axios';
import config from '../config.js';
import logger from '../logger.js';
import supabase from './supabase-client.js';

// ─── CHATWOOT CLIENT ─────────────────────────────────

async function getHeaders() {
  return {
    'api_access_token': config.CHATWOOT_API_TOKEN,
    'Content-Type': 'application/json'
  };
}

/**
 * Syncs a message to Chatwoot so it shows up in the Chatwoot conversation thread.
 * @param {Object} lead - Supabase lead record
 * @param {string} messageContent - Message body
 * @param {string} direction - 'outgoing' or 'incoming'
 */
export async function syncMessageToChatwoot(lead, messageContent, direction = 'outgoing') {
  if (!config.CHATWOOT_API_TOKEN || !config.CHATWOOT_API_URL) {
    logger.debug('Chatwoot API not configured, skipping syncMessageToChatwoot');
    return null;
  }

  try {
    const accountId = config.CHATWOOT_ACCOUNT_ID || '1';
    const baseUrl = config.CHATWOOT_API_URL.endsWith('/') 
      ? config.CHATWOOT_API_URL.slice(0, -1) 
      : config.CHATWOOT_API_URL;

    // 1. Get Conversation ID from Lead's ai_score_breakdown
    let breakdown = lead.ai_score_breakdown || {};
    let conversationId = breakdown.chatwoot_conversation_id;

    const headers = await getHeaders();

    // 2. If no conversation ID, search contact in Chatwoot by phone number
    if (!conversationId && lead.phone) {
      const cleanPhone = lead.phone.replace(/[^\d]/g, '');
      logger.info(`Searching Chatwoot contact for phone: ${cleanPhone}`);
      
      try {
        const searchRes = await axios.get(
          `${baseUrl}/api/v1/accounts/${accountId}/contacts/search?q=${cleanPhone}`,
          { headers, timeout: 10000 }
        );

        const contacts = searchRes.data?.payload || [];
        if (contacts.length > 0) {
          const contactId = contacts[0].id;
          
          // Get contact's conversations
          const convRes = await axios.get(
            `${baseUrl}/api/v1/accounts/${accountId}/contacts/${contactId}/conversations`,
            { headers, timeout: 10000 }
          );

          const conversations = convRes.data?.payload || [];
          if (conversations.length > 0) {
            conversationId = conversations[0].id;
            logger.info(`Found Chatwoot conversation ID ${conversationId} for contact ${contactId}`);
            
            // Save conversation ID back to Lead in Supabase
            breakdown.chatwoot_conversation_id = conversationId;
            await supabase.updateLead(lead.id, { ai_score_breakdown: breakdown });
          }
        }
      } catch (err) {
        logger.warn('Failed to search Chatwoot contact/conversation', { error: err.message });
      }
    }

    // 3. Post message to the Chatwoot conversation if conversationId is known
    if (conversationId) {
      logger.info(`Posting ${direction} message to Chatwoot conversation ${conversationId}`);
      
      const response = await axios.post(
        `${baseUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
        {
          content: messageContent,
          message_type: direction,
          private: false
        },
        { headers, timeout: 15000 }
      );

      return response.data;
    } else {
      logger.warn(`Could not sync to Chatwoot: Conversation ID not found for lead ${lead.name}`);
      return null;
    }

  } catch (error) {
    logger.error('Error syncing message to Chatwoot', {
      error: error.response?.data?.error || error.message
    });
    return null;
  }
}

/**
 * Saves Chatwoot conversation ID to a lead in Supabase
 */
export async function saveChatwootConversationId(phone, conversationId) {
  try {
    const leads = await supabase.getLeads({ phone });
    if (leads && leads.length > 0) {
      const lead = leads[0];
      let breakdown = lead.ai_score_breakdown || {};
      
      if (breakdown.chatwoot_conversation_id !== conversationId) {
        breakdown.chatwoot_conversation_id = conversationId;
        await supabase.updateLead(lead.id, { ai_score_breakdown: breakdown });
        logger.info(`Saved Chatwoot conversation ID ${conversationId} to lead ${lead.name}`);
      }
    }
  } catch (error) {
    logger.error('Failed to save Chatwoot conversation ID to lead', { error: error.message });
  }
}

export default {
  syncMessageToChatwoot,
  saveChatwootConversationId
};
