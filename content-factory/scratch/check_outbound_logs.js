import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import supabase from '../src/sales/supabase-client.js';

async function checkOutboundLogs() {
  const { data, error } = await supabase.client
    .from('outreach_logs')
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
    const { data: leadData } = await supabase.client
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
