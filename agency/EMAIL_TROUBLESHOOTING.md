# Guía de Solución de Problemas de Email (Gmail)

Si los correos enviados desde tu sistema (n8n / Brevo / SMTP) no están llegando a las cuentas de Gmail, sigue estos pasos de diagnóstico en orden. Gmail tiene filtros muy estrictos para evitar spam.

## 1. Revisión Básica (Inmediata)

1.  **Revisa la carpeta de SPAM / Correo No Deseado**:
    *   Es muy probable que el correo esté ahí. Gmail suele marcar dominios nuevos como sospechosos al principio.
    *   **Solución:** Si está ahí, márcalo como "No es Spam" para entrenar a Google.

2.  **Revisa la pestaña "Promociones"**:
    *   A veces Gmail clasifica correos automatizados en esta pestaña automáticamente.

---

## 2. Validación Técnica del Dominio (CRÍTICO)

Si usas un correo con dominio propio (ej: `noreply@generarise.space`) enviando a través de SMTP o Brevo, **ES OBLIGATORIO** tener configurados los registros **SPF** y **DKIM** en tu proveedor de dominio (Namecheap, GoDaddy, Cloudflare, etc.).

Sin esto, Gmail bloqueará tus correos silenciosamente.

### ¿Cómo verificar?
Ve a [MXToolbox](https://mxtoolbox.com/) y pon tu dominio `generarise.space`:
1.  **SPF Record:** Debe aparecer un registro TXT que incluya a tu proveedor de envío (ej: `v=spf1 include:spf.brevo.com ~all`).
2.  **DKIM:** Debes configurarlo en el panel de Brevo/SMTP y copiar la clave a tus DNS.

> **Si usas Brevo:** Entra a tu cuenta de Brevo -> Senders & IP -> Domains -> "Authenticate this domain". Ahí te darán los códigos exactos que debes poner en tu DNS.

---

## 3. Verificación en n8n

Si estás usando el workflow de n8n:

1.  Abre el workflow y haz clic en el botón **Executions** (a la izquierda).
2.  Busca la última ejecución exitosa.
3.  Haz clic en el nodo **Send Email**.
4.  ¿Salió verde (Success)?
    *   **Sí:** El problema es de entrega (paso 2 arriba).
    *   **No / Rojo:** Revisa el mensaje de error. Puede ser "Auth failed" (contraseña mal) o "Connection timed out".

### Prueba con otro correo
Intenta registrarte con un correo que **no sea Gmail** (ej: Hotmail, Yahoo o uno corporativo) para ver si el problema es solo con Gmail o general.

---

## 4. Cal.com (Si te refieres a las citas)

Si usas Cal.com alojado en `app.cal.com`:
*   Sus correos suelen llegar bien. Si no llegan, revisa Spam.
*   Si usas tu propio servidor de email en Cal.com (Self-hosted), aplican las mismas reglas de SPF/DKIM del punto 2.
