/**
 * SETUP ALEX GLOBAL — Vapi API Configuration Script
 * 
 * Este script:
 * 1. Lista los números de teléfono activos en Vapi
 * 2. Intenta comprar un número español directamente en Vapi
 * 3. Actualiza el prompt de Alex con el Sales Engine v2
 * 4. Ejecuta una llamada de prueba
 */

const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(r => readline.question(q, r));

const VAPI_KEY = '563af1ef-d671-4cf8-ae6d-d9da58719361';
const ALEX_ASSISTANT_ID = 'd446be03-dfb6-4de6-b83b-9b904af74829';
const API = 'https://api.vapi.ai';
const headers = { 'Authorization': `Bearer ${VAPI_KEY}`, 'Content-Type': 'application/json' };

async function vapiGet(path) {
  const r = await fetch(`${API}${path}`, { headers });
  return r.json();
}
async function vapiPost(path, body) {
  const r = await fetch(`${API}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  return { ok: r.ok, status: r.status, data: await r.json() };
}
async function vapiPatch(path, body) {
  const r = await fetch(`${API}${path}`, { method: 'PATCH', headers, body: JSON.stringify(body) });
  return { ok: r.ok, status: r.status, data: await r.json() };
}

// ─── ALEX PROMPT V2 ─────────────────────────────────────────
const ALEX_PROMPT_V2 = `# ALEX — GENERARISE GLOBAL SALES ENGINE v2.0

## IDENTITY
You are Alex, Senior Sales Strategist at GenerArise, an elite AI automation agency. You make outbound sales calls to qualified business leads. You are confident, direct, warm, and value-driven. You speak like a seasoned consultant — never a telemarketer.

## CRITICAL RULES
1. DETECT LANGUAGE from the lead's first word. Respond ONLY in that language.
2. MAXIMUM 2 sentences per turn. Be ruthlessly concise.
3. NEVER read URLs, links, or email addresses aloud. NEVER.
4. NEVER repeat your introduction. If you already greeted, move forward.
5. ALWAYS end your turn with a question to keep control.
6. If they say "not interested" twice, thank them warmly and end the call.

## CONTEXT VARIABLES
- {{client_name}} — Lead's name
- {{company}} — Company name
- {{industry}} — Industry
- {{pain}} — Known pain point
- {{budget}} — Budget range
- {{context}} — Additional context

## SALES SCRIPT

### Phase 1: HOOK (15 seconds)
With context: "Hi {{client_name}}, this is Alex from GenerArise. We analyzed {{industry}} businesses and found companies like {{company}} lose up to 30% of revenue from unattended inquiries. Can I take 90 seconds?"
Cold: "Hi {{client_name}}, Alex from GenerArise. We help {{industry}} businesses recover lost revenue with AI. Quick question: do you handle client inquiries 24/7?"

Adapt to detected language (ES/DE/PT/FR/IT).

### Phase 2: QUALIFY (2 Questions)
Q1: "How many client messages per week does your team miss or answer late?"
Q2: "If I could solve that with an AI employee working 24/7 in 30 languages, would you invest $500-2000?"

### Phase 3: DELIVER
"Perfect. I just sent you via WhatsApp a 4-step diagnostic. Our AI analyzes your business and shows how much revenue you're leaving on the table. Takes 2 minutes."

### Phase 4: CLOSE
"Can you open that WhatsApp now? We take 5 clients per month in your region — want to secure your spot?"
If not ready: "When works tomorrow for a 15-min demo?"

## OBJECTIONS
"How much?" → "Setup $1K-3K, monthly $250-500. But first check that WhatsApp diagnostic."
"Send email" → "Done better — sent AI diagnostic via WhatsApp. Can you check it?"
"Busy" → "Perfect. Best callback time today or tomorrow?"
"Not interested" (2nd time) → "No problem. Have a great day."

## VOICE RULES
- Confident, warm, professional. Never robotic.
- Pronounce "GenerArise" as "Jenner-a-rise".
- Max 2 sentences per turn. Always end with question.
- Max call target: 3-5 minutes.`;

async function main() {
  console.clear();
  console.log('\n' + '='.repeat(60));
  console.log('  🌍 ALEX GLOBAL SALES ENGINE — SETUP AUTOMÁTICO');
  console.log('='.repeat(60) + '\n');

  // ═══ STEP 1: List phone numbers ═══
  console.log('📱 PASO 1: Verificando números de teléfono en Vapi...\n');
  try {
    const phones = await vapiGet('/phone-number');
    if (Array.isArray(phones) && phones.length > 0) {
      phones.forEach(p => {
        const provider = p.provider || 'unknown';
        const num = p.number || p.sipUri || 'N/A';
        const name = p.name || '';
        console.log(`  ✅ ${num} (${provider}) ${name} — ID: ${p.id}`);
      });
      console.log(`\n  Total: ${phones.length} número(s) registrado(s)\n`);
    } else {
      console.log('  ⚠️ No hay números registrados en Vapi\n');
    }
  } catch(e) {
    console.log('  ❌ Error listando números:', e.message, '\n');
  }

  // ═══ STEP 2: Try buying Spanish number ═══
  console.log('🇪🇸 PASO 2: Intentando comprar número español en Vapi...\n');
  try {
    const buyResult = await vapiPost('/phone-number', {
      provider: 'vapi',
      numberDesiredAreaCode: '34'
    });
    if (buyResult.ok) {
      console.log(`  ✅ ¡NÚMERO ESPAÑOL COMPRADO! → ${buyResult.data.number}`);
      console.log(`  📋 Phone ID: ${buyResult.data.id}`);
      console.log(`  ⚡ Guardá este ID en Configuración > "Phone Number ID (Europa)"\n`);
    } else {
      console.log(`  ⚠️ Vapi no permite comprar números españoles directamente (${buyResult.status})`);
      console.log(`  📌 Alternativas:`);
      console.log(`     1. Usa el número USA para TODA región (funciona perfecto para ventas)`);
      console.log(`     2. Regístrate en Vonage.com (gratis) para un número europeo`);
      console.log(`     3. El número de Zadarma sigue disponible como backup SIP\n`);
      if (buyResult.data?.message) console.log(`  Detalle: ${buyResult.data.message}\n`);
    }
  } catch(e) {
    console.log('  ❌ Error comprando número:', e.message, '\n');
  }

  // ═══ STEP 3: Update Alex prompt ═══
  console.log('🤖 PASO 3: Actualizando el prompt de Alex a v2 (Sales Engine)...\n');
  try {
    const updateResult = await vapiPatch(`/assistant/${ALEX_ASSISTANT_ID}`, {
      model: {
        messages: [{ role: 'system', content: ALEX_PROMPT_V2 }]
      }
    });
    if (updateResult.ok) {
      console.log('  ✅ ¡Prompt de Alex actualizado con éxito!');
      console.log('  🧠 Alex ahora es un closer de élite multilingüe con script de 4 fases\n');
    } else {
      console.log('  ⚠️ No se pudo actualizar automáticamente:', updateResult.data?.message || updateResult.status);
      console.log('  📌 Actualizá manualmente en Vapi Dashboard > Assistant > Alex > System Prompt');
      console.log('  📄 Copiá el contenido de ALEX_SALES_PROMPT_V2.md\n');
    }
  } catch(e) {
    console.log('  ❌ Error actualizando prompt:', e.message, '\n');
  }

  // ═══ STEP 4: Test call ═══
  const testNum = await ask('📞 PASO 4: ¿Querés hacer una llamada de prueba? Ingresá tu número (o Enter para saltar): ');
  if (testNum.trim()) {
    const phoneId = '2e6ccb93-762e-4c58-ac69-48708b6dfc19';
    console.log(`\n  ⏳ Llamando a ${testNum.trim()}...`);
    try {
      const callResult = await vapiPost('/call', {
        assistantId: ALEX_ASSISTANT_ID,
        phoneNumberId: phoneId,
        customer: { number: testNum.trim() },
        assistantOverrides: {
          variableValues: {
            client_name: 'Gustavo',
            company: 'GenerArise',
            industry: 'AI Agency',
            region: 'americas',
            pain: 'Testing the system',
            budget: '$1K-3K',
            context: 'This is a test call. Be brief and say hello, confirm the system works, and end the call.'
          }
        }
      });
      if (callResult.ok) {
        console.log('  ✅ ¡Llamada iniciada! Tu teléfono debería sonar en 5 segundos.');
        console.log(`  📋 Call ID: ${callResult.data.id}\n`);
      } else {
        console.log('  ❌ Error:', callResult.data?.message || 'Fallo en la API');
        if (JSON.stringify(callResult.data).includes('international')) {
          console.log('  💡 Necesitás cargar crédito en Vapi para llamadas internacionales.');
          console.log('  👉 Ve a dashboard.vapi.ai > Billing > Add Credits ($10 mínimo)\n');
        }
      }
    } catch(e) {
      console.log('  ❌ Error de red:', e.message, '\n');
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('  🏁 SETUP COMPLETADO');
  console.log('='.repeat(60));
  console.log('\n  Próximos pasos:');
  console.log('  1. Ejecutá sales_engine_schema.sql en tu Supabase SQL Editor');
  console.log('  2. Subí el panel actualizado al VPS');
  console.log('  3. Cargá crédito en Vapi si no lo hiciste ($10+ USD)');
  console.log('  4. ¡Empezá a cargar leads y a vender! 🚀\n');
  readline.close();
}

main().catch(e => { console.error('Error fatal:', e); readline.close(); });
