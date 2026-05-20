# Chatbots para Servicios Profesionales

## 👨‍⚖️ Chatbot Abogados (PRODUCT_chatbot_abogados.json)

### Features Únicas
✅ **Detección de urgencias** (keywords: urgente, judicial, audiencia, plazo)
✅ **Email automático** a abogado cuando caso urgente
✅ **Integración Calendly** para agendar consultas
✅ **NO da asesoramiento legal** (solo info general)
✅ **Logging detallado** con marcador "urgente"

### Flujo Específico
```
Mensaje → 
¿Tiene keyword urgente? → Sí → Email + SMS urgente a abogado
                       ↓ No
                       IA responde (info no-legal) →
                       ¿Quiere turno? → Sí → Calendly link
                                    ↓ No
                                    Log + End
```

### Use Cases Perfectos
- **Divorcios:** Info precio + proceso, luego consulta
- **Despidos:** Empatía + agendar reunión urgente
- **Sucesiones:** Documentación necesaria + pricing
- **Contratos:** Precio base + agenda revisión

### Pricing Sugerido
- **Basic:** $697/mes (WhatsApp solo)
- **Pro:** $997/mes (WhatsApp + Email + integración CRM)
- **Enterprise:** $1,497/mes (Multi-abogado + analytics)

---

## 🧮 Chatbot Contadores (PRODUCT_chatbot_contadores.json)

### Features Únicas
✅ **Calculador vencimientos AFIP** (automático por fecha)
✅ **Alertas proactivas** si vencimiento próximo (IVA, Monotributo, etc.)
✅ **Info pricing** por régimen (Monotributo vs Resp. Inscripto)
✅ **Captura leads** cuando piden presupuesto
✅ **Primera consulta gratis** (cierra más)

### Flujo Específico
```
Mensaje →
¿Menciona "vencimiento"? → Sí → Verificar fecha AFIP →
                                  ¿Próximo a vencer? → Alert + Info
                         ↓ No
                         IA responde info servicio →
                         ¿Quiere presupuesto? → Sí → Contacto + "1ra gratis"
                                             ↓ No
                                             Log + End
```

### Vencimientos Auto-Detectados
- **IVA:** 16-21 cada mes
- **Ganancias:** 10-15 (trimestral)
- **Monotributo:** 17-20 cada mes
- **Autónomos:** 10-12 cada mes

### Use Cases Perfectos
- **Monotributista:** Precio fijo claro + docs necesarias
- **Empresa nueva:** Asesoramiento integral + presupuesto
- **Vencimiento urgente:** Resolver hoy + captar cliente
- **Cambio régimen:** Consulta gratis + retención

### Pricing Sugerido
- **Basic:** $597/mes (WhatsApp + alertas AFIP)
- **Pro:** $897/mes (+ recordatorios automáticos clientes)
- **Enterprise:** $1,297/mes (+ integración software contable)

---

## 🎯 Por Qué Estos Nichos Son Rentables

### Abogados
✅ **30,000+** estudios en Argentina
✅ Alto ticket ($700-1,500/mes sostenible)
✅ Pain point claro: perder clientes por no responder
✅ **Cierran rápido** (consultas = $ directo)
✅ Referrals fáciles (abogados se conocen entre sí)

### Contadores
✅ **50,000+** estudios en Argentina
✅ Procesos MUY repetitivos (vencimientos, precios, docs)
✅ Tech-savviness bajo = poca competencia
✅ **Retención altísima** (relación contador-cliente es larga)
✅ Upsell fácil (recordatorios a SUS clientes)

---

## 📊 Comparativa de Productos

