# 🧠 KNOWLEDGE BASE: DIRECTOR DE AGENCIA DE AUTOMATIZACIÓN IA

Este documento resume los conocimientos estratégicos, técnicos y comerciales imprescindibles para dirigir y vender servicios de Automatización con IA (Agencia GenerArise / GenerArise).

---

## 1. 🏗️ INFRAESTRUCTURA & ARQUITECTURA TÉCNICA
*Lo que hay que saber para entender qué vendemos.*

### A. El "Stack" Tecnológico (¿Con qué construimos?)
No vendemos "magia", vendemos integración de herramientas.
1.  **Cerebro (Lógica):** `n8n` (Auto-hospedado). Es el orquestador. Conecta todo con todo.
    *   *Ventaja:* Sin límites de ejecuciones, privacidad total, costos fijos bajos.
2.  **Inteligencia (Modelos LLM):**
    *   **OpenAI (GPT-4o):** El "estándar de oro" para razonamiento complejo y redacción fina.
    *   **Groq (Llama 3 / Mixtral):** Velocidad extrema (casi instantáneo) para bots de chat en tiempo real.
    *   **Gemini 1.5 Pro:** Ventana de contexto enorme, ideal para analizar documentos largos (PDFs, Bases de Datos).
3.  **Voz & Audio:**
    *   **ElevenLabs:** Clonación de voz hiper-realista (Texto a Voz).
    *   **Deepgram/Whisper:** Entender lo que dice el usuario (Voz a Texto).
4.  **Canales (Donde vive el bot):**
    *   **WhatsApp:** Vía `Evolution API` (no oficial, flexible) o `Meta Cloud API` (oficial, seguro).
    *   **Web:** Vía Chatbots incrustados (HTML/JS).
    *   **Telefonia:** Vía `Vapi` o `Retell AI` (Llamadas de voz reales).

---

## 2. 🤝 PROVEEDORES & COSTOS (Unit Economics)
*Para poner precios correctos y saber el margen.*

| Recurso | Proveedor | Costo Aprox. | Notas |
| :--- | :--- | :--- | :--- |
| **Servidor (VPS)** | Hetzner / Contabo | $6 - $15 / mes | Soporta n8n + Evolution API + Bases de Datos. |
| **WhatsApp** | API Oficial (Meta) | ~$0.04 / conv. | Primeras 1000/mes gratis. Pago por conversación iniciada. |
| **WhatsApp** | Evolution API (QR) | $0 (Usa tu plan) | Riesgo de baneo si se abusa (spam). Ideal volúmenes bajos. |
| **IA (Tokens)** | OpenAI / Groq | Variable | Un chatbot simple gasta ~$0.01 por conversación completa. insignificante si se cobra bien. |
| **Voz** | ElevenLabs | ~$0.30 / min | Caro. Usar solo cuando la calidad de voz es crítica. |

**Margen Objetivo:** Los servicios deben tener un margen >80%. El costo de software es bajo; cobramos por la **Solución y el Mantenimiento**.

---

## 3. 💼 MODELO DE NEGOCIO & PRODUCTOS
*¿Qué vendemos exactamente?*

### A. Implementación (Setup Fee) - Pago Único
*   **Qué es:** Construir el "tubo". Configurar n8n, conectar APIs, diseñar el flujo.
*   **Precio:** $500 - $3,000 USD (según complejidad).
*   **Valor:** El cliente recibe un sistema llave en mano.

### B. Mantenimiento (Retainer) - Pago Mensual
*   **Qué es:** "Alquiler del cerebro". Hosting, monitoreo de errores, pequeños ajustes de prompt.
*   **Precio:** $200 - $1,000 USD / mes.
*   **Valor:** Tranquilidad. Si algo falla (y las APIs fallan), nosotros lo arreglamos.

### C. Productos Estrella (Low Hanging Fruit)
1.  **"El Reactivador":** Bot que escanea leads viejos (Excel) y les escribe por WhatsApp para "despertarlos".
2.  **"La Secretaria 24/7":** Bot de WhatsApp o Instagram que responde preguntas frecuentes y agenda citas (Calendly) fuera de horario laboral.
3.  **"El Cualificador":** Bot de voz (llamadas) que llama a leads nuevos en <5 min para ver si califican antes de pasarlo a un humano.

---

## 4. 🔮 EL FUTURO INMEDIATO (Hacia donde vamos)
*Para vender visión a largo plazo.*

1.  **Agentes Multi-Modales:** Ya no es solo texto. El bot "ve" (le mandas foto de una pieza rota y te da el repuesto) y "escucha" en tiempo real.
2.  **Agentes Autónomos (Agentic Workflows):** Dejar de hacer "If/Else" (flujos rígidos) y pasar a agentes que "deciden" los pasos (ej: "Investiga a este lead en LinkedIn, si es CEO mándale un mail personalizado, si es técnico mándale specs técnicas").
3.  **Human-in-the-Loop:** La IA hace el 90%, pero sabe cuándo callarse y pasarle el control a un humano si la venta se pone difícil.

---

## 5. ⚠️ ALIANZAS ESTRATÉGICAS
*No hacerlo solo.*

*   **Agencias de Marketing Tradicional:** Ellos traen los leads (Ads), nosotros los convertimos (IA). Es la alianza perfecta.
*   **CRMs Locales (Inmobiliarios/Dentales):** Integrarnos nativamente con el software que ya usan (ej: Tokko Broker, Clinix).

---

## 📝 LISTA DE CHEQUEO PARA VENDER
Antes de una reunión, saber responder esto del cliente:
1.  **¿Dónde pierden tiempo hoy?** (Respuesta manual repetitiva).
2.  **¿Dónde pierden dinero hoy?** (Leads que se enfrían por no contestar en 5 min).
3.  **¿Tienen los datos ordenados?** (Si usan papel, primero hay que digitalizarlos).
