# Solución: Error de Seguridad en n8n (Arguments)

El error **`[ERROR: Cannot access "arguments" due to security concerns]`** es un mecanismo de defensa interno muy conocido de n8n. 

## 🛡️ ¿Por qué pasa esto?
El motor que evalúa las expresiones en n8n está protegiendo el sistema. En el lenguaje de programación JavaScript, la palabra `arguments` (específicamente cuando va después de la palabra `function`, como en `function.arguments`) es una palabra reservada que podría usarse para hackear el servidor. n8n ve eso en tu código y lo bloquea por seguridad.

## ✅ La Solución (Bracket Notation)
Para engañar al sistema de seguridad y decirle "solo quiero leer el texto que me mandó Vapi, no estoy hackeando nada", debes cambiar la forma en la que escribes la ruta. En lugar de usar un punto (`.arguments`), utilizas corchetes y comillas (`["arguments"]`).

### 1. Campo: Número Del Destinatario
Borra lo que tienes y pega EXACTAMENTE esto:
```javascript
{{ $json.body.message.toolCalls[0].function["arguments"].phone }}
```

### 2. Campo: Mensajería (Message)
Borra lo que tienes y pega EXACTAMENTE esto:
```javascript
{{ $json.body.message.toolCalls[0].function["arguments"].message }}
```

*(Si por alguna razón Vapi en esta nueva versión está enviando los argumentos como un texto plano en lugar de un objeto JSON, n8n te dirá "undefined". Si eso llega a pasar, la fórmula sería `{{ JSON.parse($json.body.message.toolCalls[0].function["arguments"]).phone }}`. Pero prueba primero la opción 1 que es la estándar).*

¡Cambia esos dos campos por la versión con corchetes y el error de seguridad desaparecerá al instante! 🦍🛡️🚀
