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
      
      // Build search variants (Chatwoot may store numbers differently)
      const searchVariants = [cleanPhone];
      if (cleanPhone.startsWith('54') && !cleanPhone.startsWith('549')) {
        searchVariants.push('549' + cleanPhone.substring(2)); // Add Argentine mobile 9
      } else if (cleanPhone.startsWith('549')) {
        searchVariants.push('54' + cleanPhone.substring(3)); // Remove Argentine mobile 9
      }
      // Also try with + prefix (Chatwoot often stores +XXXXXXXXXXX)
      searchVariants.push(`+${cleanPhone}`);
      
      logger.info(`Searching Chatwoot contact for phone variants: ${searchVariants.join(', ')}`);
      try {
        let contacts = [];
        for (const variant of searchVariants) {
          const searchRes = await axios.get(
            `${baseUrl}/api/v1/accounts/${accountId}/contacts/search?q=${variant}`,
            { headers, timeout: 10000 }
          );
          contacts = searchRes.data?.payload || [];
          if (contacts.length > 0) {
            logger.info(`Found Chatwoot contact with variant: ${variant}`);
            break;
          }
        }
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
          } else if (config.CHATWOOT_INBOX_ID) {
            // Contact exists, but no conversation. Create conversation.
            const newConvRes = await axios.post(
              `${baseUrl}/api/v1/accounts/${accountId}/conversations`,
              {
                inbox_id: config.CHATWOOT_INBOX_ID,
                contact_id: contactId,
                status: 'open'
              },
              { headers, timeout: 10000 }
            );
            conversationId = newConvRes.data?.id;
            logger.info(`Created new Chatwoot conversation ID ${conversationId} for contact ${contactId}`);
            breakdown.chatwoot_conversation_id = conversationId;
            await supabase.updateLead(lead.id, { ai_score_breakdown: breakdown });
          }
        } else if (config.CHATWOOT_INBOX_ID) {
          // Contact doesn't exist. Create contact and then conversation.
          logger.info(`Contact not found. Creating new Chatwoot contact for ${lead.name || cleanPhone}`);
          const newContactRes = await axios.post(
            `${baseUrl}/api/v1/accounts/${accountId}/contacts`,
            {
              inbox_id: config.CHATWOOT_INBOX_ID,
              name: lead.name || cleanPhone,
              phone_number: `+${cleanPhone}`
            },
            { headers, timeout: 10000 }
          );
          const contactId = newContactRes.data?.payload?.contact?.id;
          
          if (contactId) {
            const newConvRes = await axios.post(
              `${baseUrl}/api/v1/accounts/${accountId}/conversations`,
              {
                inbox_id: config.CHATWOOT_INBOX_ID,
                contact_id: contactId,
                status: 'open'
              },
              { headers, timeout: 10000 }
            );
            conversationId = newConvRes.data?.id;
            logger.info(`Created new Chatwoot conversation ID ${conversationId} for new contact ${contactId}`);
            breakdown.chatwoot_conversation_id = conversationId;
            await supabase.updateLead(lead.id, { ai_score_breakdown: breakdown });
          }
        } else {
          logger.warn('Contact not found and CHATWOOT_INBOX_ID not configured to create one.');
        }
      } catch (err) {
        logger.warn('Failed to search or create Chatwoot contact/conversation', { error: err.message });
      }
    }

    // 3. Post message to the Chatwoot conversation if conversationId is known
    if (conversationId) {
      // Chatwoot API uses numeric message_type: 0=incoming, 1=outgoing, 2=activity
      const messageType = direction === 'incoming' ? 0 : 1;
      logger.info(`Posting ${direction} (type=${messageType}) message to Chatwoot conversation ${conversationId}: "${messageContent.substring(0, 60)}..."`);
      
      const response = await axios.post(
        `${baseUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
        {
          content: messageContent,
          message_type: messageType,
          private: false
        },
        { headers, timeout: 15000 }
      );

      logger.info(`Chatwoot message synced OK (conversation ${conversationId}, type=${messageType}, id=${response.data?.id || 'unknown'})`);
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
