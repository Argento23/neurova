import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkStatus() {
  console.log('--- Sales Engine Status ---');
  
  const { count: total } = await supabase.from('sales_leads').select('*', { count: 'exact', head: true });
  const { count: pending } = await supabase.from('sales_leads').select('*', { count: 'exact', head: true }).eq('outreach_status', 'pending');
  const { count: contacted } = await supabase.from('sales_leads').select('*', { count: 'exact', head: true }).eq('outreach_status', 'contacted');
  const { count: scored } = await supabase.from('sales_leads').select('*', { count: 'exact', head: true }).gte('ai_score', 1);
  const { count: ready } = await supabase.from('sales_leads').select('*', { count: 'exact', head: true }).eq('outreach_status', 'pending').gte('ai_score', 50);

  console.log(`Total Leads: ${total}`);
  console.log(`Pending Outreach: ${pending}`);
  console.log(`Contacted: ${contacted}`);
  console.log(`Scored Leads (Score > 0): ${scored}`);
  console.log(`Ready for Outreach (Pending + Score >= 50): ${ready}`);
  
  const { data: samples } = await supabase.from('sales_leads').select('name, ai_score, outreach_status').limit(5);
  console.log('\nSample Leads:');
  console.table(samples);
}

checkStatus();
