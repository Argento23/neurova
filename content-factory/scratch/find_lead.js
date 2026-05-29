import supabaseClient from '../src/sales/supabase-client.js';
import logger from '../src/logger.js';

async function findLead() {
  try {
    const leads = await supabaseClient.getLeads({ limit: 1000 });
    const target = leads.find(l => l.name && l.name.includes('Ghl'));
    if (target) {
      logger.info(`FOUND LEAD:`);
      logger.info(JSON.stringify(target, null, 2));
    } else {
      logger.info('Lead not found in Supabase');
    }
  } catch (err) {
    logger.error('Error finding lead', err);
  }
}

findLead();
