import dotenv from 'dotenv';
dotenv.config();
import config from './src/config.js';
import axios from 'axios';

async function check() {
  console.log('=== CONFIG CHECK ===');
  console.log('WHATSAPP_PROVIDER:', config.WHATSAPP_PROVIDER);
  console.log('META_CLOUD_TOKEN:', config.META_CLOUD_TOKEN ? config.META_CLOUD_TOKEN.substring(0,20)+'...' : 'MISSING');
  console.log('META_PHONE_NUMBER_ID:', config.META_PHONE_NUMBER_ID);
  console.log('META_WABA_ID:', config.META_WABA_ID);
  console.log('META_API_VERSION:', config.META_API_VERSION);
  console.log('EVOLUTION_API_URL:', config.EVOLUTION_API_URL);
  console.log('EVOLUTION_INSTANCE:', config.EVOLUTION_INSTANCE);
  
  // 1) Meta Cloud API Health
  console.log('\n=== META CLOUD API CHECK ===');
  try {
    const res = await axios.get(
      `https://graph.facebook.com/${config.META_API_VERSION}/${config.META_PHONE_NUMBER_ID}`,
      { headers: { 'Authorization': `Bearer ${config.META_CLOUD_TOKEN}` }, timeout: 10000 }
    );
    console.log('✅ HEALTHY');
    console.log('Quality:', res.data?.quality_rating);
    console.log('Display Phone:', res.data?.display_phone_number);
    console.log('Verified Name:', res.data?.verified_name);
    console.log('Platform:', res.data?.platform_type);
  } catch(e) {
    console.log('❌ FAILED');
    console.log('Error:', e.response?.data?.error?.message || e.message);
    console.log('Error Code:', e.response?.data?.error?.code);
  }

  // 2) Check message templates
  console.log('\n=== META TEMPLATES CHECK ===');
  try {
    const tplRes = await axios.get(
      `https://graph.facebook.com/${config.META_API_VERSION}/${config.META_WABA_ID}/message_templates`,
      { headers: { 'Authorization': `Bearer ${config.META_CLOUD_TOKEN}` }, timeout: 10000 }
    );
    const templates = tplRes.data?.data || [];
    console.log(`Found ${templates.length} templates:`);
    templates.forEach(t => {
      console.log(`  - ${t.name} (${t.status}) lang:${t.language}`);
    });
  } catch(e) {
    console.log('❌ Templates check failed:', e.response?.data?.error?.message || e.message);
  }

  // 3) Evolution API Health (fallback)
  console.log('\n=== EVOLUTION API CHECK ===');
  if (config.EVOLUTION_API_URL) {
    const baseUrl = config.EVOLUTION_API_URL.endsWith('/') 
      ? config.EVOLUTION_API_URL.slice(0, -1) 
      : config.EVOLUTION_API_URL;
    try {
      const res = await axios.get(`${baseUrl}/instance/connectionState/${config.EVOLUTION_INSTANCE}`, {
        headers: { 'apikey': config.EVOLUTION_API_KEY }, timeout: 10000
      });
      const state = res.data?.instance?.state || res.data?.state || 'unknown';
      console.log(state === 'open' ? '✅ CONNECTED' : `⚠️ State: ${state}`);
      console.log('Raw:', JSON.stringify(res.data));
    } catch(e) {
      console.log('❌ FAILED:', e.response?.status, e.response?.data?.message || e.message);
    }
  } else {
    console.log('⚠️ Not configured');
  }

  // 4) Check WABA phone numbers
  console.log('\n=== WABA PHONE NUMBERS ===');
  try {
    const phoneRes = await axios.get(
      `https://graph.facebook.com/${config.META_API_VERSION}/${config.META_WABA_ID}/phone_numbers`,
      { headers: { 'Authorization': `Bearer ${config.META_CLOUD_TOKEN}` }, timeout: 10000 }
    );
    const phones = phoneRes.data?.data || [];
    console.log(`Found ${phones.length} phone numbers:`);
    phones.forEach(p => {
      console.log(`  - ${p.display_phone_number} (ID: ${p.id}) quality: ${p.quality_rating} status: ${p.code_verification_status}`);
    });
  } catch(e) {
    console.log('❌ Failed:', e.response?.data?.error?.message || e.message);
  }
}

check().catch(console.error);
