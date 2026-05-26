import dotenv from 'dotenv';
dotenv.config();

import outreachEngine from '../src/sales/outreach-engine.js';
import config from '../src/config.js';

async function run() {
  const targetPhone = process.argv[2];
  const langCode = process.argv[3] || 'es';

  if (!targetPhone) {
    console.error('\n❌ Error: Debes proporcionar un número de teléfono en formato internacional.');
    console.error('Ejemplo de uso: node scratch/test_live_whatsapp.js 54911xxxxxxxx [es|es_LA|es_AR|en_US]\n');
    process.exit(1);
  }

  console.log('==================================================');
  console.log('🧪 PROBADOR DE WHATSAPP REAL — NEUROVA ENGINE');
  console.log('==================================================');
  console.log(`Provider activo:   ${config.WHATSAPP_PROVIDER}`);
  console.log(`Target Phone:      ${targetPhone}`);
  console.log(`Idioma a testear:  ${langCode}`);
  console.log('--------------------------------------------------');

  // Primero validamos la conexión y salud
  console.log('1. Verificando estado del canal en la API...');
  const health = await outreachEngine.checkEvolutionHealth();
  console.log(`   Resultado: ${health.healthy ? '✅ CONECTADO' : '❌ UNHEALTHY'}`);
  console.log(`   Detalle: Provider=${health.provider} | State=${health.state} | Reason=${health.reason || 'None'}`);

  if (!health.healthy) {
    console.log('\n⚠️ Abortando envío debido a que el canal no está saludable o configurado.');
    process.exit(1);
  }

  // Si elige en_US, usamos el template "hello_world" por defecto de Meta para probar el pipeline físico
  const isHelloWorld = langCode === 'en_US';
  const templateName = isHelloWorld ? 'hello_world' : 'neurova_outreach';

  console.log(`\n2. Enviando mensaje mediante Template oficial ("${templateName}") en idioma "${langCode}"...`);
  
  let templateData = null;
  if (isHelloWorld) {
    // hello_world no lleva parámetros
    templateData = {
      name: 'hello_world',
      language: 'en_US',
      parameters: []
    };
  } else {
    const textMessage = 'Este es un mensaje de prueba de la integración oficial de Meta Cloud API con tu Content Factory. Todo está funcionando al 100% y listo para la acción.';
    templateData = {
      name: 'neurova_outreach',
      language: langCode,
      parameters: [
        'Gustavo',
        'GenerArise',
        textMessage
      ]
    };
  }

  try {
    const result = await outreachEngine.sendWhatsApp(targetPhone, 'Test message', templateData);
    
    if (result.success) {
      console.log('\n✅ ¡WHATSAPP ENVIADO CON ÉXITO! 🎉');
      console.log(`   Mensaje ID: ${result.messageId}`);
      console.log('   Verifica tu celular, el mensaje debería haber llegado en segundos.');
    } else {
      console.error('\n❌ Falló el envío del mensaje.');
      console.error(`   Error: ${result.error}`);
    }
  } catch (err) {
    console.error('\n❌ Ocurrió un error inesperado al enviar:');
    console.error(err);
  }
  
  console.log('\n==================================================');
}

run();
