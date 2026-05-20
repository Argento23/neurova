# 📧 Formulario de Contacto - Austria Landing

## 📍 Ubicación del Formulario

El formulario está debajo de los botones de WhatsApp y Email en **cada sección de idioma**:
- **Alemán (DE):** Línea ~943
- **Inglés (EN):** Línea ~1137
- **Español (ES):** Línea ~1332

---

## 🎯 Qué Hace el Formulario

### Estado Actual:
```javascript
function handleSubmit(e) {
    // 1. Captura el email del input
    // 2. Detecta el idioma actual (DE/EN/ES)
    // 3. Muestra mensaje de confirmación en el idioma correcto
    // 4. Muestra: "gustavodornhofer@gmail.com"
    // 5. Limpia el formulario
}
```

### Mensajes por Idioma:
- **🇦🇹 Alemán:** "Vielen Dank! Wir kontaktieren Sie an: gustavodornhofer@gmail.com"
- **🇬🇧 Inglés:** "Thank you! We will contact you at: gustavodornhofer@gmail.com"
- **🇪🇸 Español:** "¡Gracias! Le contactaremos en: gustavodornhofer@gmail.com"

---

## 🔧 Próximo Paso: Webhook n8n (Opcional)

El código ya tiene preparado el webhook (comentado). Para activarlo:

### 1. Crear Workflow en n8n:
```
Webhook Trigger → Google Sheets → Email Notification
```

### 2. Descomentar líneas 1388-1396 en `index.html`:
```javascript
fetch('https://manager.generarise.space/webhook/hotel-leads', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ 
        email: email, 
        lang: currentLang,
        fecha: new Date().toISOString(),
        origen: 'Landing Austria Hotels'
    })
})
```

### 3. Datos que envía:
- **email:** El email del hotel interesado
- **lang:** Idioma de la página (de/en/es)
- **fecha:** Timestamp ISO
- **origen:** "Landing Austria Hotels"

---

## 📊 Flujo Completo

```
Usuario llena formulario
    ↓
Click "Senden" / "Send" / "Enviar"
    ↓
handleSubmit() captura email
    ↓
[Opcional] Envía a n8n webhook
    ↓
Muestra alert con confirmación
    ↓
Limpia formulario
```

---

## 🎨 Diseño del Formulario

El formulario tiene:
- **Input type="email"** (validación automática)
- **Placeholder dinámico** según idioma
- **Glassmorphism style** (blur + border)
- **Botón con gradient** rosa/rojo

---

## ✅ Testing Checklist

- [ ] Abrir landing en navegador
- [ ] Probar formulario en idioma Alemán
- [ ] Probar formulario en idioma Inglés
- [ ] Probar formulario en idioma Español
- [ ] Verificar que muestra "gustavodornhofer@gmail.com"
- [ ] Verificar que limpia el formulario después de enviar

---

**Email mostrado:** `gustavodornhofer@gmail.com` ✅
