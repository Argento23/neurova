# Setup Guide: AI Appointment Setter

## 🎯 Resumen del Sistema

Este workflow automatiza completamente el proceso de appointment setting:

1. **Lead llega** (Phantombuster, Apollo, formulario web)
2. **IA califica** con scoring BANT (Budget, Authority, Need, Timeline)
3. **Email automático** con link Calendly (solo leads A y B)
4. **Lead agenda** en Calendly del cliente
5. **Cliente recibe notificación** inmediata
6. **Reminders automáticos** (24hs + 1 hora antes)

---

## 📋 Requisitos Previos

### 1. Tools Necesarios

| Tool | Precio | Uso |
|------|--------|-----|
| n8n | $0-20/mes | Workflow engine |
| Groq AI | $0 | Calificación leads |
| Calendly | $12-20/mes | Booking (cuenta del cliente) |
| Google Sheets | $0 | CRM simple |
| Gmail | $0 | Emails |
| Phantombuster | $60/mes | LinkedIn scraping (opcional) |
| Apollo.io | $49/mes | Database B2B (opcional) |

**Total:** $121-149/mes para operar múltiples clientes

### 2. Credentials en n8n

- [x] Groq API Key
- [x] Gmail OAuth2
- [x] Google Sheets OAuth2
- [x] Calendly webhook URL

---

## 🔧 Setup Paso a Paso

### PASO 1: Importar Workflow

1. Abrir n8n
2. Import workflow → Seleccionar `PRODUCT_appointment_setter.json`
3. Activar workflow

### PASO 2: Configurar Nodo CONFIG

Personalizar para cada cliente:

```javascript
{
  cliente_nombre: "Agencia XYZ",
  servicio: "Marketing Digital / Google Ads",
  icp_criteria: `
    - Empresa 10-100 empleados
    - Industria: ecommerce, retail
    - Presupuesto ads: $50K+/mes
    - Ya usan ads (buscan mejorar)
  `,
  calendly_link: "https://calendly.com/cliente/reunion-30min",
  email_cliente: "ventas@cliente.com"
}
```

### PASO 3: Crear Google Sheet CRM

**Nombre:** `leads_pipeline`

**Columnas:**
```
Fecha | Nombre | Empresa | Email | Cargo | Score_Total | Tier | Estado | Reasoning | Fecha_Reunion | Calendly_URI
```

**Sheet ID:** Copiar de URL y pegar en workflow (2 nodos: "Log en CRM" y "Actualizar CRM")

### PASO 4: Setup Calendly Webhook

1. Ir a Calendly → Account Settings → Webhooks
2. Create webhook
3. URL: `https://tu-n8n.com/webhook/calendly-booked`
4. Events: `invitee.created`
5. Save

### PASO 5: Conectar Fuente de Leads

**Opción A: Phantombuster (LinkedIn)**
```
Phantombuster → LinkedIn Search Export → 
Webhook n8n → Workflow procesa
```

**Opción B: Apollo.io (Email lists)**
```
Apollo → Export CSV → 
Upload Google Sheets →
n8n lee Sheet → Workflow procesa
```

**Opción C: Formulario Web**
```
Website contact form →
Webhook n8n directamente
```

---

## 🧪 Testing

### Test 1: Lead Calificado (Tier A)

**POST a webhook:** `https://tu-n8n.com/webhook/new-lead`

**Body JSON:**
```json
{
  "nombre": "Juan Pérez",
  "empresa": "Ecommerce SA",
  "email": "juan@ecomm.com",
  "cargo": "CMO",
  "industria": "Ecommerce",
  "linkedin_url": "linkedin.com/in/juanperez"
}
```

**Resultado esperado:**
- ✅ Score BANT: 8-10
- ✅ Tier: A
- ✅ Email enviado con Calendly
- ✅ Lead en Sheet con estado "Email Enviado"

---

### Test 2: Lead No Calificado (Tier C)

**Body JSON:**
```json
{
  "nombre": "María López",
  "empresa": "Kiosco Barrio",
  "email": "maria@kiosco.com",
  "cargo": "Dueña",
  "industria": "Retail",
  "linkedin_url": ""
}
```

**Resultado esperado:**
- ✅ Score BANT: <6
- ✅ Tier: C
- ✅ NO email enviado
- ✅ Lead en Sheet con estado "No Calificado"
- ✅ Va a nurturing campaign (future feature)

---

### Test 3: Calendly Booking

1. Cliente test agenda reunión en Calendly
2. Webhook dispara a n8n

