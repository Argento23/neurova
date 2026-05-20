# GUÍA COMPLETA: REINSTALACIÓN VPS DESDE CERO
## Para: agentes.space (Contabo VPS - 4 vCPU, 8GB RAM, 75GB NVMe)

---

## ⚠️ ANTES DE EMPEZAR: BACKUP CRÍTICO

### Lo que perderás al formatear:
- ✅ Easypanel (tendrás que reinstalarlo)
- ✅ n8n + todos los workflows
- ✅ Chatwoot + conversaciones
- ✅ Evolution API + sesiones de WhatsApp
- ✅ Landing page deployada

### Lo que NO perderás (está en tu PC):
- ✅ Código fuente de tu landing (`neurova/agency/`)
- ✅ Documentación (modelo de servicios, prompts, etc.)

### GUARDA ESTO AHORA (antes de formatear):
1. **Workflows de n8n**: Ve a n8n → Settings → Export Workflows → Guarda el JSON
2. **Credenciales de Chatwoot**: Anota usuario/contraseña admin
3. **API Keys**: Si tienes keys de Evolution u otros servicios

---

## FASE 1: FORMATEO DEL VPS (Desde Panel Contabo)

### Paso 1.1: Crear Snapshot (OPCIONAL pero recomendado)
1. Entra a tu panel de Contabo
2. Ve a tu VPS → Snapshots
3. Crea un snapshot (tienes 1 disponible)
   - *Por si acaso algo sale mal en el formateo*

### Paso 1.2: Reinstalar el Sistema Operativo
1. Panel Contabo → Tu VPS → Settings o Management
2. Busca la opción **"Reinstall OS"** o **"Reset"**
3. Selecciona: **Ubuntu 22.04 LTS** (la más estable para Easypanel)
4. Confirma la reinstalación
5. **ANOTA LA NUEVA CONTRASEÑA ROOT** que te dará Contabo (la necesitarás)

⏱️ El formateo tarda 5-10 minutos. Recibirás un email cuando termine.

---

## FASE 2: PRIMER ACCESO AL VPS LIMPIO

### Paso 2.1: Conectarse por SSH
Desde tu terminal (PowerShell en Windows):

```bash
ssh root@TU_IP_DEL_VPS
```

- Usa la contraseña que te dio Contabo
- Si te pregunta "Are you sure you want to continue?", escribe `yes`

### Paso 2.2: Actualizar el Sistema
Ejecuta estos comandos uno por uno:

```bash
apt update
apt upgrade -y
apt install curl git -y
```

---

## FASE 3: INSTALACIÓN DE EASYPANEL

### Paso 3.1: Comando de Instalación
Ejecuta este comando mágico (oficial de Easypanel):

```bash
curl -sSL https://get.easypanel.io | sh
```

⏱️ Tarda 5-10 minutos. Verás muchas líneas de instalación de Docker y otros componentes.

### Paso 3.2: Primer Acceso a Easypanel
1. Al terminar, te dará una URL tipo: `http://TU_IP:3000`
2. Abre esa URL en tu navegador
3. **CREA TU USUARIO ADMIN INMEDIATAMENTE**
   - Email: tu email
   - Contraseña: algo seguro (guárdala)

---

## FASE 4: CONFIGURACIÓN DE DNS (IMPORTANTE)

### Paso 4.1: Apuntar tu dominio al VPS
Ve al panel de tu proveedor de dominio (donde compraste `agentes.space`) y crea estos registros DNS:

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | @ | LA_IP_DE_TU_VPS | 3600 |
| A | * | LA_IP_DE_TU_VPS | 3600 |
| CNAME | www | agentes.space | 3600 |
| CNAME | manager | agentes.space | 3600 |
| CNAME | api | agentes.space | 3600 |
| CNAME | chat | agentes.space | 3600 |

⏱️ Los DNS tardan 10-60 minutos en propagarse.

### Paso 4.2: Configurar Easypanel con tu dominio
1. Dentro de Easypanel → Settings → General
2. En "Panel URL", pon: `https://panel.agentes.space`
3. Guarda

---

## FASE 5: INSTALACIÓN DE APLICACIONES

### 5.1: Crear el Proyecto
1. Easypanel → Projects → Create Project
2. Nombre: `Neurova` (o el que prefieras)

---

### 5.2: Instalar n8n (El Cerebro)

1. Dentro del proyecto → Add Service → Templates
2. Busca: **n8n**
3. Settings:
   - **Name**: `n8n`
   - **Domain**: `manager.agentes.space`
4. Environment Variables (automáticas, pero verifica):
   - `N8N_HOST`: `manager.agentes.space`
   - `N8N_PROTOCOL`: `https`
   - `WEBHOOK_URL`: `https://manager.agentes.space/`
5. Deploy

⏱️ En 2-3 minutos estará listo.

**Al terminar:**
- Entra a `https://manager.agentes.space`
- Crea tu usuario admin de n8n
- Importa tus workflows guardados (si los exportaste antes)

