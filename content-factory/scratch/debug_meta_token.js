import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.IG_ACCESS_TOKEN;
const apiBase = 'https://graph.facebook.com/v19.0';

async function debugToken() {
  console.log('--- Meta Token Debug ---');
  try {
    // 1. Get Me
    const meRes = await axios.get(`${apiBase}/me`, {
      params: { access_token: token, fields: 'id,name' }
    });
    console.log(`User/Page: ${meRes.data.name} (${meRes.data.id})`);

    // 2. Get Permissions
    const permRes = await axios.get(`${apiBase}/me/permissions`, {
      params: { access_token: token }
    });
    console.log('\nPermissions:');
    permRes.data.data.forEach(p => {
      console.log(` - ${p.permission}: ${p.status}`);
    });

    // 3. Get Accounts (Pages)
    const accRes = await axios.get(`${apiBase}/me/accounts`, {
      params: { access_token: token, fields: 'id,name,tasks,access_token' }
    });
    console.log('\nAccessible Pages:');
    accRes.data.data.forEach(p => {
      console.log(` - ${p.name} (${p.id})`);
      console.log(`   Tasks: ${p.tasks.join(', ')}`);
      if (p.access_token) console.log(`   (Has Page Token)`);
    });

  } catch (error) {
    console.error('Error debugging token:', error.response?.data?.error || error.message);
  }
}

debugToken();
