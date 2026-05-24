import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // load from parent .env
import config from '../src/config.js';
import { createClient } from '@supabase/supabase-js';

async function run() {
  if (!config.SUPABASE_URL || !config.SUPABASE_KEY) {
    console.error('Supabase credentials are not in config/dotenv!');
    return;
  }
  
  console.log('Connecting to Supabase at:', config.SUPABASE_URL);
  const db = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
  
  try {
    // Query counts of various lead fields
    const { data: allLeads, error } = await db.from('sales_leads').select('*');
    if (error) throw error;
    
    console.log(`Total leads in db: ${allLeads.length}`);
    
    let withIgUsername = 0;
    let withIgUrl = 0;
    let withLinkedin = 0;
    let withFbUrl = 0;
    let withPhone = 0;
    let withEmail = 0;
    
    allLeads.forEach(l => {
      if (l.ig_username) withIgUsername++;
      if (l.instagram_url) withIgUrl++;
      if (l.linkedin_url) withLinkedin++;
      if (l.facebook_url) withFbUrl++;
      if (l.phone) withPhone++;
      if (l.email) withEmail++;
    });
    
    console.log('\n=== Field Presence Summary ===');
    console.log(`Leads with ig_username: ${withIgUsername}`);
    console.log(`Leads with instagram_url: ${withIgUrl}`);
    console.log(`Leads with linkedin_url: ${withLinkedin}`);
    console.log(`Leads with facebook_url: ${withFbUrl}`);
    console.log(`Leads with phone: ${withPhone}`);
    console.log(`Leads with email: ${withEmail}`);
    
    // Sample leads with LinkedIn
    const linkedinLeads = allLeads.filter(l => l.linkedin_url);
    console.log(`\n=== Sample LinkedIn Leads (Total ${linkedinLeads.length}) ===`);
    linkedinLeads.slice(0, 5).forEach(l => {
      console.log(`- ID: ${l.id} | Name: ${l.name} | Company: ${l.company} | LinkedIn: ${l.linkedin_url} | Stage: ${l.pipeline_stage} | Outreach: ${l.outreach_status}`);
    });
    
    // Sample leads with Instagram
    const instagramLeads = allLeads.filter(l => l.instagram_url || l.ig_username);
    console.log(`\n=== Sample Instagram Leads (Total ${instagramLeads.length}) ===`);
    instagramLeads.slice(0, 5).forEach(l => {
      console.log(`- ID: ${l.id} | Name: ${l.name} | Company: ${l.company} | IG Username: ${l.ig_username} | IG URL: ${l.instagram_url} | Stage: ${l.pipeline_stage} | Outreach: ${l.outreach_status}`);
    });
    
    // Let's also check if there are outreach logs for these
    const { data: logs, error: logsError } = await db.from('sales_outreach_log').select('*');
    if (logsError) {
      console.log('Outreach logs error:', logsError.message);
    } else {
      console.log(`\nTotal outreach logs in database: ${logs.length}`);
      const logsByChannel = {};
      logs.forEach(log => {
        logsByChannel[log.channel] = (logsByChannel[log.channel] || 0) + 1;
      });
      console.log('Logs by Channel:', logsByChannel);
    }
  } catch (err) {
    console.error('Error during database check:', err);
  }
}

run();
