# Configuración de Voces (Vapi + ElevenLabs) y Arquitectura

Es una excelente pregunta. La tecnología detrás de estas voces interactivas en la web **no es Python ni es n8n**. Es una combinación de dos plataformas de élite: **Vapi** (el cerebro que escucha y procesa) y **ElevenLabs** (las cuerdas vocales).

## 1. ¿Cómo cambiar las voces a Hombre? (Template y Austria)

Es sumamente sencillo y no requiere tocar código ni n8n. Las voces se cambian directamente en el panel de **Vapi**.

1.  Entra a tu dashboard de **[Vapi.ai](https://vapi.ai/)** (o la plataforma que uses para el asistente web).
2.  Ve a la sección **"Assistants"** y selecciona el asistente que está en tu Template o en Austria.
3.  Ve a la pestaña **"Voice"**.
4.  Allí verás el proveedor (normalmente es ElevenLabs o PlayHT). 
5.  Puedes seleccionar una voz diferente del menú desplegable. Para voces masculinas de alta calidad (y con tono agresivo de ventas), te recomiendo buscar voces de ElevenLabs como **"Antoni"**, **"Callum"** o **"Marcus"**.
6.  Guarda los cambios y la voz se actualizará instantáneamente en tus páginas web.

## 2. ¿Cómo agregar un asistente de voz a Cilo?

El proceso es el mismo que usamos para crear a Stefan.
1.  En Vapi, creas un **Nuevo Asistente** (New Assistant).
2.  Le configuras el **System Prompt** (ej. "Eres el experto en exportaciones de galletitas Cilo...").
3.  Le asignas una voz masculina de ElevenLabs.
4.  Vapi te dará un fragmento corto de código HTML/JavaScript (un Web Widget).
5.  Ese código lo pegas en el archivo `index.html` de Cilo. Y listo, el botón del micrófono aparecerá en la web de Cilo.

## 3. La Pregunta Crítica: ¿Esto borra la dependencia de n8n?

**No. Cumplen funciones completamente distintas, pero complementarias.**

*   **Vapi (La Cara y la Voz):** Es excelente para hablar *en tiempo real* (videollamadas, botón en la web). Pero **Vapi no sabe enviar emails, no sabe generar links de pago de MercadoPago, y no sabe enviar mensajes por WhatsApp**. 
*   **n8n (El Sistema Nervioso / El Búnker):** Es el que mueve los hilos tácticos. Si quieres que después de la llamada de voz, el cliente reciba un PDF con un reporte y un link de cobro... Vapi no puede hacerlo solo. Necesita avisarle a n8n para que n8n ensamble el mail en Brevo y lo envíe.

### El Ecosistema "Titiritero" (Argenterio)
En la venta "High-Ticket" que vas a hacer, tú vendes **El Sistema Completo**, no solo la voz:

1.  **n8n + Evolution API:** Hacen el trabajo sucio y repetitivo (escribir a cientos de personas por WhatsApp).
2.  **Vapi + 11Labs:** Hacen el trabajo de "cierre y show" (hablar en voz real cuando el lead ya está filtrado).

**Para tu tranquilidad técnica:** Todo lo que has construido es **Microservicios**. Ninguno usa Python complejo que debas mantener en tu máquina. Todo corre en la nube. Tú eres el Arquitecto que une las piezas. 🦍🛡️🚀
