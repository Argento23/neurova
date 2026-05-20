# Proyección Financiera y de Escalabilidad: SaaS Economía Social

Basado en la infraestructura actual (VPS 8GB RAM, 4 vCores, 75GB SSD) y la estrategia de precios modulares ("Guerrilla Directa").

---

### Fase 1: El Validadores (1 a 5 Usuarios)
*El objetivo aquí es probar el sistema en el mundo real, ajustar prompts y tener casos de éxito documentados.*

*   **Infraestructura:** Holgada (Uso de recursos < 10%).
*   **Usuarios:** 5 emprendedores (Ej: El fabricante de juguetes + 4 del curso).
*   **Ticket Promedio Mensual:** $25.000 ARS (Mix entre módulos básicos e intermedios).
*   **Ingresos Setups (Única vez):** $175.000 ARS ($35.000 x 5).
*   **Ingresos Mensuales Brutos (MRR):** $125.000 ARS.
*   **Costo Servidor:** ~$20.000 ARS (Tu VPS actual ya pago).
*   **Ganancia Neta Mensual:** **$105.000 ARS**.

---

### Fase 2: Penetración de Grupo (10 a 20 Usuarios)
*El boca a boca hace efecto. Empiezan a unirse los que al principio dudaban, al ver que los del Nivel 1 están vendiendo.*

*   **Infraestructura:** Cómoda (Uso de recursos ~ 25% - 40%).
*   **Usuarios:** 20 emprendedores.
*   **Ticket Promedio Mensual:** $30.000 ARS (Empiezan a pedir el Bot de WhatsApp porque están colapsados).
*   **Ingresos Mensuales Brutos (MRR):** $600.000 ARS.
*   **Consumo APIs (IA/OpenAI):** ~$25.000 ARS / mes.
*   **Costo Servidor:** $20.000 ARS.
*   **Ganancia Neta Mensual:** **$555.000 ARS**.

---

### Fase 3: Saturación del Nicho (40 Usuarios - El Curso Completo)
*Dominás el ecosistema local. Sos "el chico de la IA de la feria".*

*   **Infraestructura:** En su punto óptimo (Uso de recursos ~ 60% - 80%). *Alerta temprana: Podrías necesitar vigilar la RAM de N8N.*
*   **Usuarios:** 40 emprendedores.
*   **Ticket Promedio Mensual:** $35.000 ARS (Muchos migran al módulo con imágenes premium).
*   **Ingresos Mensuales Brutos (MRR):** $1.400.000 ARS.
*   **Consumo APIs (IA/OpenAI):** ~$60.000 ARS / mes.
*   **Costo Servidor:** $20.000 ARS.
*   **Ganancia Neta Mensual:** **$1.320.000 ARS** (Aprox. $1.000 USD limpios).

---

### Fase 4: Expansión (100+ Usuarios - Multi-Municipio o B2B Mayorista)
*Tu VPS de 8GB empieza a transpirar. Como usás Contabo, el salto natural es a la máquina de 12GB o, si querés estar sobrado, a la de 24GB (Cloud VPS L).*

*   **Infraestructura:** Escalada a 12GB RAM (Costo ~$10 USD/mes) o 24GB RAM (Costo ~$16 USD/mes).
*   **Usuarios:** 100 emprendedores.
*   **Ticket Promedio Mensual:** $35.000 ARS.
*   **Ingresos Mensuales Brutos (MRR):** $3.500.000 ARS.
*   **Consumo APIs (IA/OpenAI):** ~$150.000 ARS / mes.
*   **Costo Servidor:** ~$20.000 ARS (El aumento del servidor en Contabo es ínfimo frente a tus ganancias).
*   **Ganancia Neta Mensual:** **$3.330.000 ARS** (Aprox. $2.500+ USD limpios).

---

### El "Cheat Code" Financiero (Por qué este modelo es imbatible)
El verdadero negocio no es cobrar $15.000 o $35.000. El verdadero negocio es el **Costo Marginal Cero**.
Agregar al usuario número 41 no te cuesta NADA. Tu servidor es el mismo. Tu tiempo es mínimo (porque la tienda la clonas y el bot ya tiene las instrucciones maestras). Cada peso nuevo que entra es 95% ganancia pura.

---

### Herramientas de Control y Gestión (Tech Stack)
Para mantener el control total sobre la operación con márgenes tan altos y sin volverte loco en el intento, el sistema está orquestado mediante este stack tecnológico:

1.  **Contabo VPS (Hardware):** El corazón de la operación. Aquí corre todo el sistema a un costo fijo predecible, independientemente del volumen de datos (a diferencia del Cloud computing tradicional).
2.  **EasyPanel (Despliegue y Monitoreo):** Panel de control tipo Docker para manejar las instancias de código, ver consumos de memoria y CPU, y reiniciar servicios con un clic. Es tu sala de control del servidor.
3.  **Supabase (Base de Datos y Autenticación):** Gestiona los perfiles de los emprendedores, los productos (inventario), las imágenes (Storage) y quién puede acceder a qué (RLS). Funciona como tu sistema contable y de stock centralizado.
4.  **n8n (Motor de Automatización):** El cerebro operativo ("Content Factory"). Aquí creás, editás y monitoreás todos los webhooks, desde la publicación automática en Instagram hasta el procesamiento de pagos.
5.  **Clerk (Autenticación):** Maneja el inicio de sesión del "Panel de Emprendedor", garantizando seguridad nivel empresarial para cada cliente.
6.  **Evolution API (WhatsApp):** Conecta los números de WhatsApp de los clientes con el bot (Alex AI) para automatizar la atención sin depender de la costosa API oficial de Meta.
7.  **Zadarma (Opcional - Voz):** Para escalabilidad futura con agentes de voz (Llamadas entrantes/salientes).
8.  **Git/Github:** Control de versiones del código para actualizaciones sin miedo a romper el sistema en producción.
9.  **OpenAI API / LLMs:** El motor cognitivo que redacta posts y responde mensajes de venta. Es el único costo variable importante (además de tu tiempo).
