# 🎙️ Guía de Configuración: Google Cloud TTS en n8n

Para que el asistente de voz de Austria funcione correctamente, debes configurar las credenciales de Google Cloud en tu instancia de n8n.

## 🛠️ Paso 1: Crear Credenciales en Google Cloud
1. Ve a la [Consola de Google Cloud](https://console.cloud.google.com/).
2. Crea un proyecto (o selecciona uno existente).
3. Habilita la **Cloud Text-to-Speech API**.
4. Ve a **IAM y administración > Cuentas de servicio**.
5. Crea una cuenta de servicio, dale el rol de **Cloud Text-to-Speech User**.
6. En la pestaña **Claves**, genera una nueva clave **JSON**. Descárgala.

## 🔑 Paso 2: Configurar en n8n
1. En n8n, ve a **Credentials > Add Credential**.
2. Busca **Google Cloud Text-to-Speech API**.
3. Abre el archivo JSON que descargaste y copia/pega el contenido en n8n:
   - **Project ID**: El ID de tu proyecto de Google.
   - **Credentials JSON**: El contenido completo del archivo `.json`.

## ⚙️ Paso 3: Sincronizar con el Workflow
El nodo **"Generar Audio (TTS)"** en los workflows de Austria usa estas variables dinámicas:
- **Language Code**: `{{ $json.tts_language_code }}`
- **Voice Name**: `{{ $json.tts_voice_name }}`

> [!IMPORTANT]
> Asegúrate de que el ID de la credencial en n8n coincida con el que el flujo espera, o selecciona tu nueva credencial manualmente en el nodo de TTS.

## 🧪 Paso 4: Prueba de Funcionamiento
Envía un mensaje como "Guten Tag" a tu bot de WhatsApp. Si n8n devuelve un archivo de audio con voz alemana clara, ¡la configuración es exitosa!
