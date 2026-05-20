# 📋 Datos de Configuración - Easypanel Neurova

Gustavo, acá tenés la data lista para copiar y pegar en Easypanel para cada servicio.

---

## 🧠 1. n8n (Cerebro)
**Recomendación:** Usá el "App Template" de n8n en Easypanel para que sea más fácil.

- **Service Name:** `manager`
- **Domain:** `manager.agentes.space`
- **Environment Variables:**
```bash
N8N_HOST=manager.agentes.space
N8N_PORT=5678
N8N_PROTOCOL=https
NODE_ENV=production
WEBHOOK_URL=https://manager.agentes.space/
```

---

## 💬 2. Chatwoot (Atención al Cliente)
**Recomendación:** Usá el "App Template" de Chatwoot. Necesitás una base de datos Postgres y Redis (Easypanel las crea automático con el template).

- **Service Name:** `chat`
- **Domain:** `chat.agentes.space`
- **Environment Variables Clave:**
```bash
FRONTEND_URL=https://chat.agentes.space
NODE_ENV=production
```

---

## 📱 3. Evolution API (WhatsApp)
**Recomendación:** Usar como "App" desde Docker Image.

- **Service Name:** `api`
- **Domain:** `api.agentes.space`
- **Docker Image:** `atendare/evolution-api:latest`
- **Port:** `8080`
- **Environment Variables:**
```bash
SERVER_URL=https://api.agentes.space
AUTHENTICATIONS_API_KEY=neurova_global_key_2026
AUTHENTICATIONS_TYPE=apikey
```

---

## 🎯 4. Template (SaaS)
**Configuración de GitHub:**
- **Repo:** `Argento23/template-saas`
- **Build Method:** `Dockerfile`
- **Port:** `3003`
- **Domain:** `template.agentes.space`
- **Environment Variables:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... (Copia de tu .env.local)
CLERK_SECRET_KEY=sk_test_... (Copia de tu .env.local)
GROQ_API_KEY=gsk_... (Copia de tu .env.local)
REPLICATE_API_KEY=r8_... (Copia de tu .env.local)
N8N_WEBHOOK_URL=https://manager.agentes.space/webhook/shopify-adsniper
```

---

## 🍪 6. Cilo (B2B)
**Configuración de GitHub:**
- **Repo:** `Argento23/cilo-b2b`
- **Build Method:** `Dockerfile`
- **Port:** `3001`
- **Domain:** `cilo.agentes.space`

---

## 🧘 7. MindHafen (MVP)
**Configuración de GitHub:**
- **Repo:** `Argento23/mindhafen-saas`
- **Build Method:** `Dockerfile`
- **Port:** `80` (Nginx)
- **Domain:** `mindhafen.agentes.space`

---

## 🏔️ 5. Austria (Ya operativo)
**Ya está funcionando en:** `https://austria.agentes.space`

---

## 🛠️ Pasos de DNS (Recordatorio)
Asegurate que en el panel de Cloudflare/Contabo todos estos apunten a la **IP del VPS**:
- `manager.agentes.space`
- `chat.agentes.space`
- `api.agentes.space`
- `studio.agentes.space`
- `austria.agentes.space`
- `template.agentes.space`
- `cilo.agentes.space`
- `mindhafen.agentes.space`
