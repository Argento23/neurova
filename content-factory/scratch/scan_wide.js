import axios from 'axios';

const token = "EAAcoKsEGgwYBRsmz3eseGzqDi64VhFRwnGuoCec7PknTZAMcxHKAnzzQYpeOPQ3hGyZATVg2EJkowLGM4cexIjDVP8GJcGfQvmhXyFHbWrDoKpEDQMjqohmh7h4ecOyR1Rl9i4EpyUf0zApZCVMhApbfxkQd86Ptg3zgvMANdAAD2PssZB3RGbI06cj16dpRpgZDZD";
const phoneId = "1104497082748018";
const toNumber = "5491123906673";

// Escaneo súper amplio de idiomas comunes
const langs = ['es', 'es_LA', 'es_AR', 'es_MX', 'es_ES', 'en', 'en_US', 'es_US', 'es-419', 'es_419'];
const paramCounts = [2, 3];

async function scanWide() {
  console.log("Iniciando escaneo de amplio espectro de idiomas y parámetros...");
  
  for (const lang of langs) {
    for (const count of paramCounts) {
      console.log(`\nTesting: Idioma="${lang}" | Parámetros=${count}...`);
      
      const parameters = [];
      if (count >= 1) parameters.push({ type: 'text', text: 'Gustavo' });
      if (count >= 2) parameters.push({ type: 'text', text: 'GenerArise' });
      if (count >= 3) parameters.push({ type: 'text', text: 'Este es un mensaje de prueba.' });
      
      try {
        const res = await axios.post(
          `https://graph.facebook.com/v19.0/${phoneId}/messages`,
          {
            messaging_product: 'whatsapp',
            to: toNumber,
            type: 'template',
            template: {
              name: 'neurova_outreach',
              language: { code: lang },
              components: [
                {
                  type: 'body',
                  parameters: parameters
                }
              ]
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log(`\n🎉 ¡CONEXIÓN EXITOSA ENCONTRADA!`);
        console.log(`👉 Idioma correcto: "${lang}"`);
        console.log(`👉 Cantidad de parámetros: ${count}`);
        console.log("Response:", res.data);
        return;
      } catch (err) {
        const msg = err.response?.data?.error?.message || err.message;
        console.log(`❌ Falló: ${msg}`);
      }
    }
  }
  
  console.log("\n==================================================");
  console.log("❌ Escaneo amplio completo sin éxito.");
  console.log("==================================================");
}

scanWide();
