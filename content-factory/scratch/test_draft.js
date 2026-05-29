import supabaseClient from '../src/sales/supabase-client.js';
import outreachTemplates from '../src/sales/outreach-templates.js';
import outreachEngine from '../src/sales/outreach-engine.js';
import logger from '../src/logger.js';

async function runDiagnostics() {
  logger.info('--- DIAGNOSTIC START ---');
  try {
    const leads = await supabaseClient.getLeads({ limit: 10 });
    logger.info(`Fetched ${leads.length} leads from Supabase.`);
    
    for (const lead of leads) {
      logger.info(`--------------------------------------------`);
      logger.info(`Lead: ${lead.name} | ID: ${lead.id}`);
      logger.info(`Company: ${lead.company} | Industry: ${lead.industry} | Language: ${lead.language}`);
      
      try {
        const msg = outreachTemplates.renderMessage(lead, 'whatsapp_first');
        logger.info(`Rendered Initial Message successfully (Length: ${msg?.length}):`);
        logger.info(`"${msg?.substring(0, 100)}..."`);
      } catch (err) {
        logger.error(`❌ FAILED rendering Initial Message: ${err.message}`, { stack: err.stack });
      }

      try {
        const msg2 = outreachTemplates.renderMessage(lead, 'whatsapp_second');
        logger.info(`Rendered Demo Message successfully (Length: ${msg2?.length})`);
      } catch (err) {
        logger.error(`❌ FAILED rendering Demo Message: ${err.message}`, { stack: err.stack });
      }

      try {
        logger.info(`Trying to generate AI Outreach...`);
        const aiMsg = await outreachEngine.generateAIOutreach(lead, 'outreach_industrial');
        logger.info(`AI Outreach Draft returned: ${aiMsg ? 'SUCCESS' : 'NULL (fallback)'}`);
      } catch (err) {
        logger.error(`❌ FAILED generating AI Outreach: ${err.message}`, { stack: err.stack });
      }
    }
  } catch (err) {
    logger.error(`Fatal diagnostic error: ${err.message}`, { stack: err.stack });
  }
  logger.info('--- DIAGNOSTIC END ---');
}

runDiagnostics();
