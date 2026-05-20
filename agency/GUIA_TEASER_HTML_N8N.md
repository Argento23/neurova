# 🎯 Guía de Implementación: Teaser Financiero en HTML

## 📋 Resumen

Has solicitado actualizar el prompt de la IA "Argenterio" para que **genere el teaser en formato HTML** en lugar de texto plano. Este documento te guía paso a paso.

---

## ✅ Cambios Realizados

### Archivo Anterior (Texto Plano):
```
SALIDA: Párrafo corto alarmista en texto plano
```

### Archivo Nuevo (HTML):
**`PROMPT_AI_TEASER_HTML.txt`**
```
SALIDA: HTML formateado con estilos inline
```

---

## 🛠️ Implementación en n8n

### Paso 1: Localizar el Nodo de IA

En tu workflow de Argenterio, busca el nodo:
- **Tipo**: OpenAI / Gemini / Claude (o el LLM que uses)
- **Nombre**: Probablemente "Analista ARGT-26" o similar
- **Función**: Genera el teaser financiero

### Paso 2: Reemplazar el Prompt

**ANTES** (prompt viejo):
```
Analista ARGT-26. Tu misión: Analizar finanzas para un TEASER de venta. 
DATOS DEL USUARIO:
- Ingresos: {{ $('Webhook Data').item.json.body.ingresos }}
- Gastos: {{ $('Webhook Data').item.json.body.gastos }}
...
SALIDA REQUERIDA:
Escribe un solo párrafo corto (máximo 3 líneas) y alarmista...
```

**AHORA** (prompt nuevo):
Copia el contenido completo de **`PROMPT_AI_TEASER_HTML.txt`**

### Paso 3: Configurar el Nodo de Email

El nodo de email debe estar configurado para **HTML**:

**Gmail Node** o **Send Email Node**:
- ✅ **HTML**: Activado/Enabled
- **Body**: Incluir la variable que contiene la respuesta de la IA

**Ejemplo de configuración**:
```javascript
// En el campo "HTML Body" del nodo de Email:
<!DOCTYPE html>
<html>
<body>
    <p>Estimado/a {{ $json.nombre }},</p>
    
    <p>Hemos analizado su situación financiera:</p>
    
    <!-- AQUÍ VA LA RESPUESTA DE LA IA EN HTML -->
    {{ $('Analista ARGT-26').item.json.output }}
    
    <p>Para ver el reporte completo, haga clic abajo:</p>
    
    <a href="{{ $json.payment_link }}" style="...">Ver Reporte</a>
</body>
</html>
```

---

## 🎨 Estilos Disponibles

He creado **5 variantes de diseño** en el archivo `ESTILOS_TEASER_HTML.md`:

1. **Alerta Roja** (Recomendado) - Más urgente ⚠️
2. **Advertencia Naranja** - Intermedio ⚡
3. **Premium GenerArise** - Branding consistente 🔍
4. **Tarjeta Moderna** - Look actual 💎
5. **Minimalista** - Mejor compatibilidad con Outlook 📧

### Para cambiar de estilo:

Edita la sección `ESTRUCTURA HTML REQUERIDA` del prompt y reemplaza el `<div>` con el estilo elegido.

---

## 📊 Ejemplo de Salida

La IA ahora responderá con esto:

```html
<div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%); border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0; font-family: 'Segoe UI', sans-serif;">
    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #333;">
        <i style="color: #ef4444; margin-right: 8px;">⚠️</i>
        <strong style="color: #dc2626;">ANÁLISIS CRÍTICO:</strong> Sus gastos representan el 87% de sus ingresos mensuales, dejando un margen de maniobra de solo $234 USD. Con una deuda activa de $12,400 y un objetivo de estabilidad financiera, su ratio de endeudamiento está en zona de riesgo crítico.
    </p>
</div>
```

**Visualización**: Ver imagen de preview arriba 👆

---

## 🔍 Testing

### Paso 1: Test Manual de la IA

