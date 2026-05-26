import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import axios from 'axios';
import config from '../src/config.js';

async function testToken() {
  console.log("Testing YouTube / Google OAuth2 Refresh Token...");
  console.log("Client ID:", config.YOUTUBE_CLIENT_ID);
  console.log("Refresh Token:", config.YOUTUBE_REFRESH_TOKEN ? "Present (ends with " + config.YOUTUBE_REFRESH_TOKEN.slice(-10) + ")" : "Missing");

  try {
    const res = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: config.YOUTUBE_CLIENT_ID,
      client_secret: config.YOUTUBE_CLIENT_SECRET,
      refresh_token: config.YOUTUBE_REFRESH_TOKEN,
      grant_type: 'refresh_token'
    });

    console.log("\n✅ Success! New access token retrieved:");
    console.log("Access Token:", res.data.access_token.substring(0, 15) + "...");
    console.log("Expires In:", res.data.expires_in, "seconds");
  } catch (err) {
    console.error("\n❌ YouTube Token Refresh Failed (HTTP 400 is common for expired/revoked tokens):");
    if (err.response) {
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

testToken();
