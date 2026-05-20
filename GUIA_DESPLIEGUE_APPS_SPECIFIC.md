# Guía de Despliegue: AdSniper & Austria en Easypanel

Esta guía contiene los pasos específicos para instalar AdSniper y Austria en tu nuevo VPS usando Easypanel.

---

## 🚀 1. AdSniper SaaS

### Configuración en Easypanel:
1. **Add Service** → **GitHub** (o Docker Image si prefieres).
2. **Source**: Conecta tu repositorio de `adsniper-saas`.
3. **Build Settings**:
   - **Build Method**: Dockerfile
   - **Context**: `/`
   - **Dockerfile**: `Dockerfile` (ya está en la carpeta)
4. **General Settings**:
   - **Domain**: `adsniper.agentes.space`
   - **Container Port**: `3001`

### Variables de Entorno (Environment Variables):
Copia y pega estas de tu `.env.local`:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
REPLICATE_API_KEY=r8_...
GROQ_API_KEY=gsk_...
N8N_WEBHOOK_URL=https://manager.agentes.space/webhook/shopify-adsniper
```

---

## 🏔️ 2. Austria SaaS

### Configuración en Easypanel:
1. **Add Service** → **GitHub**.
2. **Source**: Repositorio de `austria-saas`.
3. **Build Settings**:
   - **Build Method**: Dockerfile
   - **Dockerfile**: (Si no tienes uno, usa el de abajo)

#### Dockerfile Sugerido para Austria SaaS:
```dockerfile
FROM node:20-alpine AS base
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV PORT 3002
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3002
CMD ["node", "server.js"]
```

4. **General Settings**:
   - **Domain**: `austria.agentes.space`
   - **Container Port**: `3002`

---

## ⚙️ 3. Pasos Finales (DNS)

Asegúrate de tener estos registros en tu panel de DNS:

| Tipo | Nombre | Valor |
|------|--------|-------|
| A | adsniper | LA_IP_DE_TU_VPS |
| A | austria | LA_IP_DE_TU_VPS |

---

## ✅ Verificación
Una vez deployados, entra a:
- `https://adsniper.agentes.space`
- `https://austria.agentes.space`
