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
      
      // Build search queries list to try different formats (crucial for Argentina 9 prefix +/no-plus mismatch)
      const searchQueries = [`+${cleanPhone}`, cleanPhone];
      if (cleanPhone.startsWith('54')) {
        if (cleanPhone.startsWith('549')) {
          const without9 = '54' + cleanPhone.substring(3);
          searchQueries.push(`+${without9}`, without9);
        } else {
          const with9 = '549' + cleanPhone.substring(2);
          searchQueries.push(`+${with9}`, with9);
        }
      }

      let contacts = [];
      let contactId = null;

      // Try searching contact with different phone formats
      for (const query of searchQueries) {
        try {
          logger.debug(`Trying Chatwoot contact search with query: ${query}`);
          const searchRes = await axios.get(
            `${baseUrl}/api/v1/accounts/${accountId}/contacts/search?q=${encodeURIComponent(query)}`,
            { headers, timeout: 8000 }
          );
          const found = searchRes.data?.payload || [];
          if (found.length > 0) {
            contacts = found;
            logger.info(`Found contact in Chatwoot using query: ${query}`);
            break;
          }
        } catch (searchErr) {
          logger.warn(`Chatwoot contact search failed for query: ${query}`, { error: searchErr.message });
        }
      }

      try {
        if (contacts.length > 0) {
          contactId = contacts[0].id;
          
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
          // Contact doesn't exist in any searched format. Create contact and then conversation.
          logger.info(`Contact not found. Creating new Chatwoot contact for ${lead.name || cleanPhone}`);
          
          let createdPayload = null;
          try {
            const newContactRes = await axios.post(
              `${baseUrl}/api/v1/accounts/${accountId}/contacts`,
              {
                inbox_id: config.CHATWOOT_INBOX_ID,
                name: lead.name || cleanPhone,
                phone_number: `+${cleanPhone}`
              },
              { headers, timeout: 10000 }
            );
            createdPayload = newContactRes.data?.payload?.contact;
          } catch (createErr) {
            const errMsg = createErr.response?.data?.message || createErr.message;
            logger.warn(`Failed to create contact with +${cleanPhone}: ${errMsg}`);
            
            // If phone number already exists, it means search failed due to index/format but contact exists.
            // Let's try to search one last time using a wildcard or standard search.
            if (errMsg.includes('already exists') || errMsg.includes('duplicate')) {
              logger.info(`Duplicate contact detected. Trying fallback search with truncated phone...`);
              const truncated = cleanPhone.slice(-8); // Search last 8 digits as backup
              const fallbackSearch = await axios.get(
                `${baseUrl}/api/v1/accounts/${accountId}/contacts/search?q=${truncated}`,
                { headers, timeout: 10000 }
              );
              const found = fallbackSearch.data?.payload || [];
              if (found.length > 0) {
                contactId = found[0].id;
                logger.info(`Successfully recovered existing contact ID ${contactId} via fallback search`);
              }
            }
          }

          if (createdPayload) {
            contactId = createdPayload.id;
          }
          
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
