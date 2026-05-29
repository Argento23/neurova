import dotenv from 'dotenv';
dotenv.config();

import outreachEngine from '../src/sales/outreach-engine.js';
import config from '../src/config.js';

async function run() {
  const phoneWith9 = '5491123906673';
  const phoneWithout9 = '541123906673';
  const textMessage = 'Hola Gustavo! Esta es una prueba de neurova/content-factory. Si recibes esto, significa que este canal funciona perfectamente. 🚀';

  console.log('=== TEST DUAL WHATSAPP SENDER ===');
  console.log('WABA ID:', config.META_WABA_ID);
  console.log('Evolution Instance:', config.EVOLUTION_INSTANCE);
  console.log('---------------------------------');

  // 1. Send via Cloud API (Template)
  const templateDataWith9 = {
    name: 'neurova_outreach',
    language: 'es_ES',
    parameters: ['Gustavo', 'GenerArise', textMessage]
  };

  console.log(`\n[1] Probando Meta Cloud API con 549 (con 9)...`);
  try {
    const res1 = await outreachEngine.sendWhatsApp(phoneWith9, textMessage, templateDataWith9, 'cloud_api');
    console.log('Resultado:', res1);
  } catch(e) {
    console.error('Error res1:', e.message);
  }

  console.log(`\n[2] Probando Meta Cloud API con 54 (sin 9)...`);
  try {
    const res2 = await outreachEngine.sendWhatsApp(phoneWithout9, textMessage, templateDataWith9, 'cloud_api');
    console.log('Resultado:', res2);
  } catch(e) {
    console.error('Error res2:', e.message);
  }

  // 2. Send via Evolution API (Free text)
  console.log(`\n[3] Probando Evolution API con 549 (con 9)...`);
  try {
    const res3 = await outreachEngine.sendWhatsApp(phoneWith9, textMessage, null, 'evolution');
    console.log('Resultado:', res3);
  } catch(e) {
    console.error('Error res3:', e.message);
  }

  console.log(`\n[4] Probando Evolution API con 54 (sin 9)...`);
  try {
    const res4 = await outreachEngine.sendWhatsApp(phoneWithout9, textMessage, null, 'evolution');
    console.log('Resultado:', res4);
  } catch(e) {
    console.error('Error res4:', e.message);
  }

  console.log('\n=== PRUEBAS COMPLETADAS ===');
}

run().catch(console.error);
