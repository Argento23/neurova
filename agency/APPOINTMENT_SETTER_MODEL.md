# AI Appointment Setter - Modelo de Negocio

## 🎯 ¿A Quiénes Ofrecer?

### Tier 1: Servicios de Alto Ticket (MEJORES CLIENTES) 💰💰💰

#### 1. **Agencias de Marketing/Publicidad**
- **Pain Point:** Necesitan reuniones constantes con potenciales clientes
- **Ticket promedio consulta:** $50K-200K (campañas)
- **Valor de 1 cita:** $5K-15K
- **Pricing sugerido:** $1,497/mes + $150-300 por cita calificada

#### 2. **Consultoras (IT, Management, Legal)**
- **Pain Point:** Equipo senior pierde tiempo en prospección
- **Ticket promedio consulta:** $100K-500K (proyectos)
- **Valor de 1 cita:** $10K-25K
- **Pricing sugerido:** $1,997/mes + $200-400 por cita

#### 3. **Software B2B (SaaS)**
- **Pain Point:** Ciclo de venta largo, necesitan demos constantes
- **Ticket promedio:** $1K-10K/mes (MRR)
- **Valor de 1 cita:** $2K-8K (LTV)
- **Pricing sugerido:** $1,297/mes + $100-250 por demo agendada

#### 4. **Coaches/Mentores de Alto Ticket**
- **Pain Point:** No tienen equipo, hacen todo solos
- **Ticket promedio:** $5K-50K (programas)
- **Valor de 1 cita:** $1K-5K
- **Pricing sugerido:** $997/mes + $150-300 por llamada calificada

#### 5. **Real Estate Comercial/Desarrolladores**
- **Pain Point:** Proyectos grandes, pocos deals pero alto valor
- **Ticket promedio:** $500K-5M (propiedades)
- **Valor de 1 cita:** $20K-100K
- **Pricing sugerido:** $2,497/mes + $500-1,000 por reunión

---

### Tier 2: Servicios Profesionales (BUEN VOLUMEN) 💰💰

#### 6. **Estudios Contables (servicios corporativos)**
- Prospección a PYMEs que necesitan externalizar contabilidad
- **Pricing:** $797/mes + $80-150 por cita

#### 7. **Estudios Jurídicos Especializados**
- Solo para áreas específicas (corporativo, M&A, laboral empresas)
- **Pricing:** $997/mes + $100-200 por consulta

#### 8. **Clínicas de Estética/Medicina Estética**
- Tratamientos de alto valor (implantes, cirugías, etc.)
- **Pricing:** $797/mes + $100-200 por consulta

---

## 💰 Modelos de Pricing

### Opción 1: **Fee Fijo Mensual** (TU IDEA - LA MÁS SIMPLE) ✅

**Modelo:**
- Fee mensual fijo: $997-2,497/mes
- Sin costo adicional por cita
- Garantía mínima de citas: 8-15/mes

**Ventajas:**
- ✅ Predecible para el cliente
- ✅ Fácil de vender ("sabes cuánto pagas cada mes")
- ✅ No hay discusiones sobre calificación de leads
- ✅ Ingreso recurrente garantizado

**Desventajas:**
- ⚠️ Cliente puede no valorar suficiente si no convierte
- ⚠️ Techo de ingresos (no escalas con resultados)

**Mejor para:**
- Clientes nuevos (menos riesgo percibido)
- Servicios mid-ticket ($5K-50K)
- Cuando quieres cash flow predecible

---

### Opción 2: **Fee Base + Por Cita** (HÍBRIDO) 💎

**Modelo:**
- Fee base: $497-997/mes (cubre operación)
- Por cita calificada que se presenta: $150-500
- Meta: 10-20 citas/mes

**Ventajas:**
- ✅ Upside ilimitado (más citas = más $)
- ✅ Alineado con resultados del cliente
- ✅ Fee base cubre tus costos

**Desventajas:**
- ⚠️ Necesitas definir "cita calificada"
- ⚠️ Puede haber disputas si cliente cancela

**Mejor para:**
- Clientes de alto ticket (>$50K deals)
- Cuando tienes confianza en conversión
- Clientes que ya conocen el modelo

---

### Opción 3: **Solo Comisión** (RIESGOSO PERO ALTO UPSIDE) 🚀

**Modelo:**
- $0 fee mensual
- 10-20% del deal cerrado
- O $500-2,000 por cita que cierra

**Ventajas:**
- ✅ Súper fácil de vender ("no pagas si no cierras")
- ✅ Upside MASIVO en deals grandes

**Desventajas:**
- ⚠️ Depende 100% del cierre del cliente
- ⚠️ Ciclos de venta largos = $0 por meses
- ⚠️ Difícil de escalar (no hay base recurrente)

**Mejor para:**
- Entrar a clientes premium
- Cuando el cliente es escéptico
- Real estate / deals >$100K

---

## 🤖 Cómo Funciona el Workflow

### Flujo Completo: Outbound → Calificación → Agendamiento

```
1. PROSPECCIÓN (Automatizada)
   ↓
   LinkedIn scraping → Encuentra 100 prospectos/día
   ↓
   Email/LinkedIn outreach → 50 mensajes/día
   ↓
   Respuestas positivas → Webhook a n8n

2. CALIFICACIÓN (IA + Humano)
   ↓
   IA hace preguntas calificadoras:
   - Presupuesto disponible
   - Timeline de decisión
   - Autoridad (es el decision maker?)
   - Necesidad (problema claro?)
   ↓
   Score: A (hot), B (warm), C (cold)

3. AGENDAMIENTO (Automático)
   ↓
   Si score A o B:
   - Enviar Calendly del cliente
   - Confirmar fecha/hora
   - Reminder automático 24hs antes
   - Reminder 1 hora antes
   ↓
   Notificar cliente (email + Slack/WhatsApp)

4. POST-CITA
   ↓
   24hs después:
   - Email cliente: "¿Se presentó? ¿Calidad del lead?"
   - Ajustar scoring si feedback negativo
   - Iterar prompts de calificación
```

