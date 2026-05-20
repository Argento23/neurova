# Flujo Post-Venta: De Cliente Cerrado a Servicio Live

## 🎯 Overview

**Timeline total:** 7-10 días desde "Sí, acepto" hasta "Sistema funcionando 100%"

**Fases:**
1. Onboarding (Día 1-2) - Kick-off + recolección de info
2. Setup Técnico (Día 3-5) - Configuración infraestructura
3. Testing (Día 6-7) - Pruebas + ajustes
4. Go Live (Día 8) - Activación + handoff
5. Soporte Continuo (Día 9+) - Monitoreo + optimización

---

## 📋 FASE 1: Onboarding (Día 1-2)

### Día 1: Kick-off Call (30 min)

**Agenda:**
1. Bienvenida + expectativas (5 min)
2. Información necesaria (15 min)
3. Accesos y permisos (5 min)
4. Próximos pasos (5 min)

**Checklist de información a recolectar:**

#### Para Inmobiliarias (Argentina)
- [ ] Número WhatsApp Business actual
- [ ] 10-15 preguntas frecuentes principales
- [ ] Horario de atención humana
- [ ] Ejemplos de propiedades actuales
- [ ] Integraciones necesarias:
  - [ ] Zonaprop
  - [ ] MercadoLibre
  - [ ] CRM (opcional)
- [ ] Email para reportes
- [ ] Persona de contacto técnico

#### Para Hoteles (Austria)
- [ ] Canales actuales (WhatsApp/Email/IG/FB)
- [ ] FAQs principales (check-in, amenities, parking, etc.)
- [ ] Políticas hotel (cancelación, mascotas, edad mínima)
- [ ] Integraciones:
  - [ ] Booking.com
  - [ ] PMS (Property Management System)
  - [ ] Email corporativo
- [ ] Idiomas requeridos (DE/EN/ES/IT)
- [ ] Contacto recepción

### Día 2: Documentación + Accesos

**Enviar "Welcome Pack" por email:**

```
Asunto: Bienvenido a GenerArise - Próximos Pasos

Hola {{Nombre}},

Gracias por confiar en GenerArise para automatizar tus consultas.

📋 Próximos pasos (7 días):
- Día 3-5: Configuramos tu chatbot personalizado
- Día 6-7: Testing conjunto
- Día 8: ¡Go Live! 🚀

🔑 Necesitamos de tu parte:
1. Acceso WhatsApp Business API (te enviamos guía)
2. Lista de FAQs (adjunto template)
3. Ejemplos de conversaciones típicas

📞 Mantenemos contacto:
- Updates diarios por WhatsApp
- Call de revisión Día 6
- Soporte 24/7: agentes.space@gmail.com

¿Dudas? Respondeme este email.

Abrazo,
Gustavo
GenerArise
```

**Attachments:**
1. `FAQ_TEMPLATE.xlsx` - Template para FAQs
2. `WHATSAPP_SETUP_GUIDE.pdf` - Cómo conectar WhatsApp
3. `PROJECT_TIMELINE.pdf` - Timeline visual

---

## ⚙️ FASE 2: Setup Técnico (Día 3-5)

### Día 3: Infraestructura Base

**Tareas automatizables:**

#### A. WhatsApp Setup (Evolution API)
```bash
# Crear instancia para cliente
curl -X POST https://tu-evolution-api.com/instance/create \
  -H "apikey: YOUR_API_KEY" \
  -d '{
    "instanceName": "cliente_{{nombre_empresa}}",
    "qrcode": true
  }'

# Cliente escanea QR → conectado
```

#### B. n8n Workflow Cliente (Plantilla)
1. Webhook Evolution → recibe mensaje
2. Groq AI → procesa consulta
3. Base de Conocimiento → FAQs del cliente
4. Respuesta automática → WhatsApp
5. Log → Google Sheets (para reportes)

**Template workflow:** `client_chatbot_template.json`

#### C. Base de Conocimiento
Crear vector database (Pinecone/Qdrant):
- Cargar FAQs del cliente
- Embeddings con OpenAI
- Sistema RAG para respuestas precisas

### Día 4: Personalización

**Training del chatbot con datos cliente:**

