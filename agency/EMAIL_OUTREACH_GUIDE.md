# Sistema de Email Outreach - Guía Completa

## 📧 3 Workflows Sincronizados

### 1. Cold Email Sender (`cold_email_sender.json`)
**Ejecuta:** Diario 10:00 AM
**Función:** Envío inicial
- Lee Google Sheet "leads_outreach"
- Filtra estado "Pendiente"
- Limita a 10 emails/día
- Detecta industria (Inmobiliaria vs Hotel)
- Aplica template correcto
- Marca como "Enviado" + timestamp

### 2. Follow-up Automation (`email_followup.json`)
**Ejecuta:** Diario 11:00 AM
**Función:** Seguimiento automático
- Lee leads con estado "Enviado"
- Calcula días desde primer envío
- **Día 3:** Email suave ("¿mal timing?")
- **Día 7:** Email final con video demo
- Actualiza estado a "Follow-up 1" o "Follow-up 2"

### 3. Manual Response Tracker (Opcional)
**Función:** Marcar manualmente los que respondieron
- Cuando alguien responde → cambiar estado a "Interesado"
- Esto evita que sigan recibiendo follow-ups

---

## 🗂️ Estructura Google Sheet

**Nombre:** `Leads Outreach`

**Columnas:**
```
Nombre | Empresa | Email | Industria | Pais | Ciudad | Estado | Fecha_Envio | Ultimo_Contacto | Notas
```

**Estados posibles:**
1. `Pendiente` → Para envío inicial
2. `Enviado` → Primer email enviado
3. `Follow-up 1` → Email día 3 enviado
4. `Follow-up 2 (Final)` → Email día 7 enviado
5. `Interesado` → Respondió (marcar manual)
6. `No Interesado` → Rechazó (marcar manual)
7. `Demo Agendada` → Aceptó reunión (marcar manual)

---

## ⚙️ Setup Paso a Paso

### Paso 1: Google Sheet
1. Subir `leads_outreach.csv` a Google Sheets
2. Agregar columna adicional: `Ultimo_Contacto`
3. Copiar Sheet ID de la URL

### Paso 2: Importar Workflows n8n
1. Importar `cold_email_sender.json`
2. Importar `email_followup.json`
3. En AMBOS workflows:
   - Reemplazar `YOUR_SHEET_ID`
   - Configurar Gmail credentials
   - Configurar Google Sheets credentials

### Paso 3: Llenar Leads
**Argentina (Inmobiliarias):**
- Google Maps: "inmobiliaria [ciudad]"
- LinkedIn: buscar "agente inmobiliario"
- Zonaprop: contactos en listings

**Austria (Hotels):**
- Booking.com: copiar emails de contacto
- Google: "boutique hotel [ciudad] kontakt"
- Instagram: hoteles pequeños (3-4 estrellas)

### Paso 4: Testing
1. Crear 1 lead de prueba con tu email
2. Estado: "Pendiente"
3. Trigger manual "cold_email_sender"
4. Verificar recepción
5. Cambiar Fecha_Envio a hace 3 días
6. Trigger manual "email_followup"
7. Verificar follow-up recibido

### Paso 5: Activar
1. Activar ambos workflows
2. Monitorear Sheet diariamente
3. Marcar estados manualmente cuando respondan

---

## 📊 Métricas Esperadas

**Secuencia completa:**
```
100 Leads → 10 enviados/día → 10 días completos
├─ Día 1: 10 emails iniciales
├─ Día 4: 10 follow-ups (día 3)
├─ Día 8: 10 follow-ups finales (día 7)
└─ Día 10: Nueva tanda
```

**Conversion funnel:**
- 100 emails → 40 abiertos (40%)
- 40 abiertos → 12 replies (30%)
- 12 replies → 4 demos (33%)
- 4 demos → 1-2 clientes (25-50%)

**Timeline:**
- Semana 1: 30 contactos iniciales
- Semana 2: Follow-ups + 40 nuevos
- Semana 3: Primeras demos
- Semana 4: Primer cliente cerrado

---

## 🎯 Optimización Continua

### A/B Testing
Cada 2 semanas, prueba:
- **Asunto:** Cambiar una palabra clave
- **Body:** Ajustar CTA (call-to-action)
- **Timing:** 10am vs 3pm (cambiar cron)

### Tracking Manual
Agrega en Sheet (columna Notas):
- "Abrió pero no respondió"
- "Rechazó: ya tiene sistema"
- "Rechazó: sin presupuesto"
- "Respondió: pedir más info"

### Segmentación
Separa sheets por región/industria:
- `leads_argentina` (inmobiliarias)
- `leads_austria` (hotels)
- Templates específicos para cada uno

---

## 🚨 Buenas Prácticas

### Email Deliverability
✅ Máximo 10-15 emails/día (ya configurado)
✅ Usar dominio propio (gustavo@generarise.space)
✅ No usar palabras spam: "gratis", "garantizado", "dinero"
✅ Personalizar SIEMPRE el nombre

### GDPR (Europa)
✅ Agregar opt-out en cada email
✅ Texto: "Para dejar de recibir emails, responde 'UNSUB'"
✅ Borrar datos si lo solicitan

### Follow-up Etiquette
❌ No enviar más de 2 follow-ups
❌ No ser agresivo en día 7
✅ Ofrecer valor (video demo)
✅ Dar opción de salida clara

---

## 🎬 Próximo Paso: Video Demo

**Para email día 7, necesitas crear:**

1. **Loom video (90 seg):**
   - 0-15s: "Hola, Gustavo de GenerArise"
   - 15-45s: Demo en vivo (chatbot respondiendo)
   - 45-75s: Case study rápido (números)
   - 75-90s: CTA ("Responde si querés probarlo")

2. **URL estructura:**
   - `loom.com/share/demo-generarise-inmobiliaria`
   - `loom.com/share/demo-generarise-hotel`

3. **Reemplazar en workflow:**
   - Editar nodo "Template Día 7"
   - Cambiar URL placeholder por tu Loom real

---

## 📈 Dashboard (Opcional)

Crea en Google Sheets (nueva pestaña):
```
=COUNTIF(leads_outreach!G:G, "Enviado")        → Total enviados
=COUNTIF(leads_outreach!G:G, "Interesado")     → Total interesados
=COUNTIF(leads_outreach!G:G, "Demo Agendada")  → Demos
=COUNTIF(leads_outreach!G:G, "Interesado") / COUNTIF(leads_outreach!G:G, "Enviado") → Reply Rate %
```

**Bonus:** Conectar a Google Data Studio para gráficos automáticos
