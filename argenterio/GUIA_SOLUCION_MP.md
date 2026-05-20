# GUÍA DE SOLUCIÓN: ERROR MERCADOPAGO ARGENTERIO

Si al completar el formulario ves el botón "ERROR: LINK MP NO GENERADO" o solo aparece PayPal, sigue estos pasos. El problema es que **n8n está respondiendo antes de tiempo**.

## PASO 1: REACTUALIZAR WORKFLOW EN N8N
1. Ve a tu editor de n8n.
2. Abre el workflow de Argenterio.
3. Importa el archivo actualizado que está en tu carpeta:
   `c:\Users\Gustavo\Downloads\neurova\argenterio\workflow_auditor_v7_FIXED.json`
4. **IMPORTANTE**: Asegúrate de que las credenciales de MercadoPago y Groq estén conectadas nuevamente si se desconectaron al importar.

## PASO 2: VERIFICAR EL NODO "WEBHOOK"
Si prefieres hacerlo manualmente (sin importar):
1. Haz doble click en el primer nodo (Webhook Data).
2. Busca la opción **"Response Mode"** (Modo de Respuesta).
3. Cambiala de "On Received" (Al recibir) a **"

" (Esperar al nodo de respuesta)**.
   * *Si no haces esto, n8n responde "Workflow started" inmediatamente y no espera a que se cree el link.*

## PASO 3: GUARDAR Y ACTIVAR
1. Guarda el workflow.
2. Asegúrate de que esté **ACTIVO** (toggle verde arriba a la derecha) para pruebas en producción, o usa "Execute Workflow" para probar.

---
Una vez hecho esto, vuelve a llenar el formulario en la web. Deberías ver:
1. "PROCESANDO..."
2. Teaser del análisis IA.
3. Botón Azul de MercadoPago funcionando.
4. Redirección automática al pago.

## POSIBLE ERROR: "Header name must be a valid HTTP token"
Si ves este error en el nodo "Crear Link MP":
1. Ve a **Credentials** en n8n.
2. Abre la credencial "MercadoPago Token (Header Auth)".
3. Revisa los campos:
   * **Name**: Debe decir exactamente `Authorization` (sin comillas). Tu error indica que pusiste una URL aquí.
   * **Value**: Debe decir `Bearer TU_ACCESS_TOKEN` (ej: `Bearer APP_USR-123...`).
4. Guarda y reintenta.
