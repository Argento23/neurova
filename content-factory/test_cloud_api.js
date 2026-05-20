import axios from 'axios';

const TOKEN = 'EAAcoKsEGgwYBRcsYP6lVMml8AeZBp11SZC4ikz9TQbqX4uJpPQiqGw578z9kmBkL61Ha8xZCGF04Dwi3ZC0fkDQX5SGtcBAdeiKY5i38S59tCvWVv1yVx05LMtgAWD1ESTajheBFUJFKp2O6yECf9TeFoRj6CKGw3QqCm5vbnrTflpukJFZATbQqNDJ5B0iWMcQZDZD';
const PHONE_ID = '1104497082748018'; // From your Meta dashboard
const TO_NUMBER = '5491124097260'; // Your original GenerArise number to test receiving, or your personal number

async function testWhatsApp() {
  console.log('Enviando mensaje de prueba vía Meta Cloud API...');
  try {
    const res = await axios.post(
      `https://graph.facebook.com/v25.0/${PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: TO_NUMBER,
        type: 'text',
        text: { body: '¡Hola! Este es un mensaje de prueba desde el nuevo motor de Cloud API de Neurova. 🚀 Cero riesgo de bans.' }
      },
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ ¡Mensaje enviado con éxito!');
    console.log('ID del mensaje:', res.data.messages[0].id);
  } catch (err) {
    console.error('❌ Error al enviar:', err.response?.data?.error || err.message);
  }
}

testWhatsApp();
