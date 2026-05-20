import dotenv from 'dotenv';
dotenv.config();

import engine from './src/sales/outreach-engine.js';

async function run() {
  console.log('=== Running Outreach Engine Dry Run ===');
  try {
    const result = await engine.runOutreachBatch({ dryRun: true, maxLeads: 5, type: 'new' });
    console.log('\nDry Run Complete:', JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('Dry Run Failed:', e);
  }
}
run();