En n8n, ejecuta manualmente el nodo de IA con datos de prueba:
```json
{
  "ingresos": "3000",
  "gastos": "2610",
  "deudas": "12400",
  "objetivo": "estabilidad financiera"
}
```

**Verifica que la salida sea HTML válido** (debe empezar con `<div style=...`)

### Paso 2: Test de Email

1. Envía un email de prueba a tu propio correo
2. Abre el email en diferentes clientes:
   - Gmail (Web)
   - Outlook (Web)
   - iPhone Mail
   - Android Gmail App

3. **Verifica**:
   - ✅ Se ve el fondo rojo claro
   - ✅ Se ve el borde rojo a la izquierda
   - ✅ El emoji ⚠️ aparece
   - ✅ El texto en negrita está en rojo oscuro
   - ✅ Los números del análisis son correctos

---

## ⚠️ Problemas Comunes

### Problema 1: La IA responde con texto plano

**Causa**: El prompt no es suficientemente claro

**Solución**: Agrega al inicio del prompt:
```
IMPORTANTE: Responde ÚNICAMENTE con código HTML. 
No agregues explicaciones, no uses markdown, no incluyas ```html.
Solo el código HTML puro comenzando con <div>.
```

### Problema 2: El HTML no se renderiza en el email

**Causa**: El nodo de email está en modo texto

**Solución**: 
- En el nodo de Email, buscar la opción "HTML" o "Content Type"
- Cambiar de "text/plain" a "text/html"
- O activar el toggle "HTML Email"

### Problema 3: Los estilos no se ven

**Causa**: Algunos clientes de email bloquean ciertos estilos

**Solución**: Usa la **Opción 5** (Minimalista con tabla) del archivo `ESTILOS_TEASER_HTML.md`:
- Mejor compatibilidad con Outlook
- Usa `<table>` en lugar de `<div>`
- Estilos más básicos pero más seguros

---

## 📂 Archivos de Referencia

1. **`PROMPT_AI_TEASER_HTML.txt`** - Prompt actualizado para n8n
2. **`ESTILOS_TEASER_HTML.md`** - 5 variantes de diseño
3. Este archivo - Guía de implementación

---

## 🚀 Checklist de Implementación

- [ ] Abrir workflow de Argenterio en n8n
- [ ] Localizar nodo de IA (Analista ARGT-26)
- [ ] Copiar contenido de `PROMPT_AI_TEASER_HTML.txt`
- [ ] Reemplazar el prompt antiguo
- [ ] Configurar nodo de Email en modo HTML
- [ ] Insertar variable de respuesta de IA en el body del email
- [ ] Ejecutar test con datos de prueba
- [ ] Verificar que salida sea HTML
- [ ] Enviar email de prueba a ti mismo
- [ ] Verificar renderizado en diferentes clientes
- [ ] Ajustar estilos si es necesario
- [ ] Activar workflow en producción

---

## 💡 Tips Pro

### Personalización Avanzada

Si quieres que el color cambie según la gravedad:

**En el prompt de la IA**:
```
Si el ratio de gastos/ingresos > 90%, usa #dc2626 (rojo oscuro)
Si está entre 70-90%, usa #f59e0b (naranja)
Si está < 70%, usa #6366f1 (azul/ok)
```

### A/B Testing

Crea 2 versiones del email:
- **Versión A**: Estilo Alerta Roja (urgente)
- **Versión B**: Estilo Premium (profesional)

Mide cuál convierte mejor.

### Variable Dinámica de CTA

Cambia el texto del botón según el análisis:
- "🔓 Desbloquear Solución Urgente" (si es crítico)
- "📊 Ver Estrategia Optimizada" (si es moderado)

---

## 📞 Soporte

Si algo no funciona:
1. Verifica que la IA esté respondiendo con HTML (revisa logs de n8n)
2. Asegúrate que el nodo de email esté en modo HTML
3. Prueba primero con un estilo simple (Opción 5)
4. Revisa la consola del navegador si el HTML no se ve

---

**Última actualización**: 2026-02-01  
**Versión**: 1.0 - HTML Email Teaser