| Feature | Inmobiliaria | Hotel | Abogados | Contadores |
|---------|--------------|-------|----------|------------|
| Multiidioma | ❌ | ✅ (4) | ❌ | ❌ |
| Urgencias | ❌ | ❌ | ✅ | ✅ (AFIP) |
| Calendly | ❌ | ❌ | ✅ | ❌ |
| Pricing Info | ❌ | ✅ | ✅ | ✅ |
| Email Alerts | ❌ | ✅ (bookings) | ✅ (urgent) | ❌ |
| Lead Capture | ✅ | ✅ | ✅ | ✅ |
| Complexity | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Price (ARG) | $497-797 | N/A | $697-997 | $597-897 |

---

## 🚀 GTM (Go-to-Market) por Nicho

### Abogados

**Cold Email Subject:**
> "{{Nombre}}, 73% de consultas legales llegan fuera de horario (y se pierden)"

**Pitch:**
> "Automatizo respuestas 24/7 para que nunca pierdas un cliente.
> Detecta casos urgentes y te alerta inmediatamente.
> Primera consulta generada = $15K+. Mi servicio: $697/mes."

**Demo hook:**
> "Te muestro cómo capté 12 consultas en 48hs para [Estudio X]"

**Cierre:**
> "14 días gratis. Si no ves 3+ consultas, no me pagás."

---

### Contadores

**Cold Email Subject:**
> "{{Nombre}}, tus clientes preguntan lo mismo 50 veces (y te quita tiempo valioso)"

**Pitch:**
> "Automatizo FAQs (vencimientos, precios, docs necesarias).
> Tu estudio responde 24/7 sin que levantes el teléfono.
> Captas clientes nuevos mientras dormís."

**Demo hook:**
> "Mirá cómo [Estudio Y] liberó 15 horas/semana respondiendo lo mismo"

**Cierre:**
> "30 días gratis. Si no ahorrás 10+ horas/mes, cancelas sin cargo."

---

## 📋 Setup Rápido (Ambos)

### Paso 1: Personalizar CONFIG
**Abogados:**
```javascript
estudio_nombre: "Estudio López & Asoc"
especialidades: "Laboral, Familia, Civil"
horario: "Lun-Vie 9-19hs"
consulta_precio: "$15,000"
calendly_link: "calendly.com/estudio/consulta"
```

**Contadores:**
```javascript
estudio_nombre: "Estudio Contable Pérez"
servicios: "Monotributo, RI, Sueldos, AFIP"
precio_monotributo: "$12,000/mes"
precio_ri: "$25,000/mes"
email_estudio: "contacto@estudio.com.ar"
```

### Paso 2: Crear Google Sheet
**Abogados - "consultas"**
```
Fecha | Telefono | Consulta | Respuesta | Urgente | Quiere_Turno
```

**Contadores - "consultas_clientes"**
```
Fecha | Telefono | Consulta | Respuesta | Tema_Vencimiento | Quiere_Presupuesto
```

### Paso 3: Testing Casos Específicos
**Abogados:**
- "Me despidieron sin causa" → Urgente, email abogado
- "Cuánto sale un divorcio?" → Pricing + calendly
- "Necesito consulta hoy" → Urgente + derivar

**Contadores:**
- "Cuándo vence monotributo?" → Fecha exacta
- "Cuánto cobran?" → Pricing según régimen
- "Necesito presupuesto" → Contacto + consulta gratis

---

## 💰 Revenue Potential

**Escenario conservador (ARG):**
- 2 abogados @ $897/mes = $1,794
- 3 contadores @ $697/mes = $2,091
- **Total: $3,885/mes con 5 clientes**

**Escenario aggressive:**
- 5 abogados @ $997/mes = $4,985
- 7 contadores @ $897/mes = $6,279
- **Total: $11,264/mes con 12 clientes**

---

## 🎯 Próximos Pasos

1. **Elegir nicho primero:** Contadores (más fácil) o Abogados (más $$)
2. **Personalizar workflow** con datos reales
3. **Testear internamente** con 20 mensajes simulados
4. **Buscar 10 leads** en LinkedIn
5. **Cold email** usando templates arriba
6. **Demo** → Cerrar → Deploy en 7 días

¿Con cuál arrancás primero? 🚀
