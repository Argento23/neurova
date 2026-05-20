# Guía del Ecosistema Agente Universal 🌍🚀

Esta guía detalla cómo se activan los flujos, cuánto cuestan y a quién podés venderles estas soluciones.

## 1. Los 3 Flujos Principales 🔄

### A. El Flujo de Captura (Web Chat)
1. **Interacción:** El usuario entra a la web y habla con el chat (Elena, Stefan, etc.).
2. **Inteligencia:** Next.js usa **Groq** para procesar la respuesta en <500ms.
3. **Bridge:** Al terminar la charla, la web envía un "paquete de datos" a tu **n8n**.
4. **Acción:** n8n guarda el lead en un Excel y te manda un WhatsApp: *"Gustavo, hay un interesado"*.

### B. El Flujo de Alarma (Voz Outbound / Vapi)
1. **Activador:** Un nuevo lead llega a n8n (desde la web o una base de datos).
2. **Llamada:** n8n le dice a **Vapi**: *"Llama a este número y cargá el perfil de Stefan"*.
3. **Conversación:** Stefan llama al hotel, califica al cliente y pide el email.
4. **Cierre:** Vapi envía el resumen de la llamada a n8n para que envíes el PDF de auditoría.

### C. El Flujo de Documentación (PDF Automático)
1. **Activador:** El bot de chat o de voz marca al cliente como "Interesado".
2. **Generación:** n8n toma los datos y usa una herramienta (como PDFMonkey) para crear la **Auditoría de IA**.
3. **Entrega:** n8n envía el PDF por WhatsApp o Email al cliente automáticamente.

---

## 2. Vapi: Activación y Costos 💸

*   **¿Dónde se activa?**
    *   **Pruebas:** Desde el botón "Test Call" en el dashboard de Vapi.
    *   **Producción:** Se activa solo mediante un Webhook desde n8n. No necesitás tocar nada manual una vez configurado.
*   **¿Cómo se paga?**
    *   Vapi funciona con **créditos prepagos**. Cargás $10 o $20 dólares con tarjeta.
    *   **Costo por minuto:** Aproximadamente **$0.10 a $0.15 USD** (incluye la inteligencia, la transcripción y la voz premium de ElevenLabs).
    *   Si la llamada dura 2 minutos, te cuesta unos $0.25 USD. ¡Es baratísimo comparado con un empleado humano!

---

## 3. ¿A quién va dirigido? (Target Agente Universal) 🎯

| Nicho | Problema que resuelve | El Gancho (Hook) |
| :--- | :--- | :--- |
| **Hotelería (Austria)** | Recepción saturada, llamadas nocturnas. | "Nunca pierdas una reserva por no atender el teléfono". |
| **Salud/Estética (Elena)** | Olvidos de turnos, consultas repetitivas. | "Tu agenda llena sin que tu secretaria mueva un dedo". |
| **Inmobiliaria** | Calificación de leads curiosos (no compradores). | "Filtramos a los curiosos y te agendamos solo a los que tienen la plata". |
| **Gastronomía** | Reservas perdidas en hora pico. | "Tu IA reserva mesas mientras tu staff atiende a los comensales". |

---

## 4. Resumen del Modelo de Negocio 💼
1. En **Next.js** vive la "vidriera" (la web linda).
2. En **n8n** vive el "empleado" (el que mueve los archivos y avisa).
3. En **Vapi** vive el "vendedor" (el que habla).

**Tú cobras por el Setup (la creación) y un abono mensual por el mantenimiento de esta infraestructura.** 🍪✨
