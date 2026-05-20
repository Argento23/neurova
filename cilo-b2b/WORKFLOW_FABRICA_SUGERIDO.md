# Flujo de Automatización sugerido para la Fábrica Cilo (N8N)

Esta es una propuesta de flujo automatizado (Factory Automation V1) diseñada para optimizar los pedidos mayoristas que entran desde el catálogo digital de Cilo. 

## 🎯 Objetivo del Flow
Capturar la intención de compra del cliente mayorista, verificar el stock en tiempo real (o alertar a producción), y generar una orden preliminar para acelerar las ventas B2B.

## ⚙️ Estructura del n8n Workflow sugerido:

1. **Trigger Inicial (Webhook o Catch Hook de WhatsApp)**: 
   - Cuando un distribuidor hace clic en "Consultar Stock Mayorista" en la web de Cilo, se abre WhatsApp.
   - Si usas *Evolution API* o *Chatwoot*, este nodo atrapa el primer mensaje que diga: `"Hola, me interesa el producto [Nombre]..."`

2. **Nodo de Extracción (IA Groq + Llama 3)**:
   - Toma el mensaje entrante y extrae:
     - Nombre del producto solicitado.
     - Cantidad o formato sugerido (si lo menciona).
     - Nombre y teléfono del distribuidor.

3. **Nodo de Verificación Rápida (Google Sheets / Base de Datos)**:
   - Busca el producto extraído en una planilla de Excel (Google Sheets) maestra de la fábrica donde esté el stock actualizado.

4. **Nodo Condicional (Router / If)**:
   - **Camino A (Hay Stock)**: Genera un PDF o cotización rápida y responde al cliente por WhatsApp: *"¡Hola! Sí, tenemos stock de [Producto] en formato [Formato]. Te adjunto la lista de precios mayorista. ¿Cuántas cajas necesitas?"*
   - **Camino B (Sin Stock o Bajo Stock)**: 
     - Envía un mensaje a la línea de Producción (Telegram o WhatsApp interno interno): 🚨 `"ALERTA PRODUCCIÓN: Pedido entrante por [Producto]. Revisar horno/stock urgente."`
     - Al cliente le responde: *"¡Hola! Estamos verificando la disponibilidad exacta en fábrica para pasarte la mejor fecha de entrega. En 10 minutos un asesor comercial se comunica contigo."*

5. **Nodo de CRM (Notion, Pipedrive o Sheets)**:
   - Guarda el contacto del distribuidor como un "Lead Caliente", registrando el producto que le interesa para futuras campañas de remarketing.

## 💡 Ventajas para la Fábrica:
- **Responde 24/7** a consultas de distribuidores, evitando que se enfríe la venta.
- **Conecta Marketing con Producción**: Si un producto se pide mucho y no hay stock, la fábrica se entera al instante.
- **Base de Datos B2B**: Empiezan a armar un listado de distribuidores por producto para enviarles promos cuando haya excedente de stock.
