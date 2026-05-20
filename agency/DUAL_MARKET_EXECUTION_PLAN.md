# Plan de Ejecución Dual: Argentina + Austria

## 🎯 Objetivo: 5 Clientes en 60 Días

**Target:**
- 3 clientes Argentina ($500-800/mes c/u) = $1,500-2,400/mes
- 2 clientes Austria (€900-1,500/mes c/u) = €1,800-3,000/mes (~$2,000-3,300)
- **Total: $3,500-5,700/mes en 60 días**

---

## 📅 Semana 1-2: Setup + Primera Ola

### Día 1-2: Preparación
- [ ] Configurar Gmail `agentes.space@gmail.com` en n8n
- [ ] Importar 3 workflows:
  - `cold_email_sender.json`
  - `email_followup.json`
  - Configurar credenciales
- [ ] Crear 2 Google Sheets:
  - `leads_argentina` (inmobiliarias)
  - `leads_austria` (hotels)

### Día 3-5: Research & Leads
**Argentina (50 inmobiliarias):**
- LinkedIn: "inmobiliaria Buenos Aires" (20 leads)
- LinkedIn: "inmobiliaria Córdoba" (15 leads)
- LinkedIn: "inmobiliaria Rosario" (15 leads)
- Google Maps: copiar emails de contacto

**Austria (30 hotels):**
- Booking.com: hoteles 4-5 estrellas Vienna (10 leads)
- Booking.com: hoteles boutique Salzburg (10 leads)
- Google: "boutique hotel austria contact" (10 leads)
- Filtrar: solo los que tienen email en inglés en su web

### Día 6-7: Lanzamiento
- [ ] Cargar 50 leads Argentina → Estado: Pendiente
- [ ] Cargar 30 leads Austria → Estado: Pendiente
- [ ] Activar workflows
- [ ] **80 emails saldrán en 8 días** (10/día automático)

---

## 📊 Semana 3-4: Follow-ups + Primeras Demos

### Actividades Automáticas
- Workflow envía follow-ups día 3 y 7
- Monitorear Google Sheets diariamente
- Marcar manualmente: "Interesado", "Demo Agendada"

### Actividades Manuales
**Cuando respondan:**
1. Reply en <2 horas
2. Ofrecer demo 20 min (Zoom/Google Meet)
3. Agendar en calendario
4. Preparar demo específica para su industria

**Demo Structure (20 min):**
- 0-5 min: Problema actual (consultas perdidas)
- 5-15 min: Demo en vivo (chatbot respondiendo)
- 15-20 min: Pricing + siguiente paso

### Métricas Esperadas Semana 3-4
- 80 emails enviados
- 28-32 abiertos (35-40%)
- 8-12 replies (10-15% de abiertos)
- 3-5 demos agendadas
- **1-2 cierres** 🎯

---

## 💰 Semana 5-6: Primeros Clientes + Segunda Ola

### Clientes Piloto
**Pricing introductorio:**
- Argentina: $497/mes (primeros 3 clientes)
- Austria: €797/mes (primeros 2 clientes)

**Setup cliente:**
1. WhatsApp Business API (Evolution API)
2. Configurar número cliente
3. Entrenar chatbot con sus FAQs
4. Deploy en 3-5 días
5. Monitoreo primera semana

### Segunda Ola Outreach
- [ ] Agregar 50 nuevos leads Argentina
- [ ] Agregar 30 nuevos leads Austria
- [ ] Repetir proceso semanas 1-2

---

## 🎬 Semana 7-8: Escalar + Refinar

### Con 2-3 clientes activos:
- Pedir testimonios
- Crear case studies reales
- Actualizar email templates con números reales
- Subir pricing:
  - Argentina: $797/mes
  - Austria: €997/mes

### Refinar Outreach
**A/B Testing:**
- Probar 2 subject lines diferentes
- Trackear cuál convierte mejor
- Optimizar body del email

**Video Demo:**
- Grabar Loom 90 seg con cliente real
- Agregar a follow-up día 7
- Mejora conversion 30-50%

---

## 📋 Checklist Semanal

### Lunes
- [ ] Review Google Sheets (nuevas respuestas?)
- [ ] Responder todos los emails pendientes
- [ ] Agregar 10 nuevos leads si quedan <20