```javascript
// Prompt personalizado por industria
const systemPrompt = {
  inmobiliaria: `
    Eres el asistente virtual de ${empresa}.
    Respondes consultas sobre propiedades inmobiliarias.
    Horario atención humana: ${horario}.
    Si preguntan algo fuera de alcance, derivás a agente.
    Tono: profesional pero amigable.
  `,
  hotel: `
    You are ${hotelName}'s virtual receptionist.
    Languages: DE/EN/ES/IT
    Check-in: ${checkInTime}
    Policies: ${policies}
    If booking request, collect info and notify staff.
    Tone: hospitable and efficient.
  `
};
```

**Integrations específicas:**
- Inmobiliaria → Zonaprop API (si disponible)
- Hotel → PMS integration (Cloudbeds, Opera, etc.)

### Día 5: Testing Interno

**Pruebas antes de mostrar al cliente:**
1. 20 consultas simuladas (casos comunes)
2. 5 edge cases (preguntas raras)
3. Test multiidioma (si aplica)
4. Verificar derivación a humano funciona
5. Revisar tono y precisión

**Checklist calidad:**
- [ ] Responde <30 segundos
- [ ] Precisión >90% (respuestas correctas)
- [ ] Tono apropiado
- [ ] Derivación funciona
- [ ] Integraciones conectadas

---

## 🧪 FASE 3: Testing con Cliente (Día 6-7)

### Día 6: Demo Live + Ajustes

**Testing Call (45 min):**

**Agenda:**
1. Mostrar chatbot en acción (10 min)
2. Cliente prueba casos reales (15 min)
3. Feedback + ajustes (15 min)
4. Timeline go-live (5 min)

**Durante la call:**
- Compartir pantalla WhatsApp
- Cliente dicta preguntas para probar
- Tomar notas de TODOS los ajustes pedidos
- No prometer imposibles ("Sí, lo ajusto hoy")

**Post-call:**
- Email resumen de cambios solicitados
- Implementar ajustes (2-4 horas)
- Confirmar ready para go-live

### Día 7: Refinamiento Final

**Últimos ajustes:**
- Pulir respuestas basado en feedback
- Optimizar velocidad si es lenta
- Agregar FAQs que faltaron
- Preparar handoff guide

---

## 🚀 FASE 4: Go Live (Día 8)

### Morning: Activación

**Checklist pre-launch:**
- [ ] Chatbot responde correctamente (test final)
- [ ] Cliente tiene acceso a dashboard
- [ ] Reportes automáticos configurados
- [ ] Números de soporte compartidos
- [ ] Backup plan si algo falla

**Activación gradual:**
1. **Hora 1-2:** Modo "shadow" (responde pero cliente ve todo)
2. **Hora 3-4:** Modo "assist" (IA sugiere, cliente aprueba)
3. **Hora 5+:** Modo "auto" (IA responde sola)

### Afternoon: Monitoreo Activo

**Primeras 8 horas sos "customer success manager":**
- Revisar cada conversación (primeras 20)
- Ajustar en tiempo real si hay errores
- WhatsApp con cliente cada 2 horas: "¿Todo bien?"

**Email go-live:**
```
Asunto: ✅ Sistema LIVE - Primeras 8 horas

{{Nombre}},

¡Estamos en vivo! 🎉

Primeras métricas (8 horas):
- 12 consultas atendidas
- Tiempo promedio respuesta: 45 seg
- 11/12 resueltas sin intervención humana
- 1 derivada a tu equipo

Ajustes hechos hoy:
1. Mejoré respuesta sobre [tema X]
2. Agregué FAQ de [tema Y]

Mañana enviamos reporte completo 24hs.

¿Feedback de tu lado?

Gustavo
```

---

## 📊 FASE 5: Soporte Continuo (Día 9+)

### Semana 1: Monitoreo Intensivo

**Reportes automáticos (diario):**
- Total consultas atendidas
- Tiempo promedio respuesta
- % resueltas sin humano
- Consultas derivadas
- Errores detectados

**Optimización continua:**
- Día 10: Revisar transcripts, mejorar prompts
- Día 12: Agregar FAQs que faltaron
- Día 14: Call de revisión + ajustes

### Mes 1: Estabilización

**Reportes semanales:**
- Métricas clave (KPIs)
- Comparativa semana anterior
- Oportunidades de mejora

**Calls mensuales:**
- 30 min review
- Mostrar stats
- Planear siguiente mes
- Upsell (más canales, más features)

### Largo Plazo: Retención

