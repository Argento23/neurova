# Operativa en Argentina y Entregables del Servicio

## 1. El Contexto Argentina: Apuntar a los "Ganadores" del Modelo

Tienes absoluta razón. La economía argentina actual está muy polarizada. Mientras el consumo masivo y tradicional está deprimido, hay sectores que ganan en dólares o atienden al 5% más rico y están en un estado de mucha liquidez. **Tus clientes están ahí, no le vendas al que está intentando sobrevivir.**

**Nichos rentables en Argentina HOY (A dónde apuntar):**
*   **Sector Agro y maquinaria:** Concesionarias agrícolas, insumos.
*   **Ecosistema Vaca Muerta / Minería:** Empresas de logística, viandas, alojamiento y servicios para petroleros/mineros (en Neuquén, San Juan, Salta).
*   **Inmobiliarias Premium:** Venta de propiedades o alquileres temporarios para expats.
*   **Clínicas Estéticas y Odontológicas de Alta Gama:** (Implantes, cirugías plásticas) que cobran en USD.
*   **Agencias de Viajes Premium y Seguros.**

### Precios sugeridos (Mercado Argentino - Segmento Alto)
*Cobra siempre el equivalente al dólar MEP o en USDT/Cripto.*

*   **Nivel 1 (Básico):** Setup $400 - $600 USD | Retainer: $100 - $150 USD/mes.
*   **Nivel 2 (Intermedio):** Setup $1,000 - $1,500 USD | Retainer: $250 - $400 USD/mes.
*   **Nivel 3 (Sofisticado):** Setup $2,500 - $4,000 USD | Retainer: $600 - $1,000 USD/mes.

---

## 2. ¿Qué se le entrega exactamente al cliente? (Deliverables)

El intangible (la IA) necesita ser tangibilizado. Cuando te pagan, tienen que "tocar" o "ver" algo rápido para sentir que valió la pena.

### Entregables para el Nivel 1 (Básico - Filtro y Agendamiento)
1.  **Activación de la Línea IA:** Un número de WhatsApp (el de ellos o uno nuevo) conectado a tu infraestructura que ya está respondiendo a clientes.
2.  **Base de Datos en Tiempo Real (Google Sheets / Airtable):** Todo lead que interactúa con la IA, automáticamente aparece en un Excel o Sheet para ellos. Entregas el link con la columna "Estado" (Calificado, Esperando Respuesta, Cita Agendada).
3.  **PDF / Guía de Handoff:** Un documento de 2 páginas que explica a sus vendedores cómo "entrar" a interrumpir a la IA si el cliente está pidiendo un pago en efectivo u otra urgencia.
4.  **Acceso a Calendly/Agenda:** La agenda sincronizada.

### Entregables para el Nivel 2 (Intermedio - SDR Virtual Avanzado)
1.  **Todo lo del Nivel 1.**
2.  **Dashboard de Leads:** Integración a un CRM o plataforma (Zendesk, HubSpot o incluso un panel de N8N que tú les armes) para que vean las analíticas.
3.  **Auditoría de Base de Conocimiento (PDF):** Un documento con las "reglas y personalidad" que configuraste para su modelo. Es el currículum de su asistente.
4.  **Sesión de Onboarding (Zoom de 1hr):** Grabada, para entrenar a sus vendedores humanos sobre cómo trabajar codo a codo con el bot sin pisarse.

### Entregables para el Nivel 3 (Sofisticado - Omnicanalidad)
1.  **Chatwoot (Bandeja Omnicanal):** Acceso completo con usuarios para varios agentes humanos de su call center.
2.  **Infraestructura Propia de VPS.** (Ver punto 3).
3.  **Integración con ERP/Base de datos propia.**
4.  **SLA de Soporte:** Contrato de nivel de servicio (Soporte prioritario por urgencias, caídas de la API, etc).
5.  **Revisión mensual de analíticas:** Una reunión de 45 minutos al mes repasando conversiones y ajustando el prompt para mejorar resultados.

---

## 3. ¿Cuándo añadir un VPS Personalizado vs. Cuándo usar tu Servidor?

Este es el secreto de la rentabilidad de las Agencias SaaS/IA.

### Fase 1 y 2 (Básico e Intermedio): VPS COMPARTIDO (El Tuyo)
*   **Estrategia:** Tú instalas tu instancia principal de `n8n`, `Evolution API`, `Supabase`, etc. en un VPS tuyo (ej. Hetzner, DigitalOcean) grande y estable (de unos $30-$50 USD al mes).
*   **Ejecución:** Cada cliente nuevo es simplemente una *"instancia"* dentro de tu Evolution API. No creas servidores nuevos. Todos operan bajo tu misma máquina.
*   **Por qué:** Te maximiza la ganancia bruta. Si le cobras $200 de retainer a 5 clientes mensuales, tienes $1,000 USD de entrada, y tu VPS general solo te costó $40.
*   **Excepción:** Si un cliente maneja datos hiper-sensibles y por legalidad te exige separación (raro al inicio).

### Fase 3 o Volumen Extremo: VPS DEDICADO (Para el Cliente)
*   **Cuándo aplicar:**
    *   Si el cliente contrata el nivel "Sofisticado" y va a usar un **Chatwoot propio con 10 o más agentes humanos**, más llamadas de voz, más WhatsApp con miles de leads al día. Esto requiere su propia base de datos separada.
    *   Si el cliente necesita conexiones privadas con su servidor local mediante VPNs.
*   **Estrategia:** Llevas el costo de un pequeño servidor de Hetzner/Digital Ocean (aprox $15 - $20 USD/mes) donde le instalas su propia instancia de TODO (Chatwoot, Evolution API, N8N separado).
*   **Por qué:** Si su call center genera un cuello de botella o caídas porque tienen 500 conversaciones a la vez, no te tirarían abajo a tus otros clientes "chicos" que tienes en el VPS compartido. Além, justifica el retainer más caro (ej. $1000/mes) porque le estás dando infraestructura "Enterprise".
