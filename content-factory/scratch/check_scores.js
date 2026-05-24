import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import config from '../src/config.js';
import { createClient } from '@supabase/supabase-js';

async function run() {
  const db = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
  
  try {
    const { data: leads, error } = await db.from('sales_leads').select('name, company, linkedin_url, instagram_url, ai_score, lead_score, pipeline_stage, outreach_status, phone, email');
    if (error) throw error;

    console.log('Total Leads:', leads.length);
    
    // Sort leads as in getLeads
    const sorted = [...leads].sort((a, b) => {
      if ((b.ai_score || 0) !== (a.ai_score || 0)) {
        return (b.ai_score || 0) - (a.ai_score || 0);
      }
      if ((b.lead_score || 0) !== (a.lead_score || 0)) {
        return (b.lead_score || 0) - (a.lead_score || 0);
      }
      return 0; // cannot sort by date here as it is not selected, but score is primary
    });

    console.log('\n=== Top 100 Sorted Leads (Limit of the API) ===');
    const top100 = sorted.slice(0, 100);
    let topWithLinkedin = 0;
    let topWithInstagram = 0;
    let topWithPhone = 0;
    let topWithEmail = 0;
    
    top100.forEach(l => {
      if (l.linkedin_url) topWithLinkedin++;
      if (l.instagram_url) topWithInstagram++;
      if (l.phone) topWithPhone++;
      if (l.email) topWithEmail++;
    });
    
    console.log(`Leads in top 100 with phone: ${topWithPhone}`);
    console.log(`Leads in top 100 with email: ${topWithEmail}`);
    console.log(`Leads in top 100 with linkedin_url: ${topWithLinkedin}`);
    console.log(`Leads in top 100 with instagram_url: ${topWithInstagram}`);

    console.log('\n=== Distribution of AI Scores for LinkedIn Leads ===');
    const linkedinLeads = leads.filter(l => l.linkedin_url);
    const linkedinScores = {};
    linkedinLeads.forEach(l => {
      const score = l.ai_score || 0;
      linkedinScores[score] = (linkedinScores[score] || 0) + 1;
    });
    console.log('LinkedIn Scores distribution:', linkedinScores);

    console.log('\n=== Distribution of AI Scores for Instagram Leads ===');
    const instagramLeads = leads.filter(l => l.instagram_url);
    const instagramScores = {};
    instagramLeads.forEach(l => {
      const score = l.ai_score || 0;
      instagramScores[score] = (instagramScores[score] || 0) + 1;
    });
    console.log('Instagram Scores distribution:', instagramScores);
    
    // Check if there are any leads with linkedin_url that have phone/email
    const linkedinWithPhoneOrEmail = linkedinLeads.filter(l => l.phone || l.email);
    console.log(`\nLinkedIn leads with phone or email: ${linkedinWithPhoneOrEmail.length}`);

    // Check if there are any leads with instagram_url that have phone/email
    const instagramWithPhoneOrEmail = instagramLeads.filter(l => l.phone || l.email);
    console.log(`Instagram leads with phone or email: ${instagramWithPhoneOrEmail.length}`);
    
  } catch (e) {
    console.error(e);
  }
}

run();
