/**
 * YouTube OAuth2 Authorization — ONE-TIME SCRIPT
 * ================================================
 * Run this ONCE to get a refresh_token for YouTube Data API v3.
 * The refresh token does NOT expire (unless you revoke it).
 *
 * Prerequisites:
 *   1. Google Cloud Console → New Project → Enable "YouTube Data API v3"
 *   2. Create OAuth2 credentials (Desktop App)
 *   3. Copy Client ID and Client Secret to .env
 *
 * Usage: node src/auth/yt-auth.js
 */

import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { readFileSync, writeFileSync } from 'fs';
import { URL } from 'url';
import axios from 'axios';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..', '..');

dotenvConfig({ path: join(ROOT, '.env') });

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REDIRECT_PORT = 4001;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/callback`;

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly'
].join(' ');

// ─── Validation ───────────────────────────────────────────────
if (!CLIENT_ID || CLIENT_ID === 'your_client_id_here' || !CLIENT_ID.includes('.apps.googleusercontent.com')) {
  console.error('\n❌ ERROR: YOUTUBE_CLIENT_ID no está configurado en .env');
  console.error('   Ve a https://console.cloud.google.com/apis/credentials');
  console.error('   → Crear credenciales → ID de cliente OAuth → Aplicación de escritorio');
  console.error('   → Copia el Client ID y pegalo en .env como YOUTUBE_CLIENT_ID\n');
  process.exit(1);
}

if (!CLIENT_SECRET || CLIENT_SECRET === 'your_client_secret_here') {
  console.error('\n❌ ERROR: YOUTUBE_CLIENT_SECRET no está configurado en .env');
  console.error('   Copialo de las mismas credenciales OAuth2 en Google Cloud Console\n');
  process.exit(1);
}

// ─── Build Auth URL ───────────────────────────────────────────
const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPES);
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent'); // Force refresh_token generation

// ─── Start Local Server to Catch Callback ─────────────────────
const server = createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://localhost:${REDIRECT_PORT}`);

  if (reqUrl.pathname !== '/callback') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const code = reqUrl.searchParams.get('code');
  const error = reqUrl.searchParams.get('error');

  if (error) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <html><body style="font-family:system-ui;text-align:center;padding:60px;background:#0f0f0f;color:#ff4444">
        <h1>❌ Autorización rechazada</h1>
        <p>Error: ${error}</p>
        <p>Cerrá esta ventana y volvé a correr el script.</p>
      </body></html>
    `);
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.writeHead(400);
    res.end('Missing code');
    return;
  }

  try {
    // Exchange code for tokens
    console.log('\n🔄 Intercambiando código por tokens...');
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    });

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    if (!refresh_token) {
      console.error('\n⚠️ No se recibió refresh_token. Probá revocar acceso en:');
      console.error('   https://myaccount.google.com/permissions');
      console.error('   Buscá "Content Factory" y eliminá el acceso, luego corré este script de nuevo.\n');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <html><body style="font-family:system-ui;text-align:center;padding:60px;background:#0f0f0f;color:#ffaa00">
          <h1>⚠️ No se recibió refresh_token</h1>
          <p>Andá a <a href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</a>,
          eliminá el acceso de "Content Factory", y volvé a correr el script.</p>
        </body></html>
      `);
      server.close();
      process.exit(1);
    }

    // Verify: get channel info
    console.log('📺 Verificando canal de YouTube...');
    const channelRes = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: { part: 'snippet,statistics', mine: true },
      headers: { 'Authorization': `Bearer ${access_token}` }
    });

    const channel = channelRes.data.items?.[0];
    const channelName = channel?.snippet?.title || 'Unknown';
    const channelId = channel?.id || 'Unknown';
    const subs = channel?.statistics?.subscriberCount || '0';

    // Save to .env
    const envPath = join(ROOT, '.env');
    let envContent = readFileSync(envPath, 'utf-8');
    envContent = envContent.replace(
      /YOUTUBE_REFRESH_TOKEN=.*/,
      `YOUTUBE_REFRESH_TOKEN=${refresh_token}`
    );
    writeFileSync(envPath, envContent);

    console.log('\n✅ ¡YouTube conectado exitosamente!');
    console.log(`   Canal: ${channelName} (${channelId})`);
    console.log(`   Suscriptores: ${subs}`);
    console.log(`   Refresh Token guardado en .env`);
    console.log(`   Token expira en: NUNCA (refresh token permanente)\n`);

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <html><body style="font-family:system-ui;text-align:center;padding:60px;background:#0a0a0a;color:#00ff88">
        <h1>✅ ¡YouTube Conectado!</h1>
        <div style="background:#1a1a2e;padding:20px;border-radius:12px;display:inline-block;margin:20px">
          <p style="font-size:1.4em;margin:8px">📺 <strong>${channelName}</strong></p>
          <p style="color:#888;margin:8px">ID: ${channelId}</p>
          <p style="color:#888;margin:8px">Suscriptores: ${subs}</p>
        </div>
        <p style="color:#888;margin-top:30px">Refresh Token guardado en .env</p>
        <p style="color:#888">Podés cerrar esta ventana.</p>
      </body></html>
    `);

  } catch (err) {
    console.error('\n❌ Error al obtener tokens:', err.response?.data || err.message);
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <html><body style="font-family:system-ui;text-align:center;padding:60px;background:#0f0f0f;color:#ff4444">
        <h1>❌ Error</h1>
        <p>${err.response?.data?.error_description || err.message}</p>
      </body></html>
    `);
  }

  server.close();
  setTimeout(() => process.exit(0), 2000);
});

server.listen(REDIRECT_PORT, async () => {
  console.log('\n🎬 ═══════════════════════════════════════════════');
  console.log('   GENERARISE — YouTube Authorization');
  console.log('═══════════════════════════════════════════════════');
  console.log(`\n🌐 Abriendo navegador para autorización...`);
  console.log(`   Si no se abre automáticamente, copiá este link:\n`);
  console.log(`   ${authUrl.toString()}\n`);
  console.log('⏳ Esperando autorización...\n');

  try {
    await open(authUrl.toString());
  } catch {
    console.log('   (No se pudo abrir el navegador automáticamente, usá el link de arriba)');
  }
});
