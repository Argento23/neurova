# 🚀 Deploy Landing Hotels Austria - Argenterío

## 📦 **Archivos que debes subir:**

```
store.argenterio.com/
├── landing_hotels_austria.html   ← El archivo HTML
├── logo.png                       ← Logo Argenterío
└── assets/
    ├── swiss-village-beautiful-mountains-austria.jpg
    └── flag-austria-with-ensign.jpg
```

---

## 🌐 **Cómo deployar en Netlify (RECOMENDADO):**

### Opción 1: Drag & Drop (Más fácil)
1. Ve a [netlify.com](https://netlify.com)
2. **Arrastra** la carpeta `neurova/agency/` directamente al área de drop
3. Netlify detectará el HTML automáticamente
4. Listo! Te da una URL tipo: `https://random-name-123456.netlify.app`

### Opción 2: CLI (Más control)
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
cd c:\Users\Gustavo\Downloads\neurova\agency
netlify deploy --prod
```

---

## 📧 **Sistema de Contacto - CÓMO FUNCIONA:**

### **Canales activos (3 botones):**

#### 1️⃣ **WhatsApp** (💬 botón verde)
- **Número actual:** `+54 9 11 6863-0003` 
- **Acción:** Abre WhatsApp directo con mensaje pre-llenado
- **Formato link:** `https://wa.me/5491168630003?text=mensaje`

#### 2️⃣ **Email** (✉️ botón rojo)
- **Email actual:** `gusdo@generarise.space`
- **Acción:** Abre cliente de email (Gmail, Outlook, etc.)
- **Pre-llena:** Asunto + cuerpo del mensaje

#### 3️⃣ **LinkedIn** (💼 botón azul) - NUEVO
- **Perfil:** `linkedin.com/in/gustavodornhofer`
- **Acción:** Abre perfil en nueva pestaña
- **Uso:** Networking con contactos de embajada y corporativos

#### 4️⃣ **Formulario** (📧 backup)
- **Acción actual:** `alert()` con el email capturado
- **Para hacerlo funcional:** Necesitas webhook o backend

---

## ⚙️ **Para actualizar tus datos de contacto:**

### Cambiar WhatsApp:
**Línea ~708** en `landing_hotels_austria.html`:
```html
<!-- BUSCAR: -->
<a href="https://wa.me/5491168630003?text=...">

<!-- CAMBIAR POR TU NÚMERO (sin espacios, con código país): -->
<a href="https://wa.me/5491151234567?text=...">
```

### Cambiar Email:
**Línea ~714** en `landing_hotels_austria.html`:
```html
<!-- BUSCAR: -->
<a href="mailto:gusdo@generarise.space?subject=...">

<!-- CAMBIAR POR TU EMAIL: -->
<a href="mailto:tu-email@dominio.com?subject=...">
```

### Cambiar LinkedIn:
**Línea ~720** en `landing_hotels_austria.html`:
```html
<!-- BUSCAR: -->
<a href="https://www.linkedin.com/in/gustavodornhofer">

<!-- CAMBIAR POR TU PERFIL: -->
<a href="https://www.linkedin.com/in/tu-perfil">
```

---

## 🔧 **Hacer funcional el formulario (Opcional):**

### Opción A: n8n Webhook
1. Crear workflow n8n con webhook
2. Reemplazar línea **~1122** (`handleSubmit`):
```javascript
function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    
    // Enviar a n8n
    fetch('https://manager.generarise.space/webhook/hotel-leads', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, fecha: new Date() })
    })
    .then(() => alert('¡Gracias! Te contactaremos pronto'))
    .catch(() => alert('Error. Probá por WhatsApp'));
}
```

### Opción B: Google Sheets (más simple)
Usar Google Forms embebido o Apps Script para loggear.

---

## ✅ **Checklist Pre-Deploy:**

- [x] WhatsApp actualizado: `+54 9 11 6863-0003`
- [x] Email actualizado: `gusdo@generarise.space`
- [x] LinkedIn agregado: `/in/gustavodornhofer`
- [x] Logo integrado: `logo.png`
- [ ] Las imágenes están en `/assets/`
- [ ] Probaste que los 3 idiomas (DE/EN/ES) funcionen en local
- [ ] Los 3 botones (WhatsApp + Email + LinkedIn) abren correctamente

---

## 🎯 **URL Recomendada:**

### Subdominios disponibles:
- `store.argenterio.com` ✅ (Principal - para este proyecto)
- `hotels.argenterio.com`
- `de.argenterio.com`
- `austria.argenterio.com`

Sin dominio:
- Usar el que te da Netlify gratis

---

## 🏛️ **Estrategia de Contactos de Embajada:**

### Cómo usar LinkedIn para networking diplomático:
1. **Mensaje a tus 2 contactos** (ver `ESTRATEGIA_EMBAJADA.md` en carpeta `argenterio/`)
2. **Conectar con cámaras de comercio** austríaco-argentinas
3. **Eventos de networking** - preguntar fechas de eventos empresariales

### Valor único para expatriados:
- Gestionan dual-currency (EUR/USD ↔ ARS)
- Necesitan optimización cambiaria
- Son early adopters tech-savvy

---

## 📱 **Testing Post-Deploy:**

1. Abrí la landing en mobile + desktop
2. Probá cambiar idioma (DE/EN/ES)
3. Clickeá botón WhatsApp → debe abrir app con mensaje
4. Clickeá botón Email → debe abrir Gmail/Outlook con template
5. Clickeá botón LinkedIn → debe abrir perfil en nueva pestaña
6. Probá formulario → debe mostrar alert

**¿Necesitás ayuda con algo de esto?** 🚀

