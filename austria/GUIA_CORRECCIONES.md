# 📸 GUÍA VISUAL - Correcciones n8n

## 🔧 Corrección 1: Nodo "Enviar texto"

### Paso 1: Abre el nodo
Haz doble clic en el nodo **"Enviar texto"** en tu canvas.

### Paso 2: Localiza el campo "Message Text"
Verás que actualmente dice:
```
¡Genial! Aquí tienes el enlace directo a mi agenda privada...
```

### Paso 3: Borra TODO y pega esto:
```
{{ $json.mensaje_texto }}
```

### Paso 4: Guarda
Click en "Execute Node" para probar o simplemente guarda.

---

## 🔧 Corrección 2: Nodo "Filtro V5"

### Opción A: Reemplazar TODO el código (Recomendado)

1. Abre el nodo **"Filtro V5 (Tu Estructura Exacta)"**
2. Borra TODO el código actual
3. Copia y pega el contenido de `FILTRO_V6_CORREGIDO.js`
4. Guarda

### Opción B: Solo arreglar el nombre del Webhook

1. Abre el nodo **"Filtro V5 (Tu Estructura Exacta)"**
2. Presiona `Ctrl+F` para buscar
3. Busca: `Webhook (WhatsApp)`
4. Hay **2 ocurrencias** - Reemplaza ambas por: `Webhook`
5. Guarda

---

## 🔧 Corrección 3: Nodo "Synthesize text to speech"

### Paso 1: Abre el nodo
Doble clic en **"Synthesize text to speech"**

### Paso 2: Cambia "Language Code"
**Antes:**
```
es-US
```

**Después:**
```
{{ $json.tts_language_code }}
```

### Paso 3: Cambia "Voice Name"
**Antes:**
```
es-US-Neural2-B
```

**Después:**
```
{{ $json.tts_voice_name }}
```

### Paso 4: Guarda

---

## ✅ PRUEBA FINAL

Después de hacer las 3 correcciones:

1. **Activa el workflow**
2. **Envía un mensaje de prueba por WhatsApp:**
   - "Quiero agendar" → Debería enviar audio + link de Cal.com
3. **Prueba multiidioma:**
   - "Guten Tag, wie viel kostet das?" → Debería responder en alemán con voz alemana
   - "Hello, what's the price?" → Voz inglesa
   - "Hola, ¿cuánto cuesta?" → Voz española

---

## 🚨 Si sigue sin funcionar:

1. Asegúrate de haber guardado TODOS los nodos modificados
2. **Desactiva y reactiva** el workflow (toggle ON/OFF)
3. Revisa los logs del nodo "Filtro V6" para ver qué valores genera
