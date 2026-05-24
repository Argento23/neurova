import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import config from '../src/config.js';
import { createClient } from '@supabase/supabase-js';

async function run() {
  const db = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
  
  try {
    const { data: logs, error } = await db.from('sales_outreach_log')
      .select('created_at, lead_id, message_preview, status, error_message, template_used')
      .eq('channel', 'whatsapp')
      .eq('status', 'failed')
      .order('created_at', { ascending: false })
      .limit(20);
      
    if (error) throw error;
    
    console.log(`Recent WhatsApp Failures (Total ${logs.length}):`);
    for (const log of logs) {
      // Get lead details
      const { data: lead } = await db.from('sales_leads').select('name, phone').eq('id', log.lead_id).single();
      console.log(`[${log.created_at}] Lead: ${lead?.name || 'Unknown'} | Phone: ${lead?.phone || 'Unknown'}`);
      console.log(`  Preview: ${log.message_preview}`);
      console.log(`  Template: ${log.template_used}`);
      console.log(`  Error: ${log.error_message}`);
      console.log('----------------------------------------------------');
    }
  } catch (e) {
    console.error(e);
  }
}

run();
