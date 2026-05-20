import express from 'express';
import axios from 'axios';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure we load the right .env
dotenv.config({ path: join(__dirname, '../.env') });

const app = express();
const PORT = 4001;

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send('No code provided');

  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: `http://localhost:${PORT}/callback`,
      grant_type: 'authorization_code'
    });

    const refreshToken = response.data.refresh_token;
    
    if (!refreshToken) {
      return res.send(`
        <h1>⚠️ Atención</h1>
        <p>Google no envió un Refresh Token. Esto sucede si ya habías dado permiso antes. 
        Para solucionarlo, debes remover los accesos desde tu cuenta de Google y volver a intentar, o asegurarte de que la URL de autorización incluya <code>prompt=consent</code>.</p>
      `);
    }

    // Write to .env
    const envPath = join(__dirname, '../.env');
    let envContent = readFileSync(envPath, 'utf8');
    
    if (envContent.includes('YOUTUBE_REFRESH_TOKEN=')) {
      envContent = envContent.replace(/YOUTUBE_REFRESH_TOKEN=.*/, `YOUTUBE_REFRESH_TOKEN=${refreshToken}`);
    } else {
      envContent += `\nYOUTUBE_REFRESH_TOKEN=${refreshToken}\n`;
    }
    
    writeFileSync(envPath, envContent);

    res.send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1 style="color: #4CAF50;">✅ ¡Token Regenerado con Éxito!</h1>
        <p>El nuevo Refresh Token de YouTube ha sido guardado automáticamente en tu archivo <b>.env</b>.</p>
        <p>Ya puedes cerrar esta pestaña y volver al panel.</p>
      </div>
    `);
    
    console.log('--- ✅ NUEVO REFRESH TOKEN GUARDADO CON ÉXITO ---');
    setTimeout(() => process.exit(0), 2000);
    
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
    res.send('<h2>Error al obtener el token:</h2><pre>' + JSON.stringify(err.response?.data || err.message, null, 2) + '</pre>');
  }
});

app.listen(PORT, () => {
  console.log(`\nServidor de Auth escuchando en el puerto ${PORT}...`);
  console.log(`Espera a que el usuario haga clic en el enlace de autorización.\n`);
});
