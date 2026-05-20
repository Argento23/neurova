# 📞 Sistema de Contacto - Argenterío

## ✅ Canales Activos en la Landing

### 1. **WhatsApp** (FUNCIONAL ✅)
- **Número**: `+54 9 11 6863-0003`
- **Link**: `https://wa.me/5491168630003`
- **Mensaje prellenado**: "Hola, me interesa información sobre Argenterío"
- **Ubicación**: Sección de contacto (card clickeable)

### 2. **Email Corporativo** (FUNCIONAL ✅)
- **Dirección**: `gusdo@generarise.space`
- **Asunto prellenado**: "Consulta Argenterío"
- **Tipo**: `mailto:` link directo
- **Ubicación**: Sección de contacto (card clickeable)

### 3. **LinkedIn** (FUNCIONAL ✅)
- **Perfil**: `/in/gustavodornhofer`
- **URL completa**: `https://www.linkedin.com/in/gustavodornhofer`
- **Propósito**: Networking profesional, contactos institucionales
- **Ubicación**: Sección de contacto (card clickeable)

---

## 🎨 Diseño de la Sección

La sección de contacto (`#contacto`) incluye:

1. **Header**: "¿Necesitas asesoramiento personalizado?"
2. **Grid de 3 Cards**:
   - 🟢 WhatsApp (Verde #25D366)
   - 🔵 Email (Cyan)
   - 🔵 LinkedIn (Azul #0077B5)

3. **Banner Institucional**: 
   - Icono de columnas (edificio institucional)
   - Texto sobre relaciones con embajadas/corporaciones
   - Color verde neón para destacar

---

## 🔗 Link en Footer

El footer ahora incluye:
```
ARGENTERÍO_ SYSTEM v1.0 | © 2026 | [Contacto]
```

El link [Contacto] lleva a `#contacto` (scroll suave automático)

---

## 🚀 Subdominio

- **URL**: `store.argenterio.com`
- **Hosting**: Configurar en tu proveedor DNS
- **Archivos necesarios**:
  - `index.html` ✅
  - `style.css` ✅
  - `logo.png` ✅

---

## 📝 Próximos Pasos para Deploy

1. **Subir archivos a hosting**:
   ```bash
   # Estructura requerida
   store.argenterio.com/
   ├── index.html
   ├── style.css
   └── logo.png
   ```

2. **Configurar DNS**:
   - Crear registro `CNAME` para `store` apuntando a tu servidor
   - O registro `A` con la IP del hosting

3. **SSL/HTTPS**:
   - Certificado Let's Encrypt (gratis)
   - Importante para credibilidad financiera

---

## 🎯 Casos de Uso por Canal

| Canal | Uso Recomendado |
|-------|-----------------|
| **WhatsApp** | Consultas rápidas, clientes B2C, soporte |
| **Email** | Propuestas corporativas, alianzas, documentación |
| **LinkedIn** | Networking, contactos embajada, partnerships |

---

## 📊 Tracking (Opcional)

Para métricas, podrías agregar parámetros UTM:

```javascript
// Ejemplo para tracking de WhatsApp
const waLink = 'https://wa.me/5491168630003?text=...&utm_source=landing&utm_medium=contact_section';
```

---

**Última actualización**: 2026-02-06  
**Versión**: 1.0
