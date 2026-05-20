# Configuración Google TTS Multilingüe

## 📋 Configuración del Nodo Google TTS

Después de tu nodo **Filtro V6**, configura el nodo **Google Cloud Text-to-Speech** así:

### Campos del Nodo:

1. **Text**
   ```
   {{ $json.clean_voice }}
   ```

2. **Language Code** (DINÁMICO - usa el detectado)
   ```
   {{ $json.tts_language_code }}
   ```
   Esto cambiará automáticamente entre: `de-DE`, `en-US`, `es-ES`, `it-IT`

3. **Voice Name** (DINÁMICO - voz nativa)
   ```
   {{ $json.tts_voice_name }}
   ```
   Voces Neural2 de alta calidad por idioma

4. **SSML Gender** (Opcional)
   ```
   {{ $json.tts_gender }}
   ```

## 🎙️ Voces Configuradas:

| Idioma | Código | Voz Neural |
|--------|--------|------------|
| 🇩🇪 Alemán | de-DE | de-DE-Neural2-F |
| 🇬🇧 Inglés | en-US | en-US-Neural2-F |
| 🇪🇸 Español | es-ES | es-ES-Neural2-A |
| 🇮🇹 Italiano | it-IT | it-IT-Neural2-A |

## ⚡ Cómo Funciona:

1. **Filtro V6** detecta el idioma del texto (alemán, inglés, español o italiano)
2. Selecciona la **voz nativa** correspondiente
3. Pasa los parámetros al nodo Google TTS
4. El audio suena profesional en todos los idiomas

## 🧪 Para Probar:

Envía mensajes en diferentes idiomas:
- "Hola, ¿cuánto cuesta?" → Voz española
- "Hello, what's the price?" → Voz inglesa
- "Guten Tag, was kostet das?" → Voz alemana
- "Ciao, quanto costa?" → Voz italiana
