# PROYECTO: "AUTONOMOUS SALES AGENT" (EL VENDEDOR IA)
**Objetivo:** Crear un agente autónomo que busque, analice, contacte y venda para tus 3 aplicaciones (Argenterio, MindHafen, GenerArise) y que *a futuro sea un producto vendible*.

La IA tendrá **iniciativa propia**: Ejecutará ciclos de búsqueda diarios, decidirá a quién contactar y personalizará cada mensaje.

---

## 🏗️ ARQUITECTURA DEL SISTEMA (n8n + SerpApi + Gemini)

El sistema se puede replicar para tus 3 negocios cambiando solo el "Prompt de Venta" y las "Keywords de Búsqueda".

### FASE 1: "EL CAZADOR" (Scraping & Prospecting)
*   **Herramienta:** SerpApi (Google Search API) + n8n.
*   **Función:** La IA busca activamente en Google/LinkedIn oportunidades.
    *   *Ejemplo Argenterio:* Busca "Pymes en crisis financiera", "Foros de deudas", "Abogados de quiebras".
    *   *Ejemplo MindHafen:* Busca "Gerentes de RRHH LinkedIn en empresas de tecnología (burnout alto)".
    *   *Ejemplo GenerArise:* Busca "Agencias de marketing tradicionales" (para ofrecerles automatización).
*   **Automatización:** Un `Cron Node` (Temporizador) activa la búsqueda cada mañana a las 9:00 AM.

### FASE 2: "EL ANALISTA" (Enrichment & Intelligence)
*   **Herramienta:** Gemini 1.5 Pro.
*   **Función:**
    1.  Recibe los resultados de SerpApi (webs, descripciones).
    2.  Entra a la web del prospecto (HTTP Request).
    3.  **Scoring:** Decide: "¿Vale la pena contactar a esta empresa?".
    4.  **Hook:** Genera una frase de entrada única basada en lo que vio en su web. *"Vi en su web que están contratando X, mi IA podría automatizar eso..."*.

### FASE 3: "EL DIPLOMÁTICO" (Outreach & Conversion)
*   **Herramienta:** Gmail / Brevo + Gemini.
*   **Función:** Redacta y envía el correo *sin plantilla fija*. Es 100% generado al vuelo.
    *   Incluye los links de pago o diagnóstico que ya arreglamos (Argenterio V7, MindHafen Premium).
*   **Seguimiento:** Si no responden en 2 días, la IA envía un "Follow-up" con un recurso gratuito (Lead Magnet).

---

## 🚀 IMPLEMENTACIÓN: PASO A PASO

### PASO 1: Configurar "El Cazador" (SerpApi)
Necesitaremos tu **API KEY de SerpApi**. Configuraremos un nodo en n8n que haga:
`GET https://serpapi.com/search.json?q="Gerentes de RRHH Argentina"&api_key=TU_KEY`

### PASO 2: El Cerebro (Gemini Decision Node)
Crearemos un nodo "AI Filter" en n8n.
*   Input: 50 resultados de búsqueda.
*   Prompt: *"De esta lista, filtra solo los que parezcan empresas reales con presupuesto. Descarta estudiantes o blogs personales."*

### PASO 3: El Producto "White Label"
Para vender esto como servicio, empaquetaremos el Workflow de n8n como un **JSON exportable**.
*   Tú vendes la "Licencia" del workflow.
*   El cliente solo pone su API Key de OpenAI/Gemini y listo.

---

## ¿POR DÓNDE EMPEZAMOS?

Recomiendo empezar por **GenerArise (Tu Agencia)** porque es el caso de uso más directo ("B2B Sales").

**¿Tienes la API Key de SerpApi a mano para que configure el primer nodo de búsqueda ahora mismo?**
Si no, puedo dejar preparada la estructura con datos de prueba.
