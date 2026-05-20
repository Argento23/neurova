# Catálogo de Productos GenerArise - Guía Maestra

## 📦 Portfolio Completo

### Tier 1: Listos para Vender (Workflows Completos)
1. ✅ **Inmobiliarias** - $497-797/mes
2. ✅ **Hoteles** (Multiidioma) - €797-1,297/mes
3. ✅ **Abogados** - $697-997/mes
4. ✅ **Contadores** - $597-897/mes

### Tier 2: Próximos a Desarrollar
5. 🔨 **Restaurantes** - $397-697/mes
6. 🔨 **Médicos/Clínicas** - $697-1,197/mes
7. 🔨 **E-commerce/Retail** - $597-997/mes
8. 🔨 **Gyms/Fitness** - $497-797/mes

### Tier 3: Oportunidades Adicionales
9. 💡 **Salones de Belleza** - $397-597/mes
10. 💡 **Agencias de Viajes** - $697-1,197/mes
11. 💡 **Talleres Mecánicos** - $497-697/mes
12. 💡 **Escuelas/Institutos** - $797-1,297/mes

---

## 🎯 Matriz de Requisitos por Rubro

| Rubro | WhatsApp | Email | Instagram | Multiidioma | CRM | Urgencias | Calendario | Complejidad |
|-------|----------|-------|-----------|-------------|-----|-----------|------------|-------------|
| Inmobiliarias | ✅ | ❌ | ⚡ | ❌ | ⚡ | ❌ | ❌ | ⭐⭐ |
| Hoteles | ✅ | ✅ | ⚡ | ✅ | ⚡ | ❌ | ✅ | ⭐⭐⭐⭐ |
| Abogados | ✅ | ✅ | ❌ | ❌ | ⚡ | ✅ | ✅ | ⭐⭐⭐ |
| Contadores | ✅ | ✅ | ❌ | ❌ | ⚡ | ✅ | ❌ | ⭐⭐⭐ |
| Restaurantes | ✅ | ❌ | ✅ | ⚡ | ❌ | ❌ | ✅ | ⭐⭐ |
| Médicos | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ⭐⭐⭐⭐ |
| E-commerce | ✅ | ❌ | ✅ | ⚡ | ✅ | ❌ | ❌ | ⭐⭐⭐ |
| Gyms | ✅ | ❌ | ✅ | ❌ | ⚡ | ❌ | ✅ | ⭐⭐ |
| Belleza | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ⭐⭐ |
| Viajes | ✅ | ✅ | ⚡ | ✅ | ⚡ | ❌ | ❌ | ⭐⭐⭐⭐ |
| Mecánicos | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ⭐⭐ |
| Educación | ✅ | ✅ | ❌ | ⚡ | ✅ | ❌ | ✅ | ⭐⭐⭐ |

**Leyenda:**
- ✅ Esencial
- ⚡ Opcional (upsell)
- ❌ No necesario

---

## 📋 Guía de Implementación Universal

### FASE 1: Discovery (Día 1-2)

#### Checklist Información Base (TODO RUBRO)
- [ ] Nombre del negocio
- [ ] Horario de atención
- [ ] Ubicación física
- [ ] Número WhatsApp actual
- [ ] Email principal
- [ ] Sitio web (si tiene)
- [ ] Redes sociales activas

#### Checklist Información Específica (POR RUBRO)

**Servicios Profesionales (Abogados, Contadores, Médicos):**
- [ ] Especialidades / Áreas de práctica
- [ ] Precio consulta inicial
- [ ] Proceso de agendamiento
- [ ] Documentación requerida
- [ ] Urgencias: cómo manejar

**Retail/Servicios (Inmobiliarias, Restaurants, Belleza):**
- [ ] Catálogo de productos/servicios
- [ ] Rangos de precio
- [ ] Formas de pago
- [ ] Política de cancelación
- [ ] Promociones actuales

**Hospitality (Hoteles, Viajes):**
- [ ] Check-in/Check-out times
- [ ] Amenities / Servicios incluidos
- [ ] Políticas (mascotas, edad, cancelación)
- [ ] Idiomas necesarios
- [ ] Temporadas alta/baja

---

### FASE 2: Setup Técnico (Día 3-5)

#### Stack Tecnológico Base
```
n8n (workflow automation)
  ├── Evolution API (WhatsApp)
  ├── Groq AI (LLM - gratis)
  ├── Google Sheets (logging)
  └── Gmail (notificaciones)
```