**Estrategia de valor continuo:**
1. **Mes 2:** Agregar canal adicional (Instagram DMs)
2. **Mes 3:** A/B testing de respuestas
3. **Mes 6:** Análisis de sentiment + insights
4. **Mes 12:** Renovación + aumento precio

---

## 🔄 Workflows n8n de Delivery

### 1. Client Onboarding Automation

**Trigger:** Cliente paga (webhook Mercado Pago/Stripe)

**Flujo:**
1. Crear carpeta cliente en Google Drive
2. Enviar welcome email con docs
3. Agendar kick-off call (Calendly auto)
4. Crear tarea en proyecto (ClickUp/Notion)
5. Notificar a ti por WhatsApp

### 2. Daily Client Report

**Trigger:** Cron 8:00 AM diario

**Flujo:**
1. Leer logs conversaciones cliente (últimas 24hs)
2. Calcular métricas (total, resueltas, derivadas)
3. Generar PDF reporte
4. Enviar por email a cliente
5. Guardar histórico en Sheet

### 3. Quality Monitoring

**Trigger:** Cada conversación finalizada

**Flujo:**
1. Enviar transcript a Groq AI
2. Analizar: ¿respuesta fue correcta? (1-10)
3. Si score <7 → alertar para revisión
4. Guardar en DB para análisis mensual

### 4. Escalation Handler

**Trigger:** Usuario escribe "hablar con humano"

**Flujo:**
1. Pausar chatbot
2. Notificar a equipo cliente (SMS/WhatsApp)
3. Crear ticket en su CRM
4. Email resumen al cliente
5. Log en sistema

---

## 📋 Templates & Docs Necesarios

### Documentos Cliente
1. **Welcome Pack** (PDF, 5 páginas)
   - Qué esperar
   - Timeline visual
   - Contactos soporte
   - FAQs sobre el servicio

2. **FAQ Template** (Excel)
   - Columnas: Pregunta | Respuesta | Categoría
   - 30 filas ejemplo pre-llenadas

3. **Setup Guides** (PDFs)
   - WhatsApp Business API setup
   - Cómo ver reportes
   - Cómo pausar/reactivar bot

### Documentos Internos
1. **Onboarding Checklist** (Notion/ClickUp)
   - Task list por proyecto
   - Trackear progreso
   - Handoff entre fases

2. **Client Info Sheet** (Google Sheets)
   - Todos los clientes
   - Status actual
   - Contactos clave
   - Renewal date

3. **Incident Playbook**
   - Qué hacer si chatbot falla
   - Rollback procedure
   - Escalation paths

---

## 💰 Upsell Opportunities

### Durante Onboarding
- "¿Querés agregar Instagram también?" (+$150/mes)
- "Reportes con IA insights?" (+$100/mes)

### Mes 2-3
- "Veo que recibís muchas consultas X, automatizamos más?" (+$200/mes)
- "Tu competidor agregó Y, querés?" (competitive intel)

### Mes 6+
- "Upgrade a plan Pro" (más canales + features)
- "White-label para tus franquicias" (B2B2C)

---

## 🎯 KPIs de Delivery

**Métricas internas (tus KPIs):**
- Time to Live: <10 días promedio
- Client satisfaction: >8/10
- Churn rate: <5%/mes
- Upsell rate: >30% por año

**Métricas cliente (sus KPIs):**
- Response time: <60 seg
- Resolution rate: >85%
- Customer satisfaction: >4.5/5
- Time saved: >10 hrs/semana

---

## 🚨 Red Flags & Troubleshooting

**Señales de alarma:**
- Cliente no responde emails por 3 días → call urgente
- Bot tiene <70% accuracy → intervenir ya
- Cliente pide pausar servicio → retention call
- No usa el sistema → need training session

**Plan de contingencia:**
- Si falla técnico: rollback a modo manual + fix en <4hs
- Si cliente insatisfecho: call inmediato + action plan 24hs
- Si quiere cancelar: ofrecer 1 mes gratis para arreglar

---

## 📞 Next Action (Cuando Cierres Primer Cliente)

1. Enviar welcome email inmediatamente
2. Agendar kick-off para mañana/pasado
3. Crear carpeta proyecto en Drive
4. Clonar workflow template para este cliente
5. Configurar reportes
6. Celebrar 🎉 (en serio, es el primero!)

¿Listo para el primer cliente? 🚀