---

### 5.3: Instalar Chatwoot (Atención al Cliente)

1. Add Service → Templates → Busca: **Chatwoot**
2. Settings:
   - **Name**: `chatwoot`
   - **Domain**: `chat.agentes.space`
3. Environment Variables (la plantilla las configura automáticas):
   - `POSTGRES_PASSWORD`: (se genera automática)
   - `REDIS_PASSWORD`: (se genera automática)
4. Deploy

⏱️ Tarda 3-5 minutos (es pesado).

**Al terminar:**
- Entra a `https://chat.agentes.space`
- Crea tu cuenta admin

---

### 5.4: Instalar Evolution API (WhatsApp)

1. Add Service → Custom (Docker Image)
2. Settings:
   - **Name**: `evolution-api`
   - **Image**: `atendai/evolution-api:v2.1.1`
   - **Domain**: `api.agentes.space`
   - **Port**: `8080`
3. Environment Variables (IMPORTANTES):
   ```
   AUTHENTICATION_API_KEY=TuClaveSecuraAqui2026
   SERVER_URL=https://api.agentes.space
   ```
4. Deploy

**Al terminar:**
- Entra a `https://api.agentes.space`
- Usa el API_KEY que creaste para autenticarte

---

### 5.5: Instalar tu Landing Page (agentes.space)

#### OPCIÓN A: Desde GitHub (RECOMENDADO)

1. Sube tu carpeta `neurova/agency/` a un repo de GitHub
2. Add Service → GitHub
3. Conecta tu cuenta de GitHub
4. Selecciona el repo
5. Build Settings:
   - **Build Method**: Dockerfile
   - **Context**: `/`
   - **Dockerfile**: `Dockerfile`
6. Domain: `agentes.space`
7. Deploy

#### OPCIÓN B: Build Local + Docker Registry (si no usas GitHub)

Te ayudaré con esto si lo necesitas, pero GitHub es más fácil.

---

## FASE 6: RECONEXIÓN DE WEBHOOKS

### 6.1: Obtener nueva URL de Webhook de n8n
1. Entra a n8n (`manager.agentes.space`)
2. Crea un workflow nuevo o abre uno existente
3. Agrega un nodo **Webhook**
4. Copia la URL que te da (algo como: `https://manager.agentes.space/webhook/abc123...`)

### 6.2: Actualizar el script.js de tu landing
1. En tu PC, abre: `neurova/agency/script.js`
2. En la línea 7, reemplaza el webhook viejo por el nuevo:
   ```javascript
   const webhookUrl = "https://manager.agentes.space/webhook/TU_NUEVO_UUID";
   ```
3. Guarda y haz commit + push a GitHub (si usas método A)
4. Easypanel redeplegará automáticamente

---

## FASE 7: VERIFICACIÓN FINAL

### Checklist:
- [ ] `https://agentes.space` → Landing carga correctamente
- [ ] `https://manager.agentes.space` → n8n funciona
- [ ] `https://chat.agentes.space` → Chatwoot funciona
- [ ] `https://api.agentes.space` → Evolution API responde
- [ ] Formulario de landing envía datos a n8n sin errores
- [ ] SSL (candadito verde) en todos los dominios

---

## PROBLEMAS COMUNES Y SOLUCIONES

### Error: "502 Bad Gateway"
- **Causa**: La app no terminó de iniciar
- **Solución**: Espera 2-3 minutos más

### Error: "Certificate Error" (SSL)
- **Causa**: DNS no ha propagado o Let's Encrypt no pudo validar
- **Solución**: 
  1. Verifica que los DNS apunten a la IP correcta
  2. Easypanel → Service → Settings → Enable SSL
  3. Espera 5-10 minutos

### Landing no se actualiza después de cambios
- **Solución**: Easypanel → Service → Redeploy

---

## COMANDOS ÚTILES PARA DEBUGGING (SSH)

```bash
# Ver logs de Easypanel
docker logs easypanel

# Ver todos los contenedores corriendo
docker ps

# Ver uso de recursos
htop

# Reiniciar un servicio específico
docker restart NOMBRE_DEL_CONTENEDOR
```

---

## CONTACTOS DE EMERGENCIA

- **Soporte Easypanel**: https://easypanel.io/docs
- **Soporte Contabo**: Panel → Tickets
- **n8n Community**: https://community.n8n.io

---

## TIEMPOS ESTIMADOS TOTALES

| Fase | Tiempo |
|------|--------|
| Formateo VPS | 10 min |
| Instalación Easypanel | 10 min |
| Configuración DNS | 30 min (propagación) |
| Instalación de apps | 15 min |
| Configuración y pruebas | 20 min |
| **TOTAL** | **~1.5 horas** |

---

**¡Éxito, Gustavo!** 🚀

Guarda este documento. Cuando termines de formatear, sigue cada paso en orden y en menos de 2 horas tendrás todo funcionando limpio y sin errores.
