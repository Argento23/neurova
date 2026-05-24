import dotenv from 'dotenv';
dotenv.config();
import config from './src/config.js';
import { createClient } from '@supabase/supabase-js';

async function checkDb() {
  if (!config.SUPABASE_URL || !config.SUPABASE_KEY) {
    console.error('Supabase credentials are not in config/dotenv!');
    return;
  }
  
  console.log('Connecting to Supabase at:', config.SUPABASE_URL);
  const db = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
  
  try {
    // 1. Total leads count and status breakdown
    const { data: leads, error: leadsErr } = await db.from('sales_leads').select('outreach_status, pipeline_stage, ai_score, phone, email');
    if (leadsErr) throw leadsErr;
    
    console.log(`\n=== LEADS SUMMARY (Total: ${leads.length}) ===`);
    const statusMap = {};
    const stageMap = {};
    let pendingScored = 0;
    let pendingUnscored = 0;
    let hasPhoneOrEmail = 0;
    let eligibleForOutreach = 0;
    
    leads.forEach(l => {
      statusMap[l.outreach_status] = (statusMap[l.outreach_status] || 0) + 1;
      stageMap[l.pipeline_stage] = (stageMap[l.pipeline_stage] || 0) + 1;
      
      const hasContact = l.phone || l.email;
      if (hasContact) hasPhoneOrEmail++;
      
      if (l.outreach_status === 'pending') {
        if (l.ai_score >= 50) {
          pendingScored++;
          if (hasContact && !['rejected', 'dead', 'unsubscribed'].includes(l.pipeline_stage)) {
            eligibleForOutreach++;
          }
        } else {
          pendingUnscored++;
        }
      }
    });
    
    console.log('Outreach Status Breakdown:', statusMap);
    console.log('Pipeline Stage Breakdown:', stageMap);
    console.log('Has Phone or Email:', hasPhoneOrEmail);
    console.log('Pending Outreach (AI Score >= 50):', pendingScored);
    console.log('Pending Outreach (AI Score < 50 / Unscored):', pendingUnscored);
    console.log('Eligible for Outreach RIGHT NOW:', eligibleForOutreach);
    
    // 2. Check the last 10 outreach logs to see if there were any failures
    const { data: logs, error: logsErr } = await db.from('sales_outreach_log').select('*').order('created_at', { ascending: false }).limit(10);
    if (logsErr) {
      console.warn('Could not fetch sales_outreach_log, maybe it does not exist or is empty:', logsErr.message);
    } else {
      console.log('\n=== RECENT OUTREACH LOGS ===');
      if (logs.length === 0) {
        console.log('No outreach logs found.');
      } else {
        logs.forEach(log => {
          console.log(`[${log.created_at}] Lead ID: ${log.lead_id} | Channel: ${log.channel} | Status: ${log.status} | Error: ${log.error_message || 'None'}`);
        });
      }
    }
  } catch (err) {
    console.error('Error during database check:', err);
  }
}

checkDb();
