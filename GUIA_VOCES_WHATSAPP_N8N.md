# Ajuste de Voces en WhatsApp (Text-to-Speech de n8n)

¡Aclarado! Te refieres a las **Notas de Voz de WhatsApp** que envían los bots (cuando le mandas un audio a Alex o Stefan por WhatsApp, ellos te responden con un audio de vuelta leyendo el texto).

## 1. ¿Cuál es el mecanismo y de qué depende? (No es Python)

El mecanismo es **Google Cloud Text-to-Speech (TTS)**.
*   No es Python y **no borra la dependencia con n8n**. Al contrario, es un "Nodo" que vive **adentro** de tu flujo de n8n.
*   **Cómo funciona:** Cuando el usuario manda un mensaje a WhatsApp, la IA de Groq (en n8n) genera el texto de respuesta. Si es necesario, n8n le manda ese texto a Google TTS. Google lo convierte en un archivo MP3 en 1 segundo, y n8n usa Evolution API para enviarlo a WhatsApp como una nota de voz.

## 2. ¿Cómo cambiar las voces a HOMBRE (Alex y Stefan)?

Actualmente, el código en n8n estipula voces femeninas (`Neural2-A`, `Neural2-F`). Vamos a cambiarlas a voces masculinas Premium de Google (`Neural2-B`, `Neural2-D`).

**Paso a paso en tu n8n:**
1. Abre el workflow de **Alex** (`WHATSAPP_BRAIN_ALEX.json`) o **Stefan**.
2. Busca el nodo de código (Code Node) que suele llamarse **"Filtro de Idioma y Voz"** o "Preparar Datos TTS".
3. Al inicio del código, verás un bloque llamado `const googleVoices`.
4. Borra ese bloque y **reemplázalo por este (Voces de Hombre):**

```javascript
const googleVoices = {
    es: { languageCode: 'es-ES', name: 'es-ES-Neural2-B', ssmlGender: 'MALE' },
    en: { languageCode: 'en-US', name: 'en-US-Neural2-D', ssmlGender: 'MALE' },
    de: { languageCode: 'de-DE', name: 'de-DE-Neural2-B', ssmlGender: 'MALE' }
};
```
5. Guarda y cierra el nodo. ¡Listo! Ahora Alex y Stefan mandarán audios con voz de hombre profesional.

## 3. ¿Cómo agregar esta voz a CILO?

El bot de Cilo actualmente solo responde con texto porque no tiene los **Nodos de Audio**. Para agregarlo, es literalmente "copiar y pegar" dentro de n8n:

1.  Abre el workflow de Alex (que ya tiene voz).
2.  Copia los últimos 3 nodos del flujo:
    *   El **"Filtro de Idioma y Voz"** (Code).
    *   El **"Google Cloud TTS"** (Convierte el texto en audio).
    *   El **"Evolution - Enviar Audio"** (Manda el WhatsApp).
3.  Ve al workflow de **Cilo** y pega esos 3 nodos al final de la IA (Groq).
4.  Asegúrate de conectar la salida de IA a la entrada del Nodo Code.

**En resumen:** Todo pasa dentro de n8n. Vapi es para llamadas en vivo por el navegador/teléfono. Google TTS (en n8n) es para mandar "Audios de WhatsApp" pregrabados. ¡Cámbialo a `MALE` con el código de arriba y verás la diferencia al instante! 🦍🛡️🚀
