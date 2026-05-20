# Guía de Integración PayPal (Internacional)

Esta guía te ayudará a crear los enlaces de pago correctos en PayPal para vender tus servicios internacionalmente (en Dólares o Euros) sin riesgo de bloqueos.

## 1. Crear Botones / Enlaces de Pago ("PayPal Buttons")

La forma más robusta es crear un botón desde el panel de PayPal, ya que te permite configurar precios fijos y redirecciones.

1.  Inicia sesión en tu cuenta de PayPal (desde un navegador en PC).
2.  Ve a este enlace directo: [PayPal Button Manager](https://www.paypal.com/buttons/) (o busca "Botones de PayPal" en el menú herramientas de vendedor).
3.  Selecciona la opción **"Comprar ahora"** (Buy Now) o **"Pago inteligente"** (Smart Buttons). *Recomiendo "Comprar ahora" para empezar por ser más simple.*

### Configuración del Botón:
*   **Nombre del artículo:** Ej: "Auditoría de IA - GenerArise" o "Plan Mensual MindHafen".
*   **ID del artículo:** (Opcional) Puedes poner un código interno tuyo.
*   **Precio:** Define el monto (Ej: 100) y la moneda (**USD** o **EUR**).
    *   *Nota: Si tu cuenta es Argentina, el saldo se quedará en PayPal en esa moneda.*

### Personalización (Importante para la experiencia):
En el apartado de **"Paso 3: Personalizar funciones avanzadas"** (o similar):
*   **¿Desea permitir que el cliente cambie las cantidades?**: No.
*   **¿Desea que los clientes le envíen instrucciones?**: Sí/No (según prefieras).
*   **Dirigir a los clientes a esta URL cuando cancelen su pago:** Pon la URL de tu web (ej: `https://generarise.space/`).
*   **Dirigir a los clientes a esta URL cuando finalicen el pago (Éxito):**
    *   Aquí debes poner una página de "Gracias" o directamente tu enlace de **Cal.com** para que agenden de inmediato tras pagar.
    *   Ejemplo: `https://cal.com/neurova/auditoria-premium`

## 2. Obtener el Código o Enlace

Una vez guardado el botón, PayPal te dará dos opciones:

1.  **Pestaña "Sitio web" (Código HTML):** Un bloque `<form>...</form>`. Esto es para incrustar un botón feo de PayPal.
2.  **Pestaña "Correo electrónico" (Enlace simple):** Un link corto tipo `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick...`.
    *   **¡ESTE ES EL QUE QUEREMOS!** Copia este enlace.

---

## 3. Integración en tu Web (GenerArise / MindHafen)

Ahora que tienes el enlace seguro de cobro, lo usaremos en tu sitio web.

### En `index.html` (Botones de Precios):
Reemplaza los botones que ahora apuntan a `#` o a Stripe con tu nuevo link de PayPal.

**Ejemplo de código a modificar:**
```html
<!-- Antes -->
<a href="#" class="btn-primary">Comprar Ahora</a>

<!-- Después (Internacional) -->
<a href="TU_LINK_DE_PAYPAL_AQUI" class="btn-primary" target="_blank">Pagar con PayPal (USD/EUR)</a>
```

### Estrategia Híbrida (Recomendada):
Puedes poner dos botones debajo del precio:
*   🇦🇷 **Argentina:** [Pagar con Mercado Pago]
*   🌍 **Internacional:** [Pagar con PayPal]

---

## 4. Tarea para ti:
Genera los enlaces de pago para tus servicios en PayPal siguiendo el paso 1 y 2, y **pégalos en un archivo de texto** (o pásamelos por aquí) para que yo pueda integrarlos en el código de tu sitio web correctamente.
