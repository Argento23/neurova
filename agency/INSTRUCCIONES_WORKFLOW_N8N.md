# Guía de Actualización: Workflow de Argenterio (GenerArise Agency)

## Cambios Implementados

Se ha modificado el flujo de Argenterio para que **primero cobre al usuario y luego envíe el email**. Además, el email ahora se envía en **formato HTML** en lugar de texto plano.

## Archivos Creados/Modificados

### 1. ✅ `EMAIL_TEMPLATE_LEAD.html` (NUEVO)
- **Ubicación**: `c:\Users\Gustavo\Downloads\neurova\agency\EMAIL_TEMPLATE_LEAD.html`
- **Descripción**: Template de email en HTML con diseño profesional
- **Características**:
  - Diseño responsivo con tabla HTML
  - Gradiente en header
  - Sección destacada para el desafío del cliente
  - Botón CTA para agendar sesión
  - Footer profesional

### 2. ✅ `script.js` (MODIFICADO)
- **Cambio Principal**: Ahora redirige directamente a MercadoPago después de generar el link
- **Flujo Nuevo**:
  1. Usuario completa formulario
  2. Se genera link de pago en MercadoPago
  3. Usuario es redirigido a MercadoPago
  4. Después del pago exitoso, vuelve a `confirmacion.html`
  5. **Recién ahí se envía el email**

### 3. ✅ `confirmacion.html` (NUEVO)
- **Ubicación**: `c:\Users\Gustavo\Downloads\neurova\agency\confirmacion.html`
- **Descripción**: Página de confirmación post-pago
- **Función**: Envía el email al webhook después de confirmar el pago

---

## 🔧 INSTRUCCIONES PARA N8N

### Workflow Actual (a modificar)

**Webhook**: `793adffe-d06a-42d5-b480-f8747ae5108d`

### Cambios Necesarios en el Workflow:

#### **PASO 1: Modificar el Webhook Principal**

El webhook existente (`793adffe-d06a-42d5-b480-f8747ae5108d`) ahora debe:

1. **Recibir el formulario** con el campo `paymentPending: true`
2. **Generar el link de MercadoPago** (como ya lo hace)
3. **NO enviar el email todavía**
4. **Devolver solo el link de pago**:

```json
{
  "mp_link": "https://mpago.la/XXXXXXX",
  "teaser": "Mensaje opcional de preview"
}
```

5. **Configurar la URL de retorno de MercadoPago** para que apunte a:
   ```
   https://generarise.space/confirmacion.html?status={{status}}&payment_id={{payment_id}}&preference_id={{preference_id}}
   ```

#### **PASO 2: Crear Nuevo Webhook para Email Post-Pago**

Crear un **nuevo webhook** en n8n:

- **Nombre sugerido**: `SEND_LEAD_EMAIL`
- **URL**: `https://manager.generarise.space/webhook/SEND_LEAD_EMAIL` (cambiar ID si es necesario)
- **Método**: POST

**Flujo de este nuevo webhook**:

1. **Webhook Trigger** - Recibe datos del lead + confirmación de pago
2. **Code Node (opcional)** - Validar que `paymentConfirmed: true`
3. **Email Node (Gmail/SMTP/SendGrid)** - Enviar email usando `EMAIL_TEMPLATE_LEAD.html`
   - **Para**: `{{json.body.email}}` (email del lead)
   - **De**: `tu-email@generarise.space`
   - **Asunto**: `Soluciones IA para optimizar {{json.body.message}} en {{json.body.company}}`
   - **Cuerpo**: Cargar contenido desde `EMAIL_TEMPLATE_LEAD.html` y reemplazar variables:
     - `{{json.body.name}}` → Nombre del lead
     - `{{json.body.role}}` → Cargo
     - `{{json.body.company}}` → Empresa
     - `{{json.body.message}}` → Desafío/objetivo
     - `[LINK_CALENDARIO]` → `https://cal.com/gustavo-a.-dornhofer-nqjqos/auditoria-ia-gratuita-free-ai-audit-kostenloses-ki-audit`

4. **Response Node** - Devolver:
   ```json
   {
     "status": "success",
     "message": "Email enviado"
   }
   ```

---

## 📝 Variables del Template HTML

El template `EMAIL_TEMPLATE_LEAD.html` usa estas variables que debes reemplazar en n8n:

```javascript
{{json.body.name}}        // Nombre del cliente
{{json.body.role}}        // Cargo
{{json.body.company}}     // Empresa
{{json.body.message}}     // Problema/desafío principal
[LINK_CALENDARIO]         // Reemplazar con: https://cal.com/gustavo-a.-dornhofer-nqjqos/auditoria-ia-gratuita-free-ai-audit-kostenloses-ki-audit
```

---

## 🔄 Flujo Completo (Resumido)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario completa formulario en index.html               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. POST a Webhook 793adffe... con paymentPending: true     │
│    → n8n genera link MercadoPago                            │
│    → NO envía email                                         │
│    → Devuelve: { mp_link: "..." }                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Usuario redirigido a MercadoPago                         │
│    → Completa el pago                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. MercadoPago redirige a confirmacion.html                 │
│    → URL: confirmacion.html?status=approved&payment_id=...  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. confirmacion.html envía POST al nuevo webhook            │
│    → Webhook: SEND_LEAD_EMAIL                               │
│    → Incluye: paymentConfirmed: true, paymentId, etc        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. n8n envía EMAIL en HTML al lead                          │
│    → Usa template EMAIL_TEMPLATE_LEAD.html                  │
│    → Incluye link de calendario                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing

### Para probar el flujo:

1. **Actualiza el webhook ID** en `confirmacion.html` línea 134:
   ```javascript
   const emailWebhookUrl = "https://manager.generarise.space/webhook/TU_NUEVO_WEBHOOK_ID";
   ```

2. **Configura la URL de retorno en MercadoPago**:
   - En el nodo de MercadoPago en n8n, establece:
   ```json
   {
     "back_urls": {
       "success": "https://generarise.space/confirmacion.html",
       "failure": "https://generarise.space/confirmacion.html",
       "pending": "https://generarise.space/confirmacion.html"
     },
     "auto_return": "approved"
   }
   ```

3. **Prueba el flujo completo**:
   - Llena el formulario en `index.html`
   - Verifica que te redirija a MercadoPago
   - Completa el pago (modo sandbox)
   - Confirma que vuelves a `confirmacion.html`
   - Verifica que el email llegue en formato HTML

---

## 📌 Notas Importantes

- El **email antiguo** (`EMAIL_TEMPLATE_LEAD.txt`) ya no se usa
- El **nuevo template HTML** está en `EMAIL_TEMPLATE_LEAD.html`
- La página de confirmación maneja los estados: `approved`, `pending`, `rejected`
- Los datos del lead se guardan en `sessionStorage` del navegador temporalmente
- Después de enviar el email exitosamente, se borran del `sessionStorage`

---

## ❓ Soporte

Si tienes dudas sobre la implementación en n8n, revisa:
- El webhook existente para ver cómo genera el link de MercadoPago
- Los nodos de Email para configurar el HTML body
- La documentación de MercadoPago sobre `back_urls` y `auto_return`

---

**Fecha de creación**: 2026-02-01  
**Versión**: 2.0 - Post-Payment Email Flow
