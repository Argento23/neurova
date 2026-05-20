const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const VAPI_PRIVATE_KEY = '563af1ef-d671-4cf8-ae6d-d9da58719361';
// El ID de la credencial que sobrevivió a la limpieza
const CREDENTIAL_ID = '585823c4-8ba4-43d2-8af9-d0c168b43271';

console.clear();
console.log("\n========================================================");
console.log("  🚨 SOLUCIÓN DEL ERROR DE LLAMADAS ZADARMA - VAPI 🚨  ");
console.log("========================================================\n");
console.log("Gustavo, el error que tuvimos ('Proxy Authentication Required') significa que Zadarma rechazó la contraseña.");
console.log("⚠️ ATENCIÓN: La contraseña NO es 'Neurova2026!' (esa es tu clave de acceso a la web de Zadarma).");
console.log("Zadarma te da una contraseña secreta especial para cada extensión, que suele ser una mezcla de letras y números (ejemplo: aB3x9kM2).\n");
console.log("👉 PASO 1: Ve a Zadarma.com > 'Mi Centralita' > 'Extensiones'.");
console.log("👉 PASO 2: Busca tu extensión '559198-100'.");
console.log("👉 PASO 3: Justo a la derecha del número de extensión, hay un campo llamado 'Contraseña'. Cópiala exacta!\n");

readline.question("Pegue aquí la CONTRASEÑA SECRETA de la extensión de Zadarma y presione Enter: ", async (ZADARMA_PASSWORD) => {
  readline.close();
  const pwd = ZADARMA_PASSWORD.trim();
  if (!pwd) {
    console.log("❌ No ingresaste ninguna contraseña.");
    return;
  }

  console.log(`\n⏳ Actualizando Vapi con la contraseña correcta...\n`);

  try {
    const r = await fetch(`https://api.vapi.ai/credential/${CREDENTIAL_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        outboundAuthenticationPlan: {
          authUsername: '559198-100',
          authPassword: pwd
        }
      })
    });

    if (r.ok) {
        console.log("✅ ¡CONTRASEÑA ACTUALIZADA CON ÉXITO EN VAPI!");
        console.log("\n========================================================");
        console.log("IMPORTANTE SOBRE EL ESTADO 'NO REGISTRADO' EN ZADARMA:");
        console.log("Es NORMAL que Zadarma siga diciendo 'Offline' o 'No registrado'.");
        console.log("Vapi no se 'registra' como un teléfono físico, solo se conecta cuando hay llamadas.");
        console.log("Para que entren llamadas, asegúrate de activar en Zadarma:");
        console.log("➡️ 'Desvío y correo de voz' > Siempre > Servidor externo (SIP URI) > +17868226051@sip.vapi.ai");
        console.log("========================================================\n");
        console.log("🤖 ¡Ya puedes probar hacer una llamada de salida desde tu panel!");
    } else {
        const err = await r.text();
        console.log("❌ Error al actualizar Vapi:", err);
    }
  } catch (e) {
    console.log("❌ Error de red:", e.message);
  }
});
