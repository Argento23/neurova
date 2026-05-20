# 🎙️ GUÍA DE SELECCIÓN DE VOCES (GOOGLE TTS & OTROS)

## 🚨 PROBLEMA CON GOOGLE TTS:
Google TTS **NO es políglota nativo** como ElevenLabs.
Si usas una voz en INGLÉS para leer ALEMÁN, va a sonar horrible.

### 🛠️ LA SOLUCIÓN (ESTRATEGIA "CAMALEÓN"):
Tu asistente ya detecta el idioma (`idioma: "de"`, `idioma: "es"`, etc).
Debes usar ese campo para **CAMBIAR LA VOZ DINÁMICAMENTE** en tu flujo (n8n/Make).

---

## 🔧 CONFIGURACIÓN GOOGLE CLOUD TTS (Recomendada)
Usa las voces **Neural2** (son las mejores y gratis hasta cierto límite).

### 1. MAPEO DE VOCES (Copiar esto en tu nodo IF/Switch):

-   **Si `idioma` == "de" (Alemán):**
    -   Modelo: `de-DE-Neural2-B` (Masculina, seria)
    -   *Backup:* `de-DE-Wavenet-B`

-   **Si `idioma` == "en" (Inglés):**
    -   Modelo: `en-US-Neural2-J` (Masculina, profesional)
    -   *Backup:* `en-US-Wavenet-D`

-   **Si `idioma` == "es" (Español):**
    -   Modelo: `es-US-Neural2-B` (Masculina, neutra)
    -   *Backup:* `es-US-Wavenet-B`

-   **Si `idioma` == "it" (Italiano):**
    -   Modelo: `it-IT-Neural2-C` (Masculina)

### 2. SI NO PUEDES CAMBIAR LA VOZ (SOLUCIÓN DE EMERGENCIA):
Si tu sistema solo permite 1 voz fija pase lo que pase:
-   Usa **en-US-Neural2-J**.
-   Es la que "menos mal" pronuncia otros idiomas, pero seguirá teniendo acento gringo fuerte.
-   **Truco:** En el prompt, dile al AI que escriba todo fonéticamente en inglés (Spanglish).
    -   Ej: "Hallo" -> "Hah-lo"
    -   Ej: "Gracias" -> "Grah-see-as"

---

## 🚀 OPCIÓN 1: ELEVENLABS (La mejor calidad)
Si usas ElevenLabs, debes configurar esto:

1.  **Modelo (CRÍTICO):**
    -   Usa **Eleven Multilingual v2** o **Eleven Turbo v2.5**.
    -   *NUNCA uses "Eleven English v1" o "Monolingual".*

2.  **Voces Recomendadas (Probadas en DE/EN/ES):**
    -   🤵 **Daniel:** Voz masculina, autoridad, suena bien en Alemán y Español (neutro).
    -   👩 **Sarah:** Voz femenina, profesional, muy clara en los 3 idiomas.
    -   🧔 **Brian:** Voz profunda, estilo narrador corporativo.

3.  **Stability/Similarity:**
    -   Stability: 50%
    -   Similarity: 75%
    -   Style Exaggeration: 0% (Para que no suene "actuado").

---

## 🚀 OPCIÓN 2: OPENAI (TTS-1)
Si usas la API de OpenAI:

1.  **Modelo:** `tts-1-hd` (Alta definición).
2.  **Voz:**
    -   **Alloy:** La más neutra y versátil para multilenguaje.
    -   **Onyx:** Masculina, seria.
    -   **Nova:** Femenina, enérgica.

---

## 🔧 CÓMO ARREGLAR LA PRONUNCIACIÓN (EN EL PROMPT)
Si la voz sigue pronunciando mal, fuerza la fonética en el texto que genera la IA.

### Truco: "Spanglish" Fonético
Dile al prompt que escriba palabras difíciles "como suenan".

-   *Ejemplo:* En lugar de "Argenterío", escribe **"Ar-jen-te-rí-o"**.
-   *Ejemplo:* En lugar de "WhatsApp", escribe **"Wats-ap"**.

---

## ✅ CHECKLIST RÁPIDO
1.  ¿El motor está en **Multilingual v2**?
2.  ¿La voz elegida es famosa por ser políglota (ej. Daniel/Sarah)?
3.  ¿Estás forzando el idioma en la configuración del nodo de voz?

**Recomendación:** Usa **ElevenLabs Multilingual v2** con la voz de **Daniel**. Es infalible.
