const axios = require('axios');

const APP_ID = '806705918349616';
const APP_SECRET = '6acd3dad87880dc0a74c98f3f58f04f8';
const USER_TOKEN = 'EAALdsduzkTABRCmii4eVuJkBDrjjNLbczqg0i8YhsMbS7bXVqrZAFQf2rWLZAIiM9tMBSE2tQZAMZALKaCkzPeYqHZBb6FWUbvZBrTK8ueFalIG3y518VVsQqICiPeqZBJkVSnTZC5WxF0EbKWmZBnjwW3fDPqEoZADGSDDYRxXMDsmIIrokzR1GZCKicLLVNEUZAjU2UYdNZArD5XiZC6BpasMQDYPAsm7BGL0KDHm5MbOQZBoCR1W8UKTmVAvhbZCLB37iXazEjweQeikLGZAIZCmqCeYXInODkacwZDZD';

async function debugToken() {
    try {
        console.log('--- Depurando Token de Usuario ---');
        
        const appToken = `${APP_ID}|${APP_SECRET}`;
        const response = await axios.get(`https://graph.facebook.com/debug_token`, {
            params: {
                input_token: USER_TOKEN,
                access_token: appToken
            }
        });

        const data = response.data.data;
        console.log('✅ Token válido hasta:', new Date(data.expires_at * 1000).toLocaleString());
        console.log('🆔 User ID:', data.user_id);
        console.log('📋 Scopes concedidos:', data.scopes.join(', '));
        
        if (!data.scopes.includes('pages_show_list')) {
            console.log('❌ ERROR: Falta el permiso pages_show_list');
        }
        if (!data.scopes.includes('instagram_basic')) {
            console.log('❌ ERROR: Falta el permiso instagram_basic');
        }

    } catch (error) {
        console.error('❌ Error en depuración:', error.response ? error.response.data : error.message);
    }
}

debugToken();
