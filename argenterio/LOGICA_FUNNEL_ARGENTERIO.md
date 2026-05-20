# Lógica de flujo Argenterio.com (E2E)

Para que el negocio funcione de forma autónoma, el flujo se divide en dos fases críticas:

## Fase 1: El Gancho (Pre-Pago)
**Objetivo:** Capturar el lead y vender el reporte de $9 USD.
1.  **Formulario (Web):** El usuario deja sus datos.
2.  **Análisis IA (n8n):** Un asistente (Groq) analiza los números y genera un "Teaser" (un párrafo que explica el riesgo detectado).
3.  **Respuesta Inmediata (Web):** El sitio muestra el Teaser en la "consola" y activa los botones de pago (MercadoPago/PayPal).
4.  **Respaldo (Brevo Email):** n8n envía un email al usuario con el mismo Teaser y links de pago. *Esto es por si el usuario cierra el navegador antes de pagar.*

## Fase 2: La Entrega (Post-Pago)
**Objetivo:** Enviar el producto final tras recibir el dinero.
1.  **Confirmación MP/PayPal:** Cuando el usuario paga, la plataforma (MercadoPago o PayPal) envía un aviso (IPN/Webhook) a n8n.
2.  **Informe Final:** n8n recibe este aviso, genera el PDF/HTML del diagnóstico completo y lo envía por email.

---

## 🛠️ ¿Por qué solo ves PayPal ahora?
Mi fix del `index.html` es "防 (Protección contra fallos)". Si el nodo de **MercadoPago** en n8n falla (por ejemplo, si el token no tiene el `Bearer` o la cuenta está en sandbox), el sitio **oculta el botón de MP** automáticamente y deja solo PayPal.

**Lógica de visibilidad en el código:**
```javascript
if (checkoutUrl) { 
   // Muestra MP 
} else { 
   // MP falló en n8n -> Oculta MP y deja PayPal como única opción activa.
}
```

## 🚀 Próximos Pasos
He preparado el **V11 MASTER** que reconecta Brevo para que el email también salga.
