const axios = require('axios');

const API_KEY = 'YWdlbnRlcy5zcGFjZUBnbWFpbC5jb20:tdsRhXaFsNK9AmxjiD-_Q';
const IMAGE_URL = 'https://create-images-results.d-id.com/api_docs/assets/noelle.jpeg'; // Modelo oficial de D-ID
const TEXT = "Hola Gustavo. Soy tu nuevo avatar de inteligencia artificial para Genera Rise. Conmigo, tus publicaciones de Instagram van a conseguir diez veces más retención que una imagen estática. Así es como vas a conseguir clientes automáticos sin riesgo de que te bloqueen WhatsApp.";

async function createVideo() {
  console.log("1. Enviando petición a D-ID para generar el video...");
  try {
    const createRes = await axios.post('https://api.d-id.com/talks', {
      source_url: IMAGE_URL,
      script: {
        type: 'text',
        input: TEXT,
        provider: {
          type: 'microsoft',
          voice_id: 'es-AR-TomasNeural' // Voz de hombre argentino
        }
      },
      config: {
        fluent: true,
        pad_audio: 0.0
      }
    }, {
      headers: {
        'Authorization': `Basic ${Buffer.from(API_KEY).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });

    const talkId = createRes.data.id;
    console.log(`✅ Video iniciado! ID: ${talkId}`);
    console.log("2. Esperando a que el servidor termine de procesar (esto toma unos 15 segundos)...");

    // Polling until done
    let status = 'created';
    let resultUrl = null;
    
    while (status === 'created' || status === 'started') {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const statusRes = await axios.get(`https://api.d-id.com/talks/${talkId}`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(API_KEY).toString('base64')}`
        }
      });
      
      status = statusRes.data.status;
      console.log(`Estado: ${status}...`);
      
      if (status === 'done') {
        resultUrl = statusRes.data.result_url;
      } else if (status === 'error') {
        console.error("❌ Error generando el video:", statusRes.data);
        return;
      }
    }

    console.log("\n=============================================");
    console.log("🎉 VIDEO GENERADO CON ÉXITO!");
    console.log("👉 COPIA ESTE ENLACE EN TU NAVEGADOR PARA VERLO:");
    console.log(resultUrl);
    console.log("=============================================\n");

  } catch (err) {
    console.error("❌ Error de la API:", err.response ? err.response.data : err.message);
  }
}

createVideo();
