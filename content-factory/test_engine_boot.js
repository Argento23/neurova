import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

import engine from './src/sales/outreach-engine.js';
import config from './src/config.js';

async function run() {
  console.log('=== Testing Sales Engine Boot & WhatsApp Connection ===');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
  console.log('META_PHONE_NUMBER_ID:', process.env.META_PHONE_NUMBER_ID);
  
  try {
    const health = await engine.checkEvolutionHealth();
    console.log('\nHealth Check Result:', JSON.stringify(health, null, 2));
  } catch (e) {
    console.error('Health Check Failed:', e);
  }
}
run();
