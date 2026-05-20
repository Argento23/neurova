import outreachEngine from './src/sales/outreach-engine.js';
import logger from './src/logger.js';

const mockLeads = [
  { id: 1, name: 'Juan Perez', company: 'Hotel Sol', industry: 'hotel', language: 'es', phone: '123456789' },
  { id: 2, name: 'Maria Garcia', company: 'Inmobiliaria Luxury', industry: 'inmobiliaria', language: 'es', linkedin_url: 'https://linkedin.com/in/mariagarcia' },
  { id: 3, name: 'Dr. Smith', company: 'Smith Clinic', industry: 'clinica', language: 'en', email: 'smith@clinic.com' }
];

async function runTest() {
  console.log('═══ TESTING NEW OUTREACH CHANNELS (DRY RUN) ═══');
  
  for (const lead of mockLeads) {
    console.log(`\nTesting lead: ${lead.name} (${lead.industry})`);
    
    // Test Auto-selection
    const resAuto = await outreachEngine.contactLead(lead, { dryRun: true });
    console.log(`  Auto-channel: ${resAuto.channel}`);
    console.log(`  Message: ${resAuto.message.substring(0, 150)}...`);
    
    // Force LinkedIn test
    const resLinkedIn = await outreachEngine.contactLead(lead, { dryRun: true, channel: 'linkedin' });
    console.log(`  Manual LinkedIn Channel Test:`);
    console.log(`  Message: ${resLinkedIn.message}`);
  }
}

runTest();
