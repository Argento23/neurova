
# 🧠 Lógica para el Nodo "IF" en n8n (Agendar Citas)

## Código Javascript Robustecido (Anti-Errores)

Este código soluciona el problema de que el texto llegue "sucio" (con ````json` o comillas raras) y garantiza que el audio y la acción se separen correctamente.

Copia y pega esto en tu nodo **Code**:

```javascript
// A. OBTENER INPUT (Asegurando que leemos el campo correcto)
// A veces viene como 'original_voice', a veces como 'text' o 'output'
let inputData = $input.item.json.original_voice || $input.item.json.text || $input.item.json.output || "";

// Variables de salida por defecto
let textoFinal = "";
let accionFinal = "info"; 

// B. LÓGICA DE PARSEO ROBUSTA
if (typeof inputData === 'object' && inputData !== null) {
  // CASO 1: Ya es un objeto JSON (n8n lo reconoció automáticamente)
  textoFinal = inputData.respuesta_voz || "Error en respuesta de voz";
  accionFinal = inputData.accion_requerida || "info";

} else if (typeof inputData === 'string') {
  // CASO 2: Es un String. Puede ser JSON o Texto plano.
  
  // Limpieza previa: Quitar bloques de código Markdown (```json ... ```) que la IA suele poner
  let cleanString = inputData.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    // Intentamos convertir el texto a objeto
    const parsed = JSON.parse(cleanString);
    textoFinal = parsed.respuesta_voz || cleanString;
    accionFinal = parsed.accion_requerida || "info";
  } catch (e) {
    // SI FALLA EL PARSEO: Asumimos que es texto plano directo ("Hola Gustavo...")
    textoFinal = cleanString;
    accionFinal = "info"; 
  }
}

// C. LIMPIEZA PARA TTS (Evita que el robot lea símbolos raros)
function cleanForTTS(text) {
  if (!text) return "";
  return text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}]/gu, "") // Emojis
    .replace(/(https?:\/\/[^\s]+)/g, "el enlace") // URLs leídas como texto
    .replace(/["*{}\[\]_]/g, "") // Markdown y símbolos json residuales
    .trim();
}

// D. RETORNO FINAL
return {
  json: {
    clean_voice: cleanForTTS(textoFinal), // Esto va al TTS
    accion: accionFinal.toLowerCase().trim() // Esto va al Switch (debe ser 'agendar')
  }
};
```

---

## 🔌 IMPORTANTE: El Cableado Paralelo

Para que funcione el Audio Y el Link a la vez, revisa tus flechas:

1.  **Nodo Code** --> **Nodo TTS** (Flecha 1, SIEMPRE se ejecuta).
2.  **Nodo Code** --> **Nodo Switch** (Flecha 2, Lógica del link).

Si conectas el TTS *después* del Switch (en la rama False), **se cortará** cuando la rama sea True. Deben salir dos caminos del Code.
