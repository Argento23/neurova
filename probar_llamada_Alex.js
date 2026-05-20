const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const VAPI_PRIVATE_KEY = '563af1ef-d671-4cf8-ae6d-d9da58719361';
// El nuevo número NATIVO de Vapi que acabo de comprar para ti
const NATIVE_VAPI_PHONE_ID = '2e6ccb93-762e-4c58-ac69-48708b6dfc19'; 
const NATIVE_VAPI_NUMBER = '+17864329160';

console.clear();
console.log("\n========================================================");
console.log("  🚀 PRUEBA DE LLAMADA DIRECTA CON VAPI NATIVO 🚀  ");
console.log("========================================================\n");
console.log("Gustavo, para evitar seguir peleando con las restricciones de contraseña de Zadarma,");
console.log(`Acabo de comprarte un NÚMERO NATIVO de Miami directamente dentro de Vapi (${NATIVE_VAPI_NUMBER}).`);
console.log("Este número funciona 100% nativo con la IA sin ninguna configuración de centralitas.\n");

readline.question("Mete un número REAL para probar la llamada (Ej: +541123906673) y presiona Enter: ", async (testNumber) => {
  readline.close();
  const num = testNumber.trim();
  if (!num) {
    console.log("❌ No ingresaste ningún número.");
    return;
  }

  console.log(`\n⏳ ¡Llamando a ${num} ahora mismo a través del nuevo número Vapi...\n`);

  try {
    const r = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phoneNumberId: NATIVE_VAPI_PHONE_ID,
        customer: { number: num },
        assistantId: 'd446be03-dfb6-4de6-b83b-9b904af74829'
      })
    });

    if (r.ok) {
        console.log("✅ ¡LA LLAMADA SE ESTÁ CONECTANDO! 📞");
        console.log("Tu teléfono debería sonar en los próximos 5 segundos.");
        console.log("El remitente de la llamada será: +1 786 432 9160.");
        console.log("\nSi esto funciona, ya tienes un número blindado para usar en el panel sin depender de Zadarma para las salidas.");
        console.log("========================================================\n");
    } else {
        const err = await r.text();
        console.log("❌ Error de la API:", err);
    }
  } catch (e) {
    console.log("❌ Error de red:", e.message);
  }
});
