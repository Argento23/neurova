# Mapa de Infraestructura y Expansión Pymes 🌐📈

Aquí tienes el plan para conectar tus VPS y escalar a nuevos rubros.

## 1. Despliegue en tus VPS (Contabo & Databasemart) 💻

Como ya tienes `argenterio.com` y `austria` en tus servidores, vamos a sumar los nuevos módulos allí:

*   **Proceso:**
    1. Subimos las carpetas (`austria-saas`, `cilo-b2b`, `template-saas`) a tu VPS.
    2. Usamos **PM2** para que las webs corran por detrás (ej: `pm2 start npm --name "austria" -- run dev`).
    3. Usamos **Nginx** como Proxy Inverso para que cada dominio apunte al puerto correcto:
        *   `austria.argenterio.com` -> Puerto 3002
        *   `dominio-cilo.com` -> Puerto 3001
        *   `pymes.generarise.space` -> Puerto 3003

## 2. Los Flujos de n8n (¿Dónde están?) 🧩

Los flujos de n8n son la **inteligencia invisible**. No viven en el código de Next.js, sino en tu panel de n8n (que es el puente).
*   **En Next.js:** Dejé los puertos listos (`/api/n8n-bridge`). Son como "enchufes".
*   **En n8n:** Debes crear un workflow que tenga un nodo **Webhook -> POST**. Cuando el chat de la web detecta un interesado, envía los datos a ese webhook de n8n.
*   **Acciones en n8n:** Dentro de n8n, conectas ese webhook con:
    *   **Vapi:** Para disparar la llamada de Stefan.
    *   **Gmail/WhatsApp:** Para enviar los PDFs.
    *   **Replicate:** Para generar imágenes si es necesario.

## 3. Activación Total: Voz, Imagen, Docs y Video 🎬📞

| Tipo | Herramienta | Cómo se activa |
| :--- | :--- | :--- |
| **Voz** | **Vapi** | n8n recibe el lead -> dispara la API de Vapi -> Stefan llama. |
| **Imagen** | **Replicate** | El bot de n8n recibe un pedido -> llama a FLUX (Replicate) -> envía el link. |
| **Documentos** | **PDFMonkey** | n8n junta los datos del cliente -> rellena un HTML -> devuelve un PDF. |
| **Video** | **Shotstack / n8n** | n8n toma fotos del hotel/producto -> las une en un video de 5seg -> envía link. |

## 4. Expansión a otras Pymes (Agente Universal) 🎯

Tu Plantilla Universal (`template-saas`) es camaleónica. Aquí cómo adaptarla:

*   **E-commerce:**
    *   *System Prompt:* "Eres un experto en ventas online".
    *   *Flujo:* Integración de n8n con Shopify o WooCommerce para consultar stock.
*   **Contadores / Legales:**
    *   *System Prompt:* "Eres un asistente impositivo experto".
    *   *Flujo:* n8n recibe documentos (PDFs), los procesa con IA (OCR) y resume los impuestos a pagar.
*   **Inmobiliarias:**
    *   *System Prompt:* "Eres asesor inmobiliario".
    *   *Flujo:* n8n envía un video-tour y el contrato PDF tras calificar el presupuesto.

**¿Querés que preparemos el primer archivo JSON de n8n para que solo tengas que importarlo y ya Stefan pueda llamar?** 🍪✨