### Miércoles
- [ ] Agendar demos de la semana
- [ ] Preparar materiales demo
- [ ] Follow-up manual a "interesados sin demo"

### Viernes
- [ ] Review métricas semana:
  - Emails enviados
  - Open rate
  - Reply rate
  - Demos agendadas
  - Cierres
- [ ] Ajustar templates si necesario
- [ ] Planear siguiente semana

---

## 🔧 Workflows Configuración Final

### cold_email_sender.json
**Modificar para dual market:**
1. Nodo "Es Hotel?" debe detectar también país
2. Si Hotel + Austria → Template EN
3. Si Inmobiliaria + Argentina → Template ES

### Agregar nodo condicional:
```javascript
// Después de "Preparar Data", antes de templates
if ($json.industria === 'Hotel' && $json.pais === 'Austria') {
  // Template EN (Austria)
} else if ($json.industria === 'Inmobiliaria' && $json.pais === 'Argentina') {
  // Template ES (Argentina)
}
```

---

## 📊 KPIs a Trackear

### Semana 1-2
- ✅ 80 leads cargados
- ✅ Workflows configurados
- ✅ Primeros 40 emails enviados

### Semana 3-4
- 🎯 8-12 replies
- 🎯 3-5 demos agendadas
- 🎯 1-2 clientes cerrados

### Semana 5-6
- 🎯 3-4 clientes activos total
- 🎯 $2,000-3,000/mes MRR
- 🎯 Segunda ola outreach lanzada

### Semana 7-8
- 🎯 5+ clientes activos
- 🎯 $3,500-5,700/mes MRR
- 🎯 Case studies documentados
- 🎯 Pipeline de 10+ demos/mes

---

## 💡 Quick Wins

### Día 1
- Configurar `agentes.space@gmail.com` en n8n
- Importar workflows
- Test email a ti mismo

### Día 3
- 10 leads Argentina cargados
- Primer batch emails enviados
- Verificar llegaron correctamente

### Día 7
- 50 leads Argentina + 30 Austria cargados
- Sistema corriendo 100% automático
- Primera respuesta (estadísticamente probable)

### Día 14
- Primera demo agendada
- Follow-ups automáticos funcionando
- Ajustes a templates basado en feedback

### Día 30
- Primer cliente cerrado 🎉
- Cash flow positivo
- Momentum para escalar

---

## 🚨 Riesgos & Mitigación

**Riesgo 1:** No responden
- **Mitigación:** Probar diferentes subject lines cada semana

**Riesgo 2:** Responden en alemán (Austria)
- **Mitigación:** Reply "English works better, can we switch?"

**Riesgo 3:** Piden demo pero no cierran
- **Mitigación:** Ofrecer "14 días gratis, si funciona me pagás"

**Riesgo 4:** Setup técnico demora
- **Mitigación:** Tener checklist pre-hecha, 1 setup = template para resto

---

## 🎯 Success Criteria (60 días)

**Mínimo viable:**
- ✅ 3 clientes pagando
- ✅ $2,000/mes MRR
- ✅ Sistema outreach automático funcionando

**Target óptimo:**
- 🚀 5 clientes pagando
- 🚀 $3,500-5,700/mes MRR
- 🚀 Pipeline de 20+ leads calientes
- 🚀 1 case study documentado

**Dream scenario:**
- 💰 7+ clientes
- 💰 $6,000+/mes MRR
- 💰 Referrals orgánicos empezando
- 💰 Contratar primer VA/freelancer

---

## 📞 Next Steps (Mañana)

1. **9:00 AM:** Config Gmail en n8n (30 min)
2. **10:00 AM:** Importar workflows (30 min)
3. **11:00 AM:** Test email a ti mismo (15 min)
4. **14:00 PM:** Research 10 leads Argentina (1 hora)
5. **15:00 PM:** Research 10 leads Austria (1 hora)
6. **16:00 PM:** Cargar en Sheet + activar workflow (30 min)

**Resultado día 1:** 20 leads cargados, primeros 10 emails se envían automáticamente mañana a las 10am.

Let's go! 🚀
