# Ajuste de Voz en Webchat (Next.js - window.speechSynthesis)

¡Acabo de encontrar el origen exacto del "problema"! Tienes toda la razón, esta voz no viene ni de Vapi ni de n8n. 

Al revisar el código fuente de tu aplicación base (`c:\Users\Gustavo\Downloads\neurova\template-saas\src\components\AIChatWindow.tsx`), encontré que el chat emergente que está abajo a la derecha de la web usa una tecnología llamada **Web Speech API** (`window.speechSynthesis`).

## ¿Qué es esto y por qué suena a mujer?
Es una función gratuita que viene **incorporada en el navegador web** (Chrome, Safari, Edge). En lugar de pagarle a una IA externa para que lea el texto, tu página web le pide a la computadora o al celular del usuario que lo lea en voz alta. 

Por defecto, casi todos los sistemas operativos (Windows, Android, iOS) tienen configurada una voz femenina ("Google Español", "Paulina", "Helena") como la voz predeterminada del sistema.

---

## ¿Cómo cambiarlo a voz de Hombre?

No puedes controlar la voz 100% como en ElevenLabs (porque depende de las voces instaladas en el celular de quien visita tu web), pero **SÍ puedes forzar a que el navegador intente buscar una voz masculina**.

Para arreglar esto, debes editar el archivo `AIChatWindow.tsx` en tus proyectos de React/Next.js (`template-saas` y `austria-saas`):

**Archivo:** `src/components/AIChatWindow.tsx`
**Línea aprox:** 28

Busca esta función:
```typescript
    const speak = (text: string) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES'; // Default, but AI can be multilingual
        window.speechSynthesis.speak(utterance);
    };
```

**Reemplázala por este código para buscar voces masculinas:**

```typescript
    const speak = (text: string) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        
        // 1. Obtener todas las voces disponibles en el dispositivo del usuario
        const voices = window.speechSynthesis.getVoices();
        
        // 2. Intentar buscar una voz en español que sea de hombre (Male)
        // Los nombres de voces masculinas suelen contener palabras como "Pablo", "Diego", "Jorge", o "Male"
        const maleVoice = voices.find(voice => 
            voice.lang.includes('es') && 
            (voice.name.toLowerCase().includes('pablo') || 
             voice.name.toLowerCase().includes('diego') ||
             voice.name.toLowerCase().includes('jorge') ||
             voice.name.toLowerCase().includes('male'))
        );

        // 3. Si encuentra la de hombre, la usa; si no, usa la primera en español que encuentre.
        if (maleVoice) {
            utterance.voice = maleVoice;
        }

        window.speechSynthesis.speak(utterance);
    };
```

### ¿Y para Cilo?
La página web de Cilo (`cilo.generarise.space`) es un HTML plano, no usa el componente `AIChatWindow.tsx` de React, por eso no tiene ese chat leyendo los textos. Si quieres agregar el Voice AI a Cilo, recomiendo la ruta profesional: Ponerle el código de Vapi directamente en su HTML, como te comenté antes.

**Resumen:** Esa voz femenina es la de Windows/Android leyendo la pantalla gratis. Modificando esa función en tu código fuente, forzarás a que Windows lea con voz de hombre (ej. Pablo o Diego). 🦍🛡️🚀
