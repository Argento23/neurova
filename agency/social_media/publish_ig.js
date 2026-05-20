const axios = require('axios');

/**
 * Script para publicar contenido en Instagram Business API
 * GenerArise Authority Booster
 */

const FB_APP_ID = '806705918349616';
const ACCESS_TOKEN = 'EAALdsduzkTABRHc2bhThsLtuKwlJZAmwuZBrcEbpW6iZBvs3NAL2kM2VNQsyeZA5W6WBv2XInePWvgRtmeZAlj54VsK66A2HmHtcP8o1vYdwPfEa2ZA0DtxvGWpD5Yv6XqPC2MwsrJL11gTNIyB1TtAdS1vyAmZA0lo0RyWB9k3cZCUJGoOZC6FJGesu8egPNslWSLCKZCUxxbO9oytIOtgxgW452vztMlFYtuiH8TVs3dnf2MWceNxMMECk4HLXRoi5HCQ4ZAQRcuQQcFvTrmzg705PVuA';
const IG_USER_ID = '17841480081723095';

async function publishPost(imageUrl, caption) {
    try {
        console.log('--- Iniciando publicación en Instagram ---');
        
        // 1. Crear el contenedor de media
        const containerResponse = await axios.post(`https://graph.facebook.com/v19.0/${IG_USER_ID}/media`, {
            image_url: imageUrl,
            caption: caption,
            access_token: ACCESS_TOKEN
        });

        const creationId = containerResponse.data.id;
        console.log('✅ Contenedor creado. ID:', creationId);

        // 2. Publicar el contenedor
        const publishResponse = await axios.post(`https://graph.facebook.com/v19.0/${IG_USER_ID}/media_publish`, {
            creation_id: creationId,
            access_token: ACCESS_TOKEN
        });

        console.log('🚀 ¡Publicación exitosa! ID de Media:', publishResponse.data.id);
        return publishResponse.data;

    } catch (error) {
        console.error('❌ Error al publicar:', error.response ? error.response.data : error.message);
    }
}

const firstPost = {
    imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800', // Unsplash puro JPG - Equipo/Tech
    caption: '¡WhatsApp, Instagram y Web en un solo lugar! 📱💻\n\nCentraliza todas tus comunicaciones con GenerArise. Nuestros agentes virtuales interactúan con tus clientes usando la misma inteligencia de ventas en cualquier plataforma, y tú lo monitoreas todo desde un solo panel.\n\n#Omnicanalidad #AtencionAlCliente #Chatwoot #GenerAriseAuthority'
};

if (ACCESS_TOKEN && IG_USER_ID) {
    publishPost(firstPost.imageUrl, firstPost.caption);
} else {
    console.log('⚠️ Falta FB_ACCESS_TOKEN o IG_USER_ID en las variables de entorno.');
}
