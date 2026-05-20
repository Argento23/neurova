/**
 * WATCHDOG — Evolution API Auto-Reconnect
 * Corre cada 5 minutos y reconecta instancias caídas automáticamente.
 * Desplegarlo en EasyPanel como servicio separado o correrlo con PM2.
 * 
 * PM2: pm2 start watchdog_evolution.js --name watchdog --watch
 */

import fetch from 'node-fetch';

const EVOLUTION_URL = process.env.EVOLUTION_URL || 'https://trafic.generarise.space';
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY || 'TU_API_KEY_GLOBAL';
const TELEGRAM_BOT   = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT  = process.env.TELEGRAM_CHAT_ID;

// Instancias a monitorear (nombre : api_key)
const INSTANCES = {
  GenerArise: process.env.GENERARISE_KEY || 'KEY_GENERARISE',
  Argenterio: process.env.ARGENTERIO_KEY || 'KEY_ARGENTERIO',
  durando:    process.env.DURANDO_KEY    || 'KEY_DURANDO',
};

const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos

async function sendTelegram(msg) {
  if (!TELEGRAM_BOT || !TELEGRAM_CHAT) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT, text: msg, parse_mode: 'HTML' })
    });
  } catch (e) { console.error('Telegram error:', e.message); }
}

async function checkInstance(name, apiKey) {
  try {
    const res = await fetch(`${EVOLUTION_URL}/instance/connectionState/${name}`, {
      headers: { 'apikey': apiKey }
    });
    const data = await res.json();
    const state = data?.instance?.state;

    console.log(`[${new Date().toISOString()}] ${name}: ${state}`);

    if (state !== 'open') {
      console.warn(`⚠️  ${name} está DISCONNECTED. Intentando reconectar...`);
      await sendTelegram(`⚠️ <b>${name}</b> desconectado. Intentando reconexión automática...`);

      // Intentar reconexión
      const reconnect = await fetch(`${EVOLUTION_URL}/instance/connect/${name}`, {
        method: 'GET',
        headers: { 'apikey': apiKey }
      });
      const reconnectData = await reconnect.json();

      if (reconnectData?.code) {
        // Necesita escanear QR — no se puede hacer automático, alertar
        await sendTelegram(`🔴 <b>${name}</b> necesita escanear QR manualmente.\nEntrá a: ${EVOLUTION_URL}/manager/`);
      } else {
        await sendTelegram(`✅ <b>${name}</b> reconectado automáticamente.`);
      }
    }
  } catch (err) {
    console.error(`Error checking ${name}:`, err.message);
    await sendTelegram(`❌ Error chequeando <b>${name}</b>: ${err.message}`);
  }
}

async function runCheck() {
  console.log(`\n🔍 Watchdog check — ${new Date().toLocaleString('es-AR')}`);
  for (const [name, key] of Object.entries(INSTANCES)) {
    await checkInstance(name, key);
  }
}

// Correr inmediatamente y luego cada 5 minutos
runCheck();
setInterval(runCheck, CHECK_INTERVAL_MS);

console.log('🐕 Watchdog iniciado — chequeando cada 5 minutos...');
