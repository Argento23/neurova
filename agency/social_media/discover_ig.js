const axios = require('axios');

const ACCESS_TOKEN = 'EAALdsduzkTABRHc2bhThsLtuKwlJZAmwuZBrcEbpW6iZBvs3NAL2kM2VNQsyeZA5W6WBv2XInePWvgRtmeZAlj54VsK66A2HmHtcP8o1vYdwPfEa2ZA0DtxvGWpD5Yv6XqPC2MwsrJL11gTNIyB1TtAdS1vyAmZA0lo0RyWB9k3cZCUJGoOZC6FJGesu8egPNslWSLCKZCUxxbO9oytIOtgxgW452vztMlFYtuiH8TVs3dnf2MWceNxMMECk4HLXRoi5HCQ4ZAQRcuQQcFvTrmzg705PVuA';

async function getInstagramId() {
    try {
        console.log('--- Buscando Instagram Business ID ---');
        
        // 1. Obtener las páginas de Facebook vinculadas
        const pagesResponse = await axios.get(`https://graph.facebook.com/v19.0/me/accounts?access_token=${ACCESS_TOKEN}`);
        const pages = pagesResponse.data.data;
        
        if (pages.length === 0) {
            console.log('❌ No se encontraron páginas de Facebook vinculadas a este token.');
            return;
        }

        console.log(`✅ Se encontraron ${pages.length} páginas.`);

        for (const page of pages) {
            console.log(`\nRevisando página: ${page.name} (ID: ${page.id})`);
            
            // 2. Buscar el Instagram Business ID vinculado a esta página
            const igResponse = await axios.get(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${ACCESS_TOKEN}`);
            
            if (igResponse.data.instagram_business_account) {
                const igId = igResponse.data.instagram_business_account.id;
                console.log(`🚀 ¡ENCONTRADO! Instagram Business Account ID: ${igId}`);
                console.log(`Para publicar: IG_USER_ID=${igId}`);
                return igId;
            } else {
                console.log('ℹ️ Esta página no tiene una cuenta de Instagram Business vinculada.');
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.response ? error.response.data : error.message);
    }
}

getInstagramId();