#### Credentials Necesarias
1. **Groq API** (gratis)
   - Registro: console.groq.com
   - Límite: 30 req/min (suficiente)
   - Modelo: llama-3.3-70b-versatile

2. **Evolution API** (WhatsApp)
   - Self-hosted o cloud ($10-20/mes)
   - 1 instancia por cliente
   - QR scan para conectar

3. **Google Workspace**
   - OAuth2 para Sheets + Gmail
   - 1 cuenta puede manejar múltiples clientes

4. **n8n**
   - Self-hosted (gratis) o cloud ($20/mes)
   - 1 instancia maneja todos los clientes

#### Costos Operativos por Cliente
```
Evolution API: $2-3/mes (compartido)
Groq: $0 (gratis hasta 30 req/min)
Google: $0 (cuenta personal)
n8n: $0 (self-hosted) o $1/cliente (cloud)
---
TOTAL: $3-5/mes por cliente
MARGEN: 95-98% 🤑
```

---

### FASE 3: Personalización (Día 4-5)

#### Nodo CONFIG - Variables por Rubro

**INMOBILIARIAS:**
```javascript
{
  nombre_inmobiliaria: "",
  horario: "",
  ubicacion: "",
  zonas_cobertura: "",
  tipo_servicios: "Venta, Alquiler, Tasaciones",
  comision_venta: "3% + IVA",
  comision_alquiler: "1 mes + IVA",
  faqs: "..."
}
```

**RESTAURANTES:**
```javascript
{
  nombre_restaurant: "",
  tipo_cocina: "Italiana, Parrilla, etc",
  horario_apertura: "",
  ubicacion: "",
  delivery: "true/false",
  precio_promedio: "$5,000-8,000 por persona",
  reservas_minimo: "2 personas",
  menu_link: "url",
  faqs: "..."
}
```

**MÉDICOS/CLÍNICAS:**
```javascript
{
  nombre_clinica: "",
  especialidades: "Clínica, Pediatría, etc",
  medicos: ["Dr. López", "Dra. García"],
  horario_atencion: "",
  obras_sociales: ["OSDE", "Swiss Medical"],
  precio_consulta: "$12,000",
  urgencias: "true/false",
  turnos_online: "url",
  faqs: "..."
}
```

**GYMS:**
```javascript
{
  nombre_gym: "",
  ubicacion: "",
  horario: "24hs o limitado",
  actividades: ["Musculación", "Funcional", "Yoga"],
  planes: {
    mensual: "$25,000",
    trimestral: "$65,000",
    anual: "$240,000"
  },
  clase_prueba: "true",
  faqs: "..."
}
```

---

### FASE 4: Testing (Día 6)

#### Test Cases por Rubro

**INMOBILIARIAS (20 tests):**
1. "Hola, busco depto 2 amb Palermo"
2. "Cuánto sale alquilar?"
3. "Hacen tasaciones?"
4. "Horarios de atención?"
5. "Quiero vender mi casa"
... (15 más)

**RESTAURANTES (20 tests):**
1. "Tienen mesa para 4 esta noche?"
2. "Hacen delivery?"
3. "Cuál es el menú?"
4. "Son aptos celíacos?"
5. "Cuánto sale el cubierto?"
... (15 más)

**MÉDICOS (20 tests):**
1. "Quiero turno con traumatólogo"
2. "Atienden OSDE?"
3. "Cuánto sale la consulta?"
4. "Tienen guardia?"
5. "Dónde están ubicados?"
... (15 más)

---

### FASE 5: Go Live (Día 7-8)

#### Checklist Pre-Launch
- [ ] Workflow activado en n8n
- [ ] WhatsApp conectado (QR escaneado)
- [ ] Google Sheet creado con template
- [ ] Test con número personal (OK)
- [ ] Cliente probó 5 consultas (OK)
- [ ] Reportes automáticos configurados
- [ ] Número de soporte compartido

#### Monitoreo Primeras 48hs
- Revisar TODAS las conversaciones
- Ajustar prompts si accuracy <85%
- Agregar FAQs que faltaron
- WhatsApp con cliente cada 6 horas

---

## 💰 Pricing Strategy por Rubro

### Matriz de Pricing

