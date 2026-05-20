# MAPA MAESTRO: La Máquina Argenterio (n8n + Vapi)

Tienes 4 flujos principales (Workflows) que hacen que todo el negocio funcione en piloto automático. Aquí tienes el mapa mental de qué hace cada uno y en qué orden ocurren las cosas.

---

## 🚀 FASE 1: La Cacería (Prospección en Frío)
El objetivo de esta fase es que Alex consiga que alguien entre a la web de Argenterio.

### 1. Workflow: Hunter WhatsApp (Alex)
*   **Archivo:** `WHATSAPP_BRAIN_ALEX.json`
*   **Misión:** Escribirle a hoteles y agencias inmobiliarias por WhatsApp para asustarlos sobre el Mundial 2026 y mandarles el link del diagnóstico.
*   **Triggers / Webhooks:** Escucha los mensajes entrantes de WhatsApp a través del webhook de Evolution API.
*   **Lógica Clave:** Tiene el script "Anti-Loop" para no responderse a sí mismo.

---

## ⚡ FASE 2: El Filtro de $9 (Pre-Pago)
El cliente entró a `argenterio.com` y llenó el formulario de diagnóstico.

### 2. Workflow: Auditor V11 (Master E2E)
*   **Archivo:** `workflow_auditor_v11_MASTER.json`
*   **Misión:** Generar un diagnóstico alarmista exprés y asustar al cliente para que pague $9 USD para ver la solución completa.
*   **Pasos que ejecuta n8n:**
    1.  Recibe los datos de la web (Webhook: `argenterio-audit-v1`).
    2.  Groq IA escribe un párrafo técnico de 2 líneas (Teaser).
    3.  Crea un Link de MercadoPago por $15,000 ARS (aprox $9 USD).
    4.  Responde a la web al instante para mostrar el Teaser y activar el botón de PAGO.
    5.  Al mismo tiempo, envía un email "Premium" por Brevo con ese mismo Teaser y link de pago (por si el usuario cierra el navegador).

---

## 📁 FASE 3: La Entrega y Conversión (Post-Pago)
El cliente metió su tarjeta y pagó en MercadoPago o PayPal.

### 3. Workflow: Fulfillment V12 (Conversión)
*   **Archivo:** `workflow_auditor_v12_FULFILLMENT.json`
*   **Misión:** Entregar el reporte por el que pagaron y prepararlo para la llamada de alto valor (High-Ticket).
*   **Pasos que ejecuta n8n:**
    1.  Recibe el aviso de MercadoPago/PayPal de que el pago entró (IPN/Webhook).
    2.  Groq IA genera el **Informe Shield de 4 párrafos** ("Cómo sobrevivir al Mundial 2026").
    3.  Brevo envía un email ultra-profesional con el Informe y el botón para agendar en tu **Cal.com**.
    4.  Telegram te manda una alerta a tu celular avisando "Nuevo Cliente de $9. Prepárate para el cierre".

---

## 🧠 FASE 4: El Cierre de Alto Ticket (El Asistente Técnico)
El cliente agendó en Cal.com y ahora tú lo tienes en un Google Meet / Zoom.

### 4. Workflow: Asistente Técnico Vapi (Stefan)
*   **Plataforma principal:** Vapi (No requiere flujo n8n complejo para la charla, Vapi hace el trabajo duro).
*   **Misión:** Demostrar en vivo cómo un asistente 24/7 atiende llamadas en 30 idiomas.
*   **(Flujo de Respaldo en n8n - Solo WhatsApp):** `WHATSAPP_BRAIN_STEFAN.json` (Este flujo es por si el cliente quiere chatear por texto después de la llamada; usa la misma lógica Anti-Loop que Alex pero con tono técnico).

---

## 🎯 RESUMEN DEL SISTEMA TÁCTICO
1.  **Alex (WhatsApp)** asusta y trae tráfico a la web.
2.  **Argenterio V11 (n8n)** asusta y cobra $9 USD.
3.  **Argenterio V12 (n8n)** entrega el informe y manda al cliente a tu Cal.com.
4.  **Stefan (Vapi)** hace la demostración final en vivo para cerrar el contrato de $1,500 USD (Setup).
