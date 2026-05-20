/**
 * TikTok OAuth2 Authorization — ONE-TIME SCRIPT (MANUAL MODE)
 * ================================================
 */

import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { URL } from 'url';
import axios from 'axios';
import open from 'open';
import crypto from 'crypto';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..', '..');

dotenvConfig({ path: join(ROOT, '.env') });

const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const REDIRECT_URI = `https://app.generarise.space/callback/tiktok`;

// CSRF protection
const STATE = crypto.randomBytes(16).toString('hex');

const SCOPES = [
  'user.info.basic',
  'video.publish'
].join(',');

// Validation
if (!CLIENT_KEY || CLIENT_KEY.length < 10) {
  console.error('\n❌ ERROR: TIKTOK_CLIENT_KEY no está configurado en .env\n');
  process.exit(1);
}

// PKCE
function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier) {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

const CODE_VERIFIER = generateCodeVerifier();
const CODE_CHALLENGE = generateCodeChallenge(CODE_VERIFIER);

// Build Auth URL
const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
authUrl.searchParams.set('client_key', CLIENT_KEY);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPES);
authUrl.searchParams.set('state', STATE);
authUrl.searchParams.set('code_challenge', CODE_CHALLENGE);
authUrl.searchParams.set('code_challenge_method', 'S256');

console.log('\n🎵 ═══════════════════════════════════════════════');
console.log('   GENERARISE — TikTok Authorization (MANUAL)');
console.log('═══════════════════════════════════════════════════');
console.log(`\n🌐 Abriendo navegador para autorización...`);
console.log(`   Si no se abre automáticamente, copiá este link y pegalo en el navegador:\n`);
console.log(`   ${authUrl.toString()}\n`);

try {
  open(authUrl.toString());
} catch {
  // Ignore open error
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('⚠️  ATENCIÓN: Como TikTok bloquea las URLs locales, cuando autorices la app');
console.log('   el navegador te va a redirigir a una página que probablemente de error (app.generarise.space).');
console.log('   ¡Eso es normal! Solo tenés que copiar la URL COMPLETA que te quedó arriba en el navegador.\n');

rl.question('👉 Pegá acá la URL completa a la que fuiste redirigido: ', async (redirectedUrl) => {
  try {
    const urlObj = new URL(redirectedUrl);
    const code = urlObj.searchParams.get('code');
    
    if (!code) {
      console.error('❌ No se encontró el parámetro "code" en la URL que pegaste.');
      process.exit(1);
    }

    console.log('\n🔄 Intercambiando código por access token...');
    const tokenRes = await axios.post(
      'https://open.tiktokapis.com/v2/oauth/token/',
      new URLSearchParams({
        client_key: CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code_verifier: CODE_VERIFIER
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 30000
      }
    );

    const { access_token, refresh_token, open_id, expires_in, refresh_expires_in } = tokenRes.data;

    if (!access_token) {
      throw new Error(`TikTok no devolvió access_token: ${JSON.stringify(tokenRes.data)}`);
    }

    // Save to .env
    const envPath = join(ROOT, '.env');
    let envContent = readFileSync(envPath, 'utf-8');
    envContent = envContent.replace(/TIKTOK_ACCESS_TOKEN=.*/, `TIKTOK_ACCESS_TOKEN=${access_token}`);
    envContent = envContent.replace(/TIKTOK_OPEN_ID=.*/, `TIKTOK_OPEN_ID=${open_id}`);

    if (refresh_token) {
      if (envContent.includes('TIKTOK_REFRESH_TOKEN=')) {
        envContent = envContent.replace(/TIKTOK_REFRESH_TOKEN=.*/, `TIKTOK_REFRESH_TOKEN=${refresh_token}`);
      } else {
        envContent = envContent.replace(/TIKTOK_OPEN_ID=.*/, `TIKTOK_OPEN_ID=${open_id}\nTIKTOK_REFRESH_TOKEN=${refresh_token}`);
      }
    }

    writeFileSync(envPath, envContent);

    const accessDays = Math.round(expires_in / 86400);
    const refreshDays = Math.round((refresh_expires_in || 0) / 86400);

    console.log('\n✅ ¡TikTok conectado exitosamente!');
    console.log(`   Open ID: ${open_id}`);
    console.log(`   Access Token expira en: ${accessDays} días`);
    console.log(`   Refresh Token expira en: ${refreshDays} días`);
    console.log(`   Tokens guardados en .env\n`);

  } catch (err) {
    console.error('\n❌ Error al obtener tokens:', err.response?.data || err.message);
  } finally {
    rl.close();
    process.exit(0);
  }
});
