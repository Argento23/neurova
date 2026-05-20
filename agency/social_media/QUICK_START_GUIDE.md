# Guía Rápida: Usar los Workflows de Community Manager

## 🚀 Setup Inicial (Una Vez)

### 1. Subir Calendario a Google Sheets

1. Abre Google Sheets: https://sheets.google.com
2. Crear nueva hoja llamada "GenerArise - Social Media Calendar"
3. Importar el archivo `content_calendar.csv`:
   - File → Import → Upload
   - Seleccionar `content_calendar.csv`
4. Copiar el Sheet ID de la URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_AQUI/edit
   ```

### 2. Configurar Credenciales en n8n

#### Google Sheets
- Credentials → Add → Google Sheets OAuth2
- Autorizar con tu cuenta Google

#### Groq AI
- Credentials → Add → Groq API
- API Key de: https://console.groq.com/keys

#### Leonardo AI
- Credentials → Add → HTTP Header Auth
- Header: `Authorization`
- Value: `Bearer YOUR_API_KEY`
- Obtener key en: https://leonardo.ai/ → Settings → API

#### Meta (Instagram + Facebook)
- Ver guía completa en `API_SETUP_GUIDE.md`
- Requiere Facebook Business Account

#### LinkedIn
- Ver guía completa en `API_SETUP_GUIDE.md`
- Requiere LinkedIn Company Page

### 3. Importar Workflows

1. Abrir n8n
2. Workflows → Import from File
3. Importar en orden:
   - `cm_content_generator_v1.json`
   - `cm_publisher_v1.json`

4. En cada workflow, reemplazar:
   - `YOUR_SHEET_ID` → Tu Google Sheet ID
   - `YOUR_GOOGLE_CREDENTIAL_ID` → ID de credential Google Sheets
   - `YOUR_GROQ_CREDENTIAL_ID` → ID de credential Groq
   - `YOUR_LEONARDO_CREDENTIAL_ID` → ID de credential Leonardo AI
   - `YOUR_IG_USER_ID` → Instagram User ID (Meta)
   - `YOUR_COMPANY_ID` → LinkedIn Company ID

---

## 📅 Uso Diario

### Workflow 1: Content Generator

**Qué hace:**
- Lee el calendario de Google Sheets
- Genera captions con IA para posts de hoy
- Crea imágenes con Leonardo AI
- Actualiza el calendario con estado "Listo"

**Cuándo se ejecuta:**
- Automático: Todos los días a las 8:00 AM
- Manual: Click en "Manual Trigger" para testing

**Resultado:**
Tus posts quedan con:
- Caption generado ✅
- Hashtags ✅
- Imagen URL ✅
- Estado: "Listo" (listos para publicar)

---

### Workflow 2: Publisher

**Qué hace:**
- Lee el calendario buscando posts "Listos"
- Verifica si llegó la hora de publicación
- Publica en las redes configuradas (Instagram, LinkedIn, X)
- Marca como "Publicado" en el calendario

**Cuándo se ejecuta:**
- Automático: Cada 3 horas
- Manual: Click en "Manual Trigger"

**Flujo:**
```
1. Lee calendario
2. Filtra posts "Listos" con hora <= ahora
3. Por cada post:
   - Si tiene "Instagram" → Publica en Instagram
   - Si tiene "LinkedIn" → Publica en LinkedIn  
   - Si tiene "X" → Log (pendiente implementar)
4. Marca como "Publicado"
```

---

## 🔧 Testing

### Probar Content Generator

1. En Google Sheets, agrega fila de prueba:
   ```
   Fecha: HOY
   Tipo Post: Tip Práctico
   Tema: Automatización con IA
   Red Social: Instagram
   Hora Publicación: 10:00
   Estado: Pendiente
   ```

2. En n8n → Workflow "Content Generator"
3. Click "Execute Workflow" (botón "play")
4. Verificar que se actualiza el Sheet con Caption e Imagen

### Probar Publisher

1. En Google Sheets, cambia un post a:
   ```
   Estado: Listo
   Hora Publicación: (hora pasada)
   ```

2. En n8n → Workflow "Publisher"
3. Click "Execute Workflow"
4. Verificar que se publica y cambia a "Publicado"

---

## 📊 Monitoreo

### Ver Posts Generados
- Abrir Google Sheets
- Columna "Caption" tiene el texto generado
- Columna "Imagen_URL" tiene la imagen de Leonardo AI

### Ver Posts Publicados
- Filtrar por Estado = "Publicado"
- Columna "Fecha_Publicacion" muestra cuándo se publicó

### Ver Errores
- n8n → Executions
- Revisar workflows con estado "error"
- Logs muestran qué falló

---

## ⚙️ Personalización

### Cambiar Horarios

**Content Generator:**
```json
"triggerAtHour": 8  // Cambiar hora (0-23)
```

**Publisher:**
```json
"hoursInterval": 3  // Cambiar frecuencia (ej: 2 = cada 2h)
```

### Modificar Prompts IA

Editar archivo `prompt_library.json` con tus propios prompts por tipo de post.

### Agregar Más Posts

Duplicar filas en Google Sheets con nuevos temas y fechas.

---

## 🚨 Troubleshooting

### "No se genera Caption"
- Verificar que Groq API key es válida
- Revisar que el prompt no está vacío
- Chequear logs de n8n

### "No se genera Imagen"
- Verificar Leonardo AI API key
- Chequear cuota mensual (8500 tokens/mes)
- Revisar que el prompt de imagen es válido

### "No se publica en Instagram"
- Verificar Meta Access Token no expiró
- Confirmar que Instagram User ID es correcto
- Chequear que imagen URL es pública

### "Workflow no se ejecuta automáticamente"
- Verificar que workflow está "Activado" (toggle arriba)
- Revisar Cron está configurado
- Chequear timezone de tu servidor n8n

---

## 📈 Próximos Pasos

1. ✅ Obtener APIs faltantes (Meta, LinkedIn)
2. ✅ Probar generación manual
3. ✅ Probar publicación manual
4. ✅ Activar workflows automáticos
5. ⏳ Implementar X/Twitter (Phantom Buster)
6. ⏳ Agregar Facebook y TikTok
7. ⏳ Crear Engagement Bot (respuestas automáticas)
