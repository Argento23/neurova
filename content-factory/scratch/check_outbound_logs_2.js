import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { createClient } from '@supabase/supabase-js';

async function checkOutboundLogs() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing');
    return;
  }
  const client = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await client
    .from('sales_outreach_log')
    .select('*')
    .eq('direction', 'outbound')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching logs:', error);
    return;
  }

  console.log(`Recent Outbound Messages (Total ${data.length}):`);
  for (const log of data) {
    const { data: leadData } = await client
      .from('sales_leads')
      .select('name, phone')
      .eq('id', log.lead_id)
      .single();

    console.log(`[${log.created_at}] Lead: ${leadData?.name || 'Unknown'} | Phone: ${leadData?.phone || 'Unknown'}`);
    console.log(`  Direction: ${log.direction} | Channel: ${log.channel} | Status: ${log.status}`);
    console.log(`  Preview: ${log.message_preview}`);
    if (log.error_message) {
      console.log(`  Error: ${log.error_message}`);
    }
    console.log('----------------------------------------------------');
  }
}

checkOutboundLogs();
