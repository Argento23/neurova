import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import config from '../src/config.js';
import { createClient } from '@supabase/supabase-js';

async function run() {
  const db = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
  
  try {
    const { data: leads, error } = await db.from('sales_leads')
      .select('*')
      .ilike('name', '%Soler%');
      
    if (error) throw error;
    
    console.log('Search Results for "Soler":');
    leads.forEach(l => {
      console.log('Lead Details:');
      console.log('  ID:', l.id);
      console.log('  Name:', l.name);
      console.log('  Company:', l.company);
      console.log('  Phone:', JSON.stringify(l.phone));
      console.log('  Email:', l.email);
      console.log('  Instagram URL:', l.instagram_url);
      console.log('  LinkedIn URL:', l.linkedin_url);
      console.log('  AI Score:', l.ai_score);
      console.log('  Stage:', l.pipeline_stage);
      console.log('  Outreach:', l.outreach_status);
    });
  } catch (e) {
    console.error(e);
  }
}

run();
