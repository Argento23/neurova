// ═══════════════════════════════════════════════════════════════
// FILTRO V6 - MULTILINGÜE SIMPLIFICADO (Sin Regex Complejas)
// Usa .includes() en lugar de regex para evitar errores de parseo
// ═══════════════════════════════════════════════════════════════

// 1. OBTENER INPUT
let inputData = $input.item.json.original_voice
    || $input.item.json.text
    || $input.item.json.output
    || $input.item.json.response
    || "";

// 2. OBTENER TU NÚMERO
let rawRemoteJid = "";
try {
    if ($('Webhook').item.json.body.data && $('Webhook').item.json.body.data.key) {
        rawRemoteJid = $('Webhook').item.json.body.data.key.remoteJid;
    }
    else if ($('Webhook').item.json.body.key) {
        rawRemoteJid = $('Webhook').item.json.body.key.remoteJid;
    }
} catch (e) {
    console.log("⚠️ No se pudo leer el RemoteJid");
}

// Variables por defecto
let textoVoz = "";
let accionFinal = "info";
let mensajeTexto = "";
let idiomaDetectado = "es";

// 3. PARSEO DE RESPUESTA AI
if (typeof inputData === 'object' && inputData !== null) {
    textoVoz = inputData.respuesta_voz || "";
    accionFinal = inputData.accion_requerida || "info";
} else if (typeof inputData === 'string') {
    let cleanString = inputData.replace(/```json/g, "").replace(/```/g, "").trim();
    try {
        const parsed = JSON.parse(cleanString);
        textoVoz = parsed.respuesta_voz || "";
        accionFinal = parsed.accion_requerida || "info";
    } catch (e) {
        textoVoz = cleanString;
        accionFinal = "info";
    }
}

// 4. DETECCIÓN SIMPLE DE IDIOMA (Sin regex complejas)
function detectLanguage(text) {
    if (!text) return "es";

    const textLower = text.toLowerCase();

    // Palabras únicas por idioma
    const deWords = ["der", "die", "das", "haben", "guten", "konnen", "werden", "hotels", "preis"];
    const enWords = ["the", "have", "hello", "good", "hotel", "booking", "price", "would"];
    const esWords = ["los", "las", "tiene", "puede", "hola", "buenos", "reserva", "precio"];
    const itWords = ["gli", "vuole", "ciao", "buona", "prenotazione", "prezzo"];

    let scores = { de: 0, en: 0, es: 0, it: 0 };

    // Contar coincidencias
    deWords.forEach(word => { if (textLower.includes(word)) scores.de++; });
    enWords.forEach(word => { if (textLower.includes(word)) scores.en++; });
    esWords.forEach(word => { if (textLower.includes(word)) scores.es++; });
    itWords.forEach(word => { if (textLower.includes(word)) scores.it++; });

    // Retornar el idioma con más puntos
    let maxLang = "es";
    let maxScore = scores.es;

    if (scores.de > maxScore) { maxLang = "de"; maxScore = scores.de; }
    if (scores.en > maxScore) { maxLang = "en"; maxScore = scores.en; }
    if (scores.it > maxScore) { maxLang = "it"; }

    return maxLang;
}

idiomaDetectado = detectLanguage(textoVoz);

// 5. SELECCIÓN DE VOZ
const googleVoices = {
    de: { languageCode: "de-DE", name: "de-DE-Neural2-F", ssmlGender: "FEMALE" },
    en: { languageCode: "en-US", name: "en-US-Neural2-F", ssmlGender: "FEMALE" },
    es: { languageCode: "es-US", name: "es-US-Neural2-B", ssmlGender: "MALE" },
    it: { languageCode: "it-IT", name: "it-IT-Neural2-A", ssmlGender: "FEMALE" }
};

const selectedVoice = googleVoices[idiomaDetectado] || googleVoices.es;

// 6. LIMPIEZA PARA TTS
function cleanForTTS(text) {
    if (!text || typeof text !== 'string') return "";
    return text
        .replace(/[^\w\s.,!?áéíóúÁÉÍÓÚñÑüÜ]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// 7. GENERAR MENSAJE TEXTO
if (accionFinal === "agendar") {
    mensajeTexto = "🔗 Agenda tu auditoria aqui:\n\nhttps://cal.com/gustavo-a.-dornhofer-nqjqos/auditoria-ia-gratuita-free-ai-audit-kostenloses-ki-audit\n\nElegi dia y horario. Duracion: 30 min";
}
else if (accionFinal === "contacto") {
    mensajeTexto = "Contacto directo:\n\n• WhatsApp: +54 9 11 7371-9972\n• Email: agentes.space@gmail.com\n\nEn que mas puedo ayudarte?";
}
else if (accionFinal === "derivar") {
    mensajeTexto = "He notificado a un especialista humano sobre tu caso. Te contactaran a la brevedad.";
}

// 8. RETORNO
return {
    json: {
        clean_voice: cleanForTTS(textoVoz),
        accion: accionFinal.toLowerCase().trim(),
        mensaje_texto: mensajeTexto,
        remote_jid: rawRemoteJid,
        idioma: idiomaDetectado,
        tts_language_code: selectedVoice.languageCode,
        tts_voice_name: selectedVoice.name,
        tts_gender: selectedVoice.ssmlGender
    }
};
