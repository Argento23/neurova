# Estructura del Formulario Tally para Inteligencia Artificial (AI Lead Auditor)

Para que el flujo de n8n que acabamos de crear funcione a la perfección, necesitas crear un formulario en **Tally.so** con campos específicos. El objetivo es que las preguntas sean conversacionales pero que capturen los "datos duros" que el LLM necesita para calcular el ROI y proponer una solución.

## 1. Configuración de Preguntas en Tally

Crea un nuevo formulario en Tally y añade los siguientes bloques. **Importante:** Mantén los "Labels" (Títulos de las preguntas) exactamente como se sugieren, ya que n8n buscará esas palabras clave.

### Bloque 1: Identificación (Preguntas Cortas)
*   **Texto Corto:** Nombre de la Empresa
*   **Email:** Tu mejor correo electrónico
*   **Número de Teléfono:** Teléfono/WhatsApp de contacto

### Bloque 2: Contexto Operativo (Selección y Texto Corto)
*   **Selección Múltiple (Radio Buttons):** Sector de tu negocio
    *   *Opciones:* Hotel Boutique, Clínica / Consultorio, Real Estate, E-commerce, Agencia, Otro.
*   **Texto Corto:** ¿Cuál es tu volumen aproximado de mensajes de clientes por semana?
    *   *Ejemplo de subtítulo Tally:* (Ej: 50, 500, más de 1000...)

### Bloque 3: El Dolor (Texto Largo - CRUCIAL)
*   **Texto Largo:** Si tuvieras una varita mágica, ¿cuál es el problema principal de atención al cliente o ventas que solucionarías hoy mismo?
    *   *Ejemplo de subtítulo Tally:* (Ej: Tardamos horas en responder WhatsApps, perdemos reservas de madrugada, los leads no se califican solos...)

---

## 2. Configuración del Webhook (Conectar a n8n)

Una vez que tengas el formulario listo y publicado en Tally:

1. Ve a tu panel de **n8n** y abre el workflow `ai_lead_auditor_n8n.json` que acabo de crear para ti.
2. Abre el primer nodo llamado **"Webhook - Tally Form"**.
3. Haz clic en **Test URL** (la URL de prueba, empezará por algo parecido a `https://tu-n8n.com/webhook-test/tally-lead-audit`).
4. **Copia esa URL.**
5. Ve a **Tally.so**, abre tu formulario, ve a **Integrations**, busca **"Webhooks"** y haz clic en "Connect".
6. Pega la URL de n8n y dale a guardar.

---

## 3. La Estrategia de Implementación (Para tus 40 Leads)

Dado que no tienes tiempo ni presupuesto para enviar mensajes manuales 1 a 1, haremos esto:

1. **Email Masivo o WhatsApp (Vía Stefan/Alex):** Envía un mensaje a esos 40 leads diciendo:
   > *"Hola [Nombre]. Hemos estado analizando el sector [Sector, ej. Hotelero] esta semana y hemos creado una herramienta de IA que hace una Auditoría Operativa gratuita en 2 minutos. Detecta cuántos ingresos estás perdiendo por fugas en tu embudo de ventas actual. Puedes correr tu diagnóstico aquí: [Link de tu Tally]"*
2. **El "Wow" Factor:** En cuanto el lead llena el Tally, n8n procesará los datos en 10 segundos. El nodo de Inteligencia Artificial que configuré detectará su problema, calculará la pérdida y generará una propuesta hiper-personalizada.
3. **El Cierre (Interno):** El sistema te avisará a tu Telegram con el texto exacto. Tú solo tendrás que leer esa propuesta perfecta, decidir si la quieres enviar por WhatsApp/Email, y el cliente quedará impresionado por la personalización y la velocidad. El esfuerzo manual se reduce al 5%.
