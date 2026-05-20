/**
 * CAMBIAR ZADARMA: Miami → España
 * 
 * Este script actualiza el número en Vapi una vez que
 * hayas comprado el número español en Zadarma.
 */
const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(r => readline.question(q, r));

const VAPI_KEY = '563af1ef-d671-4cf8-ae6d-d9da58719361';
const ZADARMA_PHONE_ID = 'b67023a0-d26d-44fe-ba6b-394437b41698'; // BYO phone number
const ZADARMA_CREDENTIAL_ID = '585823c4-8ba4-43d2-8af9-d0c168b43271'; // SIP trunk credential
const OLD_NUMBER = '+17868226051';

async function main() {
  console.clear();
  console.log('\n' + '='.repeat(60));
  console.log('  🇪🇸 CAMBIAR ZADARMA: Miami → España');
  console.log('='.repeat(60));
  
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  PASO PREVIO (Hacelo vos en zadarma.com):               ║
║                                                          ║
║  1. Entrá a zadarma.com → "Números Virtuales"            ║
║  2. Si el de Miami (+17868226051) te cobra, cancelalo    ║
║  3. Comprá un número de España:                          ║
║     → País: Spain → Ciudad: Barcelona o Madrid           ║
║     → Te van a dar un +34 9X XXX XXXX                    ║
║  4. Anotá el número nuevo                                ║
║  5. En "Mi Centralita" → "Extensiones" →                 ║
║     copiá la CONTRASEÑA de tu extensión                  ║
║     (es la misma extensión que ya tenías)                ║
╚══════════════════════════════════════════════════════════╝
`);

  const newNumber = await ask('📞 Pegá tu nuevo número español de Zadarma (ej: +34932001234): ');
  const cleanNumber = newNumber.trim().replace(/[^\d+]/g, '');
  
  if (!cleanNumber || !cleanNumber.startsWith('+34')) {
    console.log('❌ El número debe empezar con +34 (España)');
    readline.close();
    return;
  }

  console.log(`\n✅ Número español: ${cleanNumber}`);
  
  const needPwdUpdate = await ask('\n¿Cambió la contraseña de tu extensión? (s/n): ');
  let newPassword = null;
  let newExtension = null;
  
  if (needPwdUpdate.trim().toLowerCase() === 's') {
    newExtension = await ask('Extensión (ej: 559198-100): ');
    newPassword = await ask('Contraseña de la extensión: ');
  }

  console.log('\n⏳ Actualizando en Vapi...\n');

  // 1. Update the phone number
  try {
    console.log('  1/3 Actualizando número de teléfono...');
    const r1 = await fetch(`https://api.vapi.ai/phone-number/${ZADARMA_PHONE_ID}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${VAPI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        number: cleanNumber,
        name: `Zadarma España ${cleanNumber}`,
        numberE164CheckEnabled: false
      })
    });
    const d1 = await r1.json();
    if (r1.ok) {
      console.log(`  ✅ Número actualizado: ${OLD_NUMBER} → ${cleanNumber}`);
    } else {
      console.log('  ⚠️ No se pudo actualizar número:', d1.message || JSON.stringify(d1));
      console.log('  Intentando crear uno nuevo...');
      
      // Try creating a new phone number instead
      const r1b = await fetch('https://api.vapi.ai/phone-number', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${VAPI_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'byo-phone-number',
          name: `Zadarma España ${cleanNumber}`,
          number: cleanNumber,
          numberE164CheckEnabled: false,
          credentialId: ZADARMA_CREDENTIAL_ID
        })
      });
      const d1b = await r1b.json();
      if (r1b.ok) {
        console.log(`  ✅ Número español CREADO: ${cleanNumber}`);
        console.log(`  📋 Nuevo Phone ID: ${d1b.id}`);
        console.log(`  ⚡ IMPORTANTE: Usá este ID en el panel → Configuración → Phone ID Europa 🇪🇸`);
      } else {
        console.log('  ❌ Error creando número:', d1b.message || JSON.stringify(d1b));
      }
    }
  } catch(e) {
    console.log('  ❌ Error de red:', e.message);
  }

  // 2. Update SIP credential password if needed
  if (newPassword && newExtension) {
    try {
      console.log('\n  2/3 Actualizando credenciales SIP...');
      const r2 = await fetch(`https://api.vapi.ai/credential/${ZADARMA_CREDENTIAL_ID}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${VAPI_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outboundAuthenticationPlan: {
            authUsername: newExtension.trim(),
            authPassword: newPassword.trim()
          }
        })
      });
      if (r2.ok) {
        console.log('  ✅ Credenciales SIP actualizadas');
      } else {
        const d2 = await r2.json();
        console.log('  ⚠️ Error:', d2.message || JSON.stringify(d2));
      }
    } catch(e) {
      console.log('  ❌ Error:', e.message);
    }
  } else {
    console.log('\n  2/3 Credenciales SIP sin cambios (misma extensión)');
  }

  // 3. Configure forwarding reminder
  console.log(`
  3/3 CONFIGURACIÓN FINAL EN ZADARMA:

  ╔══════════════════════════════════════════════════════════╗
  ║  Para que las llamadas ENTRANTES lleguen a Alex:        ║
  ║                                                          ║
  ║  1. zadarma.com → Mi Centralita → Extensiones          ║
  ║  2. Tu extensión → "Desvío y correo de voz"            ║
  ║  3. Marcar "Siempre"                                    ║
  ║  4. Desvío a: "Servidor externo (SIP URI)"             ║
  ║  5. Pegar: ${cleanNumber}@sip.vapi.ai                  ║
  ║  6. Guardar                                             ║
  ╚══════════════════════════════════════════════════════════╝
  `);

  // List final state
  console.log('📱 Estado final de números en Vapi:');
  try {
    const phones = await fetch('https://api.vapi.ai/phone-number', { headers: { 'Authorization': `Bearer ${VAPI_KEY}` } }).then(r => r.json());
    phones.forEach(p => {
      console.log(`  ${p.number || p.sipUri} (${p.provider}) — ID: ${p.id}`);
    });
  } catch(e) {}

  console.log('\n' + '='.repeat(60));
  console.log('  🏁 PROCESO COMPLETADO');
  console.log('='.repeat(60));
  console.log('\n  En el panel → ⚙️ Configuración:');
  console.log('  • Phone ID Américas 🇺🇸: 2e6ccb93-762e-4c58-ac69-48708b6dfc19');
  console.log('  • Phone ID Europa 🇪🇸: [el nuevo ID que apareció arriba]\n');
  
  readline.close();
}

main().catch(e => { console.error(e); readline.close(); });