**Resultado esperado:**
- ✅ CRM actualizado: "Reunión Agendada"
- ✅ Email notificación al cliente
- ✅ Fecha reunión guardada

---

### Test 4: Reminders Automáticos

**Simular:** Crear lead con reunión mañana

**Resultado esperado:**
- ✅ Cron ejecuta diario 9 AM
- ✅ Detecta reunión en 24hs
- ✅ Envía reminder al lead
- ✅ 1 hora antes → otro reminder

---

## 📊 Métricas a Trackear

### KPIs Principales

| Métrica | Meta | Fórmula |
|---------|------|---------|
| Leads procesados | 100+/mes | Total entradas webhook |
| Tasa calificación | 30-40% | Tier A+B / Total |
| Email open rate | 40-50% | Opens / Enviados |
| Click Calendly | 25-35% | Clicks / Opens |
| Booking rate | 15-25% | Agendados / Clicks |
| Show-up rate | 70-80% | Se presentaron / Agendados |

### Dashboard Google Sheets

Crear tab "Métricas":

```
=COUNTIF(leads_pipeline!G:G, "Email Enviado")  // Emails enviados
=COUNTIF(leads_pipeline!G:G, "Reunión Agendada")  // Meetings booked
=COUNTIF(leads_pipeline!F:F, "A")  // Tier A leads
```

---

## 🔄 Flujos Adicionales (Próximos)

### 1. Nurturing Campaign (Leads C)
```
Lead Tier C → 
Email secuencia 7 días (educación valor) →
Re-calificar después de 30 días
```

### 2. Follow-up No Shows
```
Lead no se presenta →
Email: "Te perdimos! Reprogramar?" →
Si no responde en 3 días → nurturing
```

### 3. Post-Meeting Qualification
```
24hs después reunión →
Email cliente: "¿Se presentó? ¿Calidad 1-10?" →
Feedback mejora scoring IA
```

---

## 💰 Pricing para Clientes

### Modelo Recomendado: Fee Fijo

**Tier Básico: $1,497/mes**
- 10-15 citas calificadas garantizadas
- Setup incluido
- Soporte email

**Tier Pro: $1,997/mes**
- 15-20 citas garantizadas
- + Follow-up no-shows
- + Reportes semanales
- Soporte prioritario

**Tier Enterprise: $2,997/mes**
- 25+ citas
- + Nurturing campaign
- + Multi-servicio (si cliente ofrece varios)
- Dedicated support

### Garantía
> "Si no entregamos mínimo X citas calificadas en 30 días, siguiente mes gratis"

---

## 🚀 Onboarding Nuevo Cliente (7 días)

**Día 1-2:**
- [ ] Kick-off call (30 min)
- [ ] Definir ICP preciso
- [ ] Recolectar: Calendly link, email, servicio
- [ ] Acceso a lead sources (Phantombuster/Apollo)

**Día 3-4:**
- [ ] Clonar workflow
- [ ] Personalizar CONFIG
- [ ] Setup Google Sheet CRM
- [ ] Conectar Calendly webhook

**Día 5:**
- [ ] Testing end-to-end (3 leads simulados)
- [ ] Ajustar scoring si necesario

**Día 6:**
- [ ] Lanzar primer batch (50 leads)
- [ ] Monitor primeras 24hs

**Día 7:**
- [ ] Review métricas iniciales
- [ ] Ajustes finales
- [ ] GO LIVE completo

---

## ⚠️ Common Issues & Solutions

### Issue: Scoring muy agresivo (todos Tier A)
**Solución:** Ajustar ICP criteria en CONFIG, ser más específico

### Issue: Emails van a spam
**Solución:** 
- Calentar dominio (enviar 10-20/día primeros días)
- SPF/DKIM configurados
- Personalizar más subject lines

### Issue: Low booking rate (<10%)
**Solución:**
- Revisar email copy (A/B test)
- Ofrecer incentivo (free audit, etc.)
- Reducir fricción (calendario más abierto)

### Issue: High no-show rate (>30%)
**Solución:**
- Aumentar personalización email inicial
- Agregar 2do reminder (2 horas antes)
- SMS reminder (costo extra)

---

## 📞 Soporte

**Para:** issues técnicos, ajustes workflow
**Email:** agentes.space@gmail.com
**Response time:** 24-48hs

---

## 🎯 Next Steps

1. Importar workflow a n8n
2. Configurar CONFIG con cliente piloto
3. Setup Google Sheet
4. Testing completo
5. Lanzar con 50 leads
6. Monitor & iterate

**Tiempo estimado setup:** 4-6 horas

¿Dudas? Escríbeme! 🚀
