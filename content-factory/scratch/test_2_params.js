import axios from 'axios';

const token = "EAAcoKsEGgwYBRsmz3eseGzqDi64VhFRwnGuoCec7PknTZAMcxHKAnzzQYpeOPQ3hGyZATVg2EJkowLGM4cexIjDVP8GJcGfQvmhXyFHbWrDoKpEDQMjqohmh7h4ecOyR1Rl9i4EpyUf0zApZCVMhApbfxkQd86Ptg3zgvMANdAAD2PssZB3RGbI06cj16dpRpgZDZD";
const phoneId = "1104497082748018";
const toNumber = "5491123906673";

async function test2Params() {
  console.log("Enviando 'neurova_outreach' con exactamente 2 parámetros...");
  try {
    const res = await axios.post(
      `https://graph.facebook.com/v19.0/${phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: toNumber,
        type: 'template',
        template: {
          name: 'neurova_outreach',
          language: { code: 'es' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: 'Gustavo' },
                { type: 'text', text: 'GenerArise' }
              ]
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
    console.log("✅ ¡ENVIADO CON ÉXITO!");
    console.log("Response:", res.data);
  } catch (err) {
    console.error("❌ Falló el envío con 2 parámetros:");
    if (err.response) {
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

test2Params();
