# Guía de Respuestas Automáticas para Instagram (n8n + Chatwoot)

Esta guía explica paso a paso cómo implementar el workflow de n8n para que las respuestas automáticas generadas por IA lleguen a tus clientes de Instagram a través de Chatwoot.

## 1. Importar el Workflow a n8n
1. Ingresa a tu panel de n8n.
2. Crea un **New Workflow**.
3. Haz clic en el menú (arriba a la derecha) y selecciona **Import from File**.
4. Sube el archivo `workflows/instagram_auto_reply_n8n.json` que acabamos de generar en tu carpeta.
5. Verás 5 nodos (Webhook, Filtros y HTTP Requests) conectados entre sí.

## 2. Configurar las Credenciales en n8n
Dentro del workflow importado, deberás actualizar dos cosas clave:

*   **Nodo OpenRouter LLM**: Doble clic y busca `Authorization`. Reemplaza el texto `TU_API_KEY_DE_OPENROUTER_AQUI` por tu API Key real de OpenRouter.
*   **Nodo Enviar Respuesta a Chatwoot**: Doble clic y busca `api_access_token`. Reemplaza `TU_CHATWOOT_API_TOKEN_AQUI` por el Token de Acceso a la API de tu administrador en Chatwoot (lo encuentras en Configuración de Perfil > Token de Acceso).

## 3. Conectar Chatwoot con n8n
1. En n8n, haz doble clic en el primer nodo (**Webhook Chatwoot**).
2. Copia la **Test URL** para probarlo o la **Production URL** para dejarlo definitivo. (Ej: `https://n8n.tudominio.com/webhook/chatwoot-ig-auto-reply`).
3. Ve a tu Chatwoot (`https://woot.generarise.space/`).
4. Ve a Ajustes > **Integraciones** > **Webhooks**.
5. Haz clic en **Añadir Webhook**.
6. Pega la URL del paso 2.
7. Marca los eventos **Mensajes Creados**.

## 4. Control de Etiqueta (Pausar Bot)
*   **¿Cómo pausar la IA?**: Si un humano decide intervenir y responder manualmente un DM de Instagram, debes abrir la conversación en Chatwoot y añadirle la etiqueta **`bot-paused`**.
*   **¿Por qué?**: El workflow de n8n detectará si la etiqueta `bot-paused` está presente en la conversación. Si es así, **detendrá la automatización inmediatamente**, evitando respuestas robóticas no deseadas superponiéndose a tus conversaciones humanas.

## 5. ¡A Probar!
*   Asegúrate de que el workflow en n8n esté **Activado (Active)**.
*   Pídele a alguien que te envíe un mensaje a tu cuenta corporativa de Instagram.
*   Verifica que aparezca en el Chatwoot. A los pocos segundos, la IA devolverá la respuesta acorde al rol de "Alex", y podrás verlo directamente inyectado en Chatwoot y apareciendo mágicamente en el DM del cliente.