---

## 📊 Ejemplo Real: Agencia de Marketing

**Cliente:** Agencia de performance marketing (Google Ads, Meta Ads)
**Ticket promedio proyecto:** $80,000
**Tasa de cierre:** 25% (1 de cada 4 citas cierra)

**Modelo Fee Fijo:**
- Costo mensual: $1,497
- Citas agendadas/mes: 12
- Citas que se presentan: 10 (83%)
- Deals cerrados: 2.5 (25% de 10)
- Revenue cliente: $200,000/mes
- **ROI cliente: 13,300%** 🤯

**Tu margen:**
- Cobras: $1,497/mes
- Costos operación: $150/mes (AI + software)
- **Profit: $1,347/mes (90%)**

---

## 🎯 Nicho Ideal para Empezar

### **RECOMENDACIÓN: Agencias de Marketing Digital**

**Por qué son perfectos:**
1. ✅ Entienden el valor de automatización
2. ✅ Necesitan leads SIEMPRE (churn alto en clientes)
3. ✅ Ticket alto ($50K-200K proyectos)
4. ✅ Ciclo de venta corto (2-4 semanas)
5. ✅ Hay 5,000+ agencias en Argentina

**Pitch para agencias:**
> "Generamos 10-15 reuniones calificadas/mes con empresas que 
> necesitan Google/Meta Ads. Fee fijo $1,497/mes.
> Si no entregamos mínimo 10 citas, mes gratis."

---

## 📋 Stack Tecnológico

### Herramientas Necesarias

1. **Prospección:**
   - Phantombuster (LinkedIn/email scraping): $60/mes
   - Apollo.io (B2B database): $49/mes
   - Hunter.io (email finder): $49/mes

2. **Outreach:**
   - Instantly.ai (cold email): $37/mes
   - LinkedIn Sales Navigator: $80/mes

3. **Calificación:**
   - n8n + Groq AI: $0-20/mes
   - Typeform (forms): $35/mes

4. **Agendamiento:**
   - Calendly (cliente usa su cuenta): $0
   - O Cal.com (open source): $0

5. **CRM/Tracking:**
   - Google Sheets: $0
   - O Pipedrive: $15/mes

**Total costos:** $150-250/mes
**Con 3 clientes @ $1,497:** = $4,491/mes revenue
**Profit:** $4,000+/mes (90% margen) 💰

---

## 🚀 Proceso de Venta

### 1. Identificar Cliente Ideal
Target: Agencias 5-20 empleados (sweet spot)

### 2. Cold Email
**Subject:** "15 reuniones/mes con CMOs que necesitan ads"

**Body:**
> Hola {{Nombre}},
> 
> Vi que {{Agencia}} hace performance marketing.
> 
> Tengo un sistema que te genera 10-15 reuniones/mes con empresas
> que ya decidieron invertir en Google/Meta Ads (solo buscan agencia).
> 
> - 100% automatizado con IA
> - Leads pre-calificados (presupuesto + timeline)
> - Fee fijo $1,497/mes (no comisiones)
> - Garantía: mínimo 10 citas o mes gratis
> 
> ¿Te muestro cómo funciona? 15 min demo.
> 
> Gustavo - GenerArise

### 3. Demo
- Mostrar dashboard con leads del mes
- Explicar proceso de calificación
- Testimonial ficticio pero creíble
- Cerrar: "Empezamos en 7 días, primera cita en 2 semanas"

### 4. Onboarding (Día 1-7)
- Definir ICP (Ideal Customer Profile)
- Setup Calendly
- Configurar prompts calificación
- Lanzar primera campaña

---

## 💡 Upsells Futuros

**Mes 1-3:** Fee fijo $1,497 (appointment setting solo)

**Mes 4:** +$500/mes - También hacemos el CIERRE (closer AI en la cita)

**Mes 6:** +$997/mes - Lead nurturing (seguimiento leads que no cerraron)

**Mes 12:** +$1,500/mes - Full sales team AI (prospecting + setting + closing + nurturing)

---

## 📈 Growth Path

**Mes 1:** 1 cliente @ $1,497 = $1,497/mes
**Mes 2:** 2 clientes = $2,994/mes
**Mes 3:** 3 clientes = $4,491/mes
**Mes 6:** 5 clientes = $7,485/mes
**Mes 12:** 10 clientes = $14,970/mes

**Con 10 clientes estables = $15K/mes con 90% margen** 🎯

---

## ✅ Checklist Inicio Rápido

- [ ] Elegir nicho (agencias marketing recomendado)
- [ ] Crear workflow n8n (te lo armo)
- [ ] Setup tools (Phantombuster + Instantly + Apollo)
- [ ] Primer cliente piloto (fee reducido: $997/mes)
- [ ] Entregar primera cita en 2 semanas
- [ ] Testimonial + case study
- [ ] Escalar a 3-5 clientes

---

## 🎯 Conclusión

**Modelo recomendado para TI:**
- **Fee fijo mensual:** $1,497-1,997/mes
- **Garantía:** Mínimo 10 citas calificadas o mes gratis
- **Target:** Agencias marketing digital 5-20 empleados
- **Margen:** 90%+
- **Time to first revenue:** 2-3 semanas

¿Querés que te arme el workflow completo de Appointment Setter ahora?