| Rubro | Basic | Pro | Enterprise |
|-------|-------|-----|------------|
| Inmobiliarias | $497 | $797 | $1,297 |
| Hoteles | €797 | €1,297 | €1,997 |
| Abogados | $697 | $997 | $1,497 |
| Contadores | $597 | $897 | $1,297 |
| Restaurantes | $397 | $697 | $997 |
| Médicos | $697 | $1,197 | $1,797 |
| E-commerce | $597 | $997 | $1,497 |
| Gyms | $497 | $797 | $1,197 |
| Belleza | $397 | $597 | $897 |
| Viajes | $697 | $1,197 | $1,797 |
| Mecánicos | $497 | $697 | $997 |
| Educación | $797 | $1,297 | $1,997 |

### Features por Tier

**BASIC (Precio base):**
- 1 canal (WhatsApp)
- 500 mensajes/mes
- Respuestas automáticas
- Logging en Sheet
- Soporte email

**PRO (+40-50%):**
- 2 canales (WhatsApp + Instagram/Email)
- 2,000 mensajes/mes
- Reportes semanales
- Integraciones (Calendly, CRM)
- Soporte prioritario

**ENTERPRISE (+100-150%):**
- Canales ilimitados
- Mensajes ilimitados
- Analytics avanzado
- API access
- Custom features
- Dedicated account manager

---

## 🎯 Target Market Size (Argentina)

| Rubro | # Negocios | TAM Potencial | Penetración 1% |
|-------|------------|---------------|----------------|
| Inmobiliarias | 15,000 | $7.5M/mes | $75K/mes |
| Restaurantes | 50,000 | $25M/mes | $250K/mes |
| Contadores | 50,000 | $30M/mes | $300K/mes |
| Abogados | 30,000 | $21M/mes | $210K/mes |
| Médicos | 40,000 | $28M/mes | $280K/mes |
| Gyms | 8,000 | $4M/mes | $40K/mes |
| Belleza | 60,000 | $24M/mes | $240K/mes |
| E-commerce | 25,000 | $15M/mes | $150K/mes |

**Con 1% penetración en UN SOLO rubro = $150-300K/mes** 🤯

---

## 📊 Priorización de Rubros

### Criterio de Scoring (1-10)

| Rubro | Pain Point | Market Size | Willingness to Pay | Easy to Sell | TOTAL |
|-------|------------|-------------|--------------------|--------------|-------|
| Contadores | 10 | 10 | 8 | 9 | **37** ⭐⭐⭐ |
| Restaurantes | 9 | 10 | 7 | 9 | **35** ⭐⭐⭐ |
| Médicos | 9 | 9 | 8 | 7 | **33** ⭐⭐⭐ |
| Abogados | 8 | 8 | 9 | 7 | **32** ⭐⭐ |
| E-commerce | 9 | 8 | 7 | 8 | **32** ⭐⭐ |
| Inmobiliarias | 8 | 7 | 8 | 8 | **31** ⭐⭐ |
| Belleza | 8 | 10 | 6 | 9 | **33** ⭐⭐⭐ |
| Gyms | 7 | 6 | 7 | 8 | **28** ⭐⭐ |
| Hoteles | 7 | 5 | 10 | 6 | **28** ⭐⭐ |
| Viajes | 6 | 6 | 8 | 6 | **26** ⭐ |

### Recomendación de Ataque

**Mes 1-2:** Contadores (más fácil, más mercado)
**Mes 3-4:** Restaurantes (volumen alto, cierre rápido)
**Mes 5-6:** Médicos (alto ticket, retención larga)
**Mes 7+:** Expandir a resto según demanda

---

## 🚀 Quick Start por Rubro

### Para Comenzar con CUALQUIER Rubro:

1. **Clonar workflow base** (inmobiliaria o hotel)
2. **Modificar nodo CONFIG** con variables del rubro
3. **Actualizar prompt sistema** con FAQs específicas
4. **Testear 20 casos** comunes del rubro
5. **Ajustar** basado en resultados
6. **Deploy** cliente piloto
7. **Iterar** y escalar

**Tiempo total:** 3-5 días por nuevo rubro

---

## 📚 Recursos Adicionales

Cada rubro tiene su propia guía detallada:
- `RUBRO_restaurantes.md` - FAQs, pricing, casos
- `RUBRO_medicos.md` - Urgencias, obras sociales, turnos
- `RUBRO_ecommerce.md` - Tracking, devoluciones, stock
- etc.

**Siguiente paso:** ¿Qué rubro querés que desarrolle completo primero?
