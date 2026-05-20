const axios = require('axios');

/**
 * Script para publicar 3 posts en Instagram Business API
 * GenerArise Authority Booster - Batch Publisher
 */

const ACCESS_TOKEN = 'EAALdsduzkTABRQG8dETVE4ChEfP26P2UscIEKjLA9j2wbssQdd2alo0V5cXB9Pc5AvEv6j14MnYvZAZB6eH6i3oPTrd8Ln0HNGwlmGmfSxFfhiqe9DlR7dbEX5906euFHECvJ5LBJZBNfvBu5nvmxvpmvuxQYgC6PQoWE3i9swPukYs85ks6spCJlsJnTKLvZCam8GFmQGqerOzf3EGuHZBxyZAYf2B7MqgxIo8tulZAaZBcYc7Te1drAcDEgHmxbC6JKVM2V1TSYtBBjwdfeH0bWEDl';
const IG_USER_ID = '17841480081723095';

const posts = [
    {
        imageUrl: 'https://files.catbox.moe/vgmxbq.png',
        caption: `¿Cansado de perder leads por no responder a tiempo? 📉

Con los Agentes Virtuales Autónomos de GenerArise, garantizás respuestas automáticas, personalizadas y al instante 24/7 en WhatsApp e Instagram.

🚀 No dejes dinero sobre la mesa. Automatizá tus ventas hoy.

#VentasB2B #Automatizacion #IA #Chatwoot #GenerArise #WhatsAppBusiness #AtencionAlCliente #LeadGeneration`
    },
    {
        imageUrl: 'https://files.catbox.moe/rb52zz.png',
        caption: `El futuro de las ventas B2B ya está aquí. 🌐

La calificación de leads no tiene que ser manual. Integra inteligencia artificial con tus canales de comunicación para analizar, pre-calificar y nutrir a tus prospectos antes de que el equipo intervenga.

⚡ Eficiencia y reducción de costos desde el día 1.

#InteligenciaArtificial #GeneracionDeLeads #TechSales #GenerAriseAuthority #AIAgents #SalesAutomation`
    },
    {
        imageUrl: 'https://files.catbox.moe/uton2b.png',
        caption: `Centralizá todas tus operaciones. 📊

Manejar Instagram, Facebook y WhatsApp por vías separadas genera fricción y lentitud. Conecta todas tus bandejas de entrada a nuestro sistema inteligente y toma el control total de tus comunicaciones desde un solo panel. 📈

La omnicanalidad no es lujo, es necesidad.

#Omnicanalidad #CRM #AgenciaAutomatizacion #GrowthHacking #GenerArise #DashboardInteligente #B2B`
    }
];

async function createContainer(imageUrl, caption) {
    const response = await axios.post(`https://graph.facebook.com/v19.0/${IG_USER_ID}/media`, {
        image_url: imageUrl,
        caption: caption,
        access_token: ACCESS_TOKEN
    });
    return response.data.id;
}

async function waitForContainer(containerId, maxAttempts = 20) {
    for (let i = 0; i < maxAttempts; i++) {
        const response = await axios.get(`https://graph.facebook.com/v19.0/${containerId}`, {
            params: {
                fields: 'status_code',
                access_token: ACCESS_TOKEN
            }
        });
        const status = response.data.status_code;
        console.log(`   ⏳ Estado del contenedor: ${status}`);
        if (status === 'FINISHED') return true;
        if (status === 'ERROR') return false;
        await new Promise(r => setTimeout(r, 3000));
    }
    return false;
}

async function publishContainer(containerId) {
    const response = await axios.post(`https://graph.facebook.com/v19.0/${IG_USER_ID}/media_publish`, {
        creation_id: containerId,
        access_token: ACCESS_TOKEN
    });
    return response.data.id;
}

async function main() {
    console.log('==============================================');
    console.log('  GenerArise - Instagram Batch Publisher');
    console.log('==============================================\n');

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        console.log(`\n📸 Post ${i + 1}/${posts.length}`);
        console.log(`   Imagen: ${post.imageUrl.substring(0, 60)}...`);
        console.log(`   Caption: ${post.caption.substring(0, 50)}...`);

        try {
            // Paso 1: Crear contenedor
            console.log('   📦 Creando contenedor de media...');
            const containerId = await createContainer(post.imageUrl, post.caption);
            console.log(`   ✅ Contenedor creado: ${containerId}`);

            // Paso 2: Esperar que procese
            console.log('   ⏳ Esperando procesamiento...');
            const ready = await waitForContainer(containerId);
            if (!ready) {
                console.log('   ❌ Error: el contenedor no se procesó correctamente');
                continue;
            }

            // Paso 3: Publicar
            console.log('   🚀 Publicando...');
            const mediaId = await publishContainer(containerId);
            console.log(`   ✅ ¡PUBLICADO! Media ID: ${mediaId}`);

        } catch (error) {
            const errData = error.response ? JSON.stringify(error.response.data) : error.message;
            console.error(`   ❌ Error en post ${i + 1}: ${errData}`);
        }

        // Pausa entre posts para evitar rate limiting
        if (i < posts.length - 1) {
            console.log('\n   ⏸️  Esperando 10 segundos antes del siguiente post...');
            await new Promise(r => setTimeout(r, 10000));
        }
    }

    console.log('\n==============================================');
    console.log('  ✅ Proceso de publicación finalizado');
    console.log('==============================================');
}

main();
