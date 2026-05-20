const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const VAPI_PRIVATE_KEY = '563af1ef-d671-4cf8-ae6d-d9da58719361'; 
const PHONE_NUMBER = '+17868226051'; // El número de Miami que ya tienes

console.clear();
console.log("\n=============================================");
console.log("  ASISTENTE AUTOMÁTICO DE CONEXIÓN VAPI 🤖  ");
console.log("=============================================\n");
console.log("¡Hola Gustavo! Tranquilo, yo haré el trabajo duro por ti.");
console.log("Solo necesito 2 datos exactos de tu panel de Zadarma.\n");
console.log("👉 Ve a Zadarma.com > Menú 'Mi Centralita' > 'Extensiones'.");
console.log("Ahí verás una cajita con tu número de extensión y, al lado, una contraseña.\n");

readline.question("1. Escribe tu número de extensión (Ejemplo: 445588-100) y presiona Enter: ", (ZADARMA_EXTENSION) => {
  readline.question("2. Escribe la CONTRASEÑA de esa extensión y presiona Enter: ", async (ZADARMA_PASSWORD) => {
    
    readline.close();
    console.log(`\n⏳ ¡Perfecto! Conectando la extensión ${ZADARMA_EXTENSION} a tu asistente Alex...\n`);

    // ====== PASO 1 ======
    const credentialPayload = {
      provider: "byo-sip-trunk",
      name: "Zadarma Trunk V2",
      gateways: [
        { ip: "pbx.zadarma.com", inboundEnabled: false }
      ],
      outboundLeadingPlusEnabled: true,
      outboundAuthenticationPlan: {
        authUsername: ZADARMA_EXTENSION.trim(),
        authPassword: ZADARMA_PASSWORD.trim()
      }
    };

    let credentialId = null;

    try {
      const credResponse = await fetch('https://api.vapi.ai/credential', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`
        },
        body: JSON.stringify(credentialPayload)
      });
      
      if (!credResponse.ok) {
         console.error("❌ Falló la validación. Verifica que la contraseña de Zadarma sea correcta.");
         return;
      }
      const credData = await credResponse.json();
      credentialId = credData.id;
      console.log(`✅ Paso 1 listo: Permiso concedido por Vapi.`);
    } catch (err) {
      console.error("❌ Error de red:", err.message);
      return;
    }

    // ====== PASO 2 ======
    const numberPayload = {
      provider: "byo-phone-number",
      name: "Zaparma Miami Number",
      number: PHONE_NUMBER,
      numberE164CheckEnabled: false,
      credentialId: credentialId
    };

    try {
      const numResponse = await fetch('https://api.vapi.ai/phone-number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`
        },
        body: JSON.stringify(numberPayload)
      });

      if (!numResponse.ok) {
         console.error("❌ Falló al vincular el número.");
         return;
      }
      console.log(`✅ Paso 2 listo: Número ${PHONE_NUMBER} vinculado con éxito a la IA.\n`);
    } catch (err) {
      console.error("❌ Error de red:", err.message);
      return;
    }

    // ====== INSTRUCCIONES FINALES ======
    console.log("==========================================================================");
    console.log("🎉 ¡TU NÚMERO YA TIENE VIDA! 🎉");
    console.log("==========================================================================");
    console.log("Solo falta un último clic en Zadarma para decirle 'envía las llamadas a la IA':");
    console.log(`1. Vuelve a Zadarma. En esa misma extensión (${ZADARMA_EXTENSION}...`);
    console.log("2. Activa la opción 'Desvío y correo de voz' marcando 'Siempre'.");
    console.log("3. En el desplegable 'Desvío a' elige 'Servidor externo (SIP URI)'.");
    console.log(`4. En el campo de texto que aparece, pega esto:  ${PHONE_NUMBER}@sip.vapi.ai`);
    console.log("5. ¡Clic en Guardar y prueba llamar a tu número de Miami!");
    console.log("==========================================================================\n");

  });
});
