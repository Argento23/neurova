# Guía: Setup de APIs para Community Manager Automático

## 📝 Antes de Empezar

Necesitarás crear **cuentas de desarrollador** en cada plataforma. Este proceso puede tomar 1-3 días para aprobación.

---

## 1️⃣ Meta Business API (Instagram + Facebook)

### Prerrequisitos:
- Cuenta de Instagram Business
- Página de Facebook
- Facebook Business Account

### Pasos:

1. **Crear Facebook App**
   - Ve a https://developers.facebook.com/
   - Click "My Apps" → "Create App"
   - Tipo: "Business"
   - Nombre: "GenerArise Social Manager"

2. **Agregar Instagram Graph API**
   - En tu app → "Add Product" → "Instagram Graph API"
   - Configurar permisos:
     - `instagram_basic`
     - `instagram_content_publish`
     - `pages_read_engagement`
     - `pages_manage_posts`

3. **Conectar Cuenta Instagram**
   - Tools → Graph API Explorer
   - Seleccionar tu página de Facebook
   - Get User Access Token
   - Permisos: Instagram Basic Display, Instagram Content Publishing

4. **Obtener Long-Lived Token**
   ```bash
   curl -i -X GET "https://graph.facebook.com/v19.0/oauth/access_token?  
     grant_type=fb_exchange_token&  
     client_id={app-id}&  
     client_secret={app-secret}&  
     fb_exchange_token={short-lived-token}"
   ```

5. **Guardar en n8n**
   - Credentials → Add → "Instagram"
   - Access Token: {long-lived-token}

**Test:**
```bash
curl "https://graph.facebook.com/v19.0/me/accounts?access_token={token}"
```

---

## 2️⃣ LinkedIn API

### Prerrequisitos:
- Cuenta LinkedIn Company Page
- App verificada

### Pasos:

1. **Crear LinkedIn App**
   - Ve a https://www.linkedin.com/developers/apps
   - Click "Create app"
   - Nombre: "GenerArise Social Manager"
   - LinkedIn Page: {tu página de empresa}

2. **Request Access** al Share on LinkedIn
   - En tu app → "Products" → "Share on LinkedIn"
   - Click "Request access"
   - Esperar aprobación (1-2 días)

3. **Configurar OAuth 2.0**
   - Redirect URLs: `https://tu-n8n.com/rest/oauth2-credential/callback`
   - Scopes requeridos:
     - `w_member_social`
     - `w_organization_social`

4. **Obtener Tokens**
   - n8n → Credentials → Add → "LinkedIn OAuth2"
   - Client ID: {from LinkedIn app}
   - Client Secret: {from LinkedIn app}
   - Authorize

**Test:**
```bash
curl -X GET 'https://api.linkedin.com/v2/me' \
  -H 'Authorization: Bearer {access-token}'
```

---

## 3️⃣ TikTok Content Posting API

### Prerrequisitos:
- Cuenta TikTok Business
- Developer Account

### Pasos:

1. **Crear TikTok Developer App**
   - Ve a https://developers.tiktok.com/
   - "Manage apps" → "Create new app"
   - Tipo: "Third-party platform integration"

2. **Add Content Posting API**
   - En tu app → "Add products"
   - Seleccionar "Content Posting API"
   - Submit for review (1-3 días)

3. **Configurar OAuth**
   - Redirect URI: `https://tu-n8n.com/oauth/callback`
   - Scopes:
     - `video.upload`
     - `video.publish`

4. **Obtener Access Token**
   - n8n → Credentials → HTTP Request (Header Auth)
   - Name: "TikTok API"
   - Header: `Authorization`
   - Value: `Bearer {access-token}`

**Test:**
```bash
curl -X GET 'https://open.tiktokapis.com/v2/post/publish/creator_info/query/' \
  -H 'Authorization: Bearer {access-token}'
```

---

## 4️⃣ X/Twitter (Alternativa No-Oficial)

> [!WARNING]
> **Método alternativo:** Evita el costo de $100/mes del API oficial pero tiene riesgo de detección.

### Opción A: Phantom Buster (Recomendada)
```
Servicio: https://phantombuster.com/
Plan: $30/mes
Features: Auto-post, schedule, evade detección
```

### Opción B: n8n + Playwright (DIY)

**No recomendado inicialmente** - Requiere mantenimiento constante cuando X cambia UI.

1. Instalar Playwright en n8n:
   ```bash
   cd ~/.n8n
   npm install playwright
   ```

2. Crear workflow con Execute Command:
   ```javascript
   const { chromium } = require('playwright');
   const browser = await chromium.launch({ headless: true });
   const page = await browser.newPage();
   
   // Login
   await page.goto('https://twitter.com/login');
   await page.fill('input[name="text"]', process.env.X_USERNAME);
   await page.click('text=Next');
   await page.fill('input[name="password"]', process.env.X_PASSWORD);
   await page.click('text=Log in');
   
   // Post tweet
   await page.goto('https://twitter.com/compose/tweet');
   await page.fill('[data-testid="tweetTextarea_0"]', item.tweet_text);
   await page.click('[data-testid="tweetButtonInline"]');
   
   await browser.close();
   ```

**Recomendación:** Usa Phantom Buster para evitar mantenimiento.

---

## 5️⃣ Leonardo AI

### Pasos:

1. **Crear Cuenta**
   - Ve a https://leonardo.ai/
   - Sign up con Google
   - Plan: Creator ($24/mes) - 8500 tokens/mes

2. **Obtener API Key**
   - Settings → API Access
   - Generate API Key
   - Copiar token

3. **Configurar en n8n**
   - Credentials → HTTP Request (Header Auth)
   - Name: "Leonardo AI"
   - Header: `Authorization`
   - Value: `Bearer {api-key}`

**Test:**
```bash
curl -X GET 'https://cloud.leonardo.ai/api/rest/v1/me' \
  -H 'Authorization: Bearer {api-key}'
```

---

## ✅ Checklist de Verificación

Antes de continuar con los workflows, verifica:

- [  ] Meta Business API funcionando (Instagram + Facebook)
- [ ] LinkedIn OAuth configurado y autorizado
- [ ] TikTok API aprobado y token obtenido
- [ ] X/Twitter alternativa funcionando (Phantom Buster o Playwright)
- [ ] Leonardo AI API key válida
- [ ] Todas las credenciales guardadas en n8n
- [ ] Test de cada API exitoso

---

## 🔐 Seguridad

**Nunca compartas tus tokens.** Usa variables de entorno o n8n Credentials Manager.

**Rotar tokens cada 60 días** como práctica de seguridad.

---

## 🚨 Troubleshooting

### Meta API - Error 190
- **Causa:** Token expirado
- **Solución:** Regenerar long-lived token

### LinkedIn - Access Denied
- **Causa:** App no verificada o scopes insuficientes
- **Solución:** Esperar aprobación de LinkedIn (1-2 días)

### TikTok - Invalid Access Token
- **Causa:** Token no refrescado
- **Solución:** Regenerar via OAuth flow

### X Alt - Bot Detected
- **Causa:** Comportamiento no-humano
- **Solución:** Agregar delays aleatorios, evitar posts en ráfaga
