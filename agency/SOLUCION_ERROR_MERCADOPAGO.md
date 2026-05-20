# 🔧 Solución Error 403 MercadoPago (Access Denied)

Este error ocurre por seguridad cuando MercadoPago detecta que **la cuenta que vende es la misma que la que compra**, o cuando las credenciales no coinciden con el tipo de link.

## 🟢 Opción A: ¿Estás usando Credenciales de PRODUCCIÓN?
*(Es decir, quieres probar un pago real, con dinero real, listo para clientes)*

Si ya pusiste tus `Access Token` y `Public Key` de producción en n8n:

1.  **NO PUEDES probar logueado con tu propia cuenta.**
2.  **Solución:**
    *   Abre una ventana de **Incógnito / Privada** en el navegador.
    *   Pega el link de pago que generó el bot.
    *   Selecciona "Pagar como invitado" (Nueva tarjeta) o logueate con **otra cuenta de MercadoPago distinta** (puedes pedirle a un amigo que pruebe el link).
    *   Si usas tu misma cuenta, **siempre dará Error 403**.

---

## 🟡 Opción B: ¿Estás en MODO PRUEBAS (Sandbox)?
*(Quieres simular el pago sin gastar dinero real)*

Si estás usando las credenciales de "Test" o "Sandbox" en el nodo de MercadoPago, debes hacer un cambio en el nodo final de n8n.

### Pasos para arreglarlo en n8n:

1.  Abre el nodo **"Responder a Web"** (o como se llame el último nodo).
2.  Busca el campo donde definimos `mp_link`.
3.  Cambia la expresión:
    *   **De:** `{{ $('Crear Link MP').item.json.init_point }}`
    *   **A:** `{{ $('Crear Link MP').item.json.sandbox_init_point }}`

> **Nota:** `init_point` es para producción. `sandbox_init_point` es para pruebas. Si usas credenciales de prueba con el link de producción, da error.

---

## 🔍 Checklist de Credenciales

Verifica en el nodo de MercadoPago en n8n:

1.  ¿Qué credencial está seleccionada en "Credential for Mercado Pago API"?
2.  Entra a [MercadoPago Developers](https://www.mercadopago.com.ar/developers/panel) > Tus Integraciones.
3.  Si usas **Credenciales de Prueba**:
    *   Debes usar `sandbox_init_point`.
    *   Debes usar Tarjetas de Prueba (búscalas en Google como "Tarjetas de prueba MercadoPago").
4.  Si usas **Credenciales de Producción**:
    *   Debes usar `init_point`.
    *   Debes probar desde OTRO dispositivo o Incógnito.

## 🚀 Resumen
Si quieres probarlo **YA** mismo:
1. Asegúrate que en n8n estás mapeando `sandbox_init_point` si estás testeando.
2. Abre el link en **Incógnito**.
