// ═══════════════════════════════════════════════════════════════
// FILTRO V6 - CON DETECCIÓN DE IDIOMA PARA VOCES NATIVAS
// Detecta automáticamente DE/EN/ES/IT y selecciona voz nativa
// ═══════════════════════════════════════════════════════════════

// 1. OBTENER INPUT
let inputData = $input.item.json.original_voice
    || $input.item.json.text
    || $input.item.json.output
    || $input.item.json.response
    || "";

// 2. OBTENER NÚMERO (Tu estructura Evolution)
let rawRemoteJid = "";
try {
    if ($('Webhook (WhatsApp)').item.json.body.data && $('Webhook (WhatsApp)').item.json.body.data.key) {
        rawRemoteJid = $('Webhook (WhatsApp)').item.json.body.data.key.remoteJid;
    }
    else if ($('Webhook (WhatsApp)').item.json.body.key) {
        rawRemoteJid = $('Webhook (WhatsApp)').item.json.body.key.remoteJid;
    }
} catch (e) {
    console.log("⚠️ No se pudo leer RemoteJid");
}

// Variables por defecto
let textoVoz = "";
let accionFinal = "info";
let mensajeTexto = "";
let idiomaDetectado = "es"; // Por defecto español

// 3. PARSEO DE RESPUESTA AI
if (typeof inputData === 'object' && inputData !== null) {
    textoVoz = inputData.respuesta_voz || "";
    accionFinal = inputData.accion_requerida || "info";
} else if (typeof inputData === 'string') {
    let cleanString = inputData.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    try {
        const parsed = JSON.parse(cleanString);
        textoVoz = parsed.respuesta_voz || "";
        accionFinal = parsed.accion_requerida || "info";
    } catch (e) {
        textoVoz = cleanString;
        accionFinal = "info";
    }
}

// 4. DETECCIÓN AUTOMÁTICA DE IDIOMA
function detectLanguage(text) {
    if (!text) return "es";

    // Palabras clave por idioma
    const patterns = {
        de: /\b(der|die|das|ist|sind|haben|können|werden|möchten|Guten|Sehr|Hotels?)\b/i,
        en: /\b(the|is|are|have|can|will|would|Hello|Good|Hotel|Booking)\b/i,
        es: /\b(el|la|los|las|es|son|tiene|puede|quiere|Hola|Buenos|Hotel|Reserva)\b/i,
        it: /\b(il|la|gli|le|è|sono|ha|può|vuole|Ciao|Buona|Hotel|Prenotazione)\b/i
    };

    // Contar coincidencias por idioma
    const scores = {
        de: (text.match(patterns.de) || []).length,
        en: (text.match(patterns.en) || []).length,
        es: (text.match(patterns.es) || []).length,
        it: (text.match(patterns.it) || []).length
    };

    // Retornar el idioma con más coincidencias
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
}

idiomaDetectado = detectLanguage(textoVoz);

// 5. SELECCIÓN DE VOZ NATIVA GOOGLE TTS
const googleVoices = {
    de: {
        languageCode: "de-DE",
        name: "de-DE-Neural2-F", // Voz femenina alemana neural
        ssmlGender: "FEMALE"
    },
    en: {
        languageCode: "en-US",
        name: "en-US-Neural2-F", // Tu voz actual que funciona bien
        ssmlGender: "FEMALE"
    },
    es: {
        languageCode: "es-ES",
        name: "es-ES-Neural2-A", // Voz femenina española neural
        ssmlGender: "FEMALE"
    },
    it: {
        languageCode: "it-IT",
        name: "it-IT-Neural2-A", // Voz femenina italiana neural
        ssmlGender: "FEMALE"
    }
};

const selectedVoice = googleVoices[idiomaDetectado] || googleVoices.es;

// 6. LIMPIEZA PARA TTS
function cleanForTTS(text) {
    if (!text || typeof text !== 'string') return "";
    return text
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}]/gu, "")
        .replace(/(https?:\/\/[^\s]+)/g, "")
        .replace(/["*{}\[\]_`]/g, "")
        .replace(/\s+/g, " ").trim();
}

// 7. GENERAR MENSAJE TEXTO
if (accionFinal === "agendar") {
    mensajeTexto = "🔗 Agendá tu auditoría aquí:\n\nhttps://cal.com/gustavo-a.-dornhofer-nqjqos/auditoria-ia-gratuita-free-ai-audit-kostenloses-ki-audit\n\nElegí día y horario. Duración: 30 min ⏱️";
}
else if (accionFinal === "contacto") {
    mensajeTexto = "📞 Contacto directo:\n\n• WhatsApp: +54 9 11 7371-9972\n• Email: agentes.space@gmail.com\n\n¿En qué más puedo ayudarte?";
}
else if (accionFinal === "derivar") {
    mensajeTexto = "He notificado a un especialista humano sobre tu caso. Te contactarán a la brevedad.";
}

// 8. RETORNO CON CONFIGURACIÓN DE VOZ
return {
    json: {
        clean_voice: cleanForTTS(textoVoz),
        accion: accionFinal.toLowerCase().trim(),
        mensaje_texto: mensajeTexto,
        remote_jid: rawRemoteJid,

        // NUEVOS CAMPOS PARA GOOGLE TTS
        idioma: idiomaDetectado,
        tts_language_code: selectedVoice.languageCode,
        tts_voice_name: selectedVoice.name,
        tts_gender: selectedVoice.ssmlGender
    }
};
