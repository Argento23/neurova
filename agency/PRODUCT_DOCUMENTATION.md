# Productos Finales - Chatbots para Clientes

## 🏢 Chatbot Inmobiliaria (PRODUCT_chatbot_inmobiliaria.json)

### Features
✅ WhatsApp Business integration (Evolution API)
✅ IA powered by Groq (Llama 3.3 70B)
✅ Detección keywords para derivar a humano
✅ Logging de conversaciones en Google Sheets
✅ Notificación automática a asesores
✅ Personalizable (horarios, FAQs, ubicación)

### Flujo
```
Mensaje WhatsApp → 
¿Pide agente? → Sí → Derivar + Notificar
             ↓ No
             IA responde (FAQs config) →
             Enviar respuesta →
             Log en Sheet →
             End
```

### Configuración Cliente
En nodo "CONFIG", reemplazar:
- `NOMBRE_INMOBILIARIA_AQUI`
- Horario de atención
- Ubicación
- FAQs principales
- `numero_asesor` (para notificaciones)

### Keywords de Escalado
- "hablar con agente"
- "contacto"
- "asesor"
- "urgente"

---

## 🏨 Chatbot Hotel (PRODUCT_chatbot_hotel.json)

### Features
✅ WhatsApp multiidioma (DE/EN/ES/IT)
✅ Detección automática de idioma
✅ Responde en idioma del huésped
✅ Captura solicitudes de reserva
✅ Email automático a staff con booking request
✅ Log con idioma detectado

### Flujo
```
Mensaje WhatsApp →
Detectar idioma (Groq AI) →
Responder en idioma nativo →
¿Es reserva? → Sí → Email staff + Log
           ↓ No
           Solo LOG →
           End
```

### Configuración Cliente
En nodo "Hotel Config", reemplazar:
- `HOTEL_NAME_HERE`
- Check-in/Check-out times
- Dirección
- Amenities
- Policies (mascotas, cancelación, edad mínima)
- `booking_email` (recepción)

### Idiomas Soportados
- 🇩🇪 Alemán (DE)
- 🇬🇧 Inglés (EN)
- 🇪🇸 Español (ES)
- 🇮🇹 Italiano (IT)

---

## ⚙️ Setup Técnico (Ambos)

### Requisitos
1. **n8n** (self-hosted o cloud)
2. **Evolution API** (WhatsApp Business)
3. **Groq API** (gratis hasta 30 req/min)
4. **Google Sheets** (logging)
5. **Gmail** (notificaciones)

### Credentials Necesarias
- [ ] Groq API Key
- [ ] Evolution API URL + Token
- [ ] Google OAuth2 (Sheets + Gmail)

### Variables a Configurar
**INMOBILIARIA:**
```javascript
nombre_inmobiliaria: "Nombre Inmobiliaria"
horario: "Lun-Vie 9-18hs, Sáb 9-13hs"
ubicacion: "Av. Corrientes 1234, CABA"
faqs: "Lista de FAQs..."
numero_asesor: "+5491112345678"
instance_name: "evolution_instance_id"
```

**HOTEL:**
```javascript
hotel_name: "Hotel Boutique Wien"
check_in: "15:00"
check_out: "11:00"
address: "Herrengasse 10, 1010 Wien"
amenities: "WiFi, Breakfast, Gym, Spa, Parking"
policies: "Pets OK, Cancel 48h, Min age 18"
booking_email: "reservations@hotel.at"
instance_name: "evolution_instance_id"
```

---

## 📊 Google Sheets Templates

### Inmobiliaria - "conversaciones"
```
Fecha | Telefono | Mensaje_Cliente | Respuesta_Bot | Escalado
```

### Hotel - "guest_interactions"
```
Fecha | Telefono | Idioma | Mensaje | Respuesta | Es_Reserva
```

---

## 🚀 Deployment Checklist

### Paso 1: Importar Workflow
- [ ] Importar JSON a n8n
- [ ] Verificar todos los nodos visibles

### Paso 2: Configurar Credentials
- [ ] Groq API
- [ ] Evolution API
- [ ] Google Sheets OAuth2
- [ ] Gmail OAuth2

### Paso 3: Personalizar CONFIG
- [ ] Reemplazar datos placeholder
- [ ] Ajustar FAQs/policies
- [ ] Configurar horarios

### Paso 4: Crear Sheets
- [ ] Crear Google Sheet con template
- [ ] Copiar Sheet ID
- [ ] Reemplazar en workflow

### Paso 5: Conectar WhatsApp
- [ ] Crear instancia Evolution API
- [ ] Escanear QR con WhatsApp cliente
- [ ] Copiar instance_name
- [ ] Configurar webhook

### Paso 6: Testing
- [ ] Enviar mensaje prueba
- [ ] Verificar respuesta IA
- [ ] Testar escalado (inmobiliaria)
- [ ] Testar multiidioma (hotel)
- [ ] Verificar logging

### Paso 7: Go Live
- [ ] Activar workflow
- [ ] Monitorear primeras 10 conversaciones
- [ ] Ajustar prompts si necesario

---

## 💰 Pricing Sugerido

**Inmobiliaria (Argentina):**
- Basic: $497/mes (1 número WhatsApp, horario limitado)
- Pro: $797/mes (2 números, 24/7, multi-asesor)
- Enterprise: $1,297/mes (ilimitado, analytics, CRM integration)

**Hotel (Austria):**
- Basic: €797/mes (1 canal, 4 idiomas)
- Pro: €1,297/mes (WhatsApp + Instagram + Email, analytics)
- Enterprise: €1,997/mes (PMS integration, unlimited channels)

---

## 📈 Métricas de Éxito (Cliente)

**Para reportes mensuales:**
- Total consultas atendidas
- Tiempo promedio respuesta (<60 seg meta)
- % resueltas sin intervención humana (>80% meta)
- Consultas derivadas a staff
- Horarios pico de actividad

**Extracción de Sheet:**
```sql
-- Total consultas mes
=COUNTIFS(Fecha, ">="&A1, Fecha, "<="&B1)

-- % Sin escalado
=COUNTIFS(Escalado, "false") / COUNTROWS()

-- Promedio por día
=COUNTROWS() / 30
```

---

## 🔧 Mantenimiento

**Semanal:**
- Revisar conversaciones mal respondidas
- Ajustar prompts si accuracy <90%
- Agregar FAQs nuevas

**Mensual:**
- Call review con cliente
- Enviar reporte métricas
- Proponer mejoras/upsells

**Trimestral:**
- Optimizar prompts basado en data
- A/B testing diferentes respuestas
- Agregar features nuevas

---

## 🎯 Próximos Pasos

1. Personalizar ambos workflows con datos reales
2. Testear local con 20 conversaciones simuladas
3. Deploy para primer cliente
4. Documentar aprendizajes
5. Crear templates más específicos por sub-nicho

Estos son los productos que vendés. El valor no está en el código (es simple), sino en:
- Setup completo
- Personalización
- Soporte continuo
- Optimización basada en data

🚀
