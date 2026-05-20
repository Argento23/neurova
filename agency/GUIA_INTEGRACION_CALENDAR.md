# Guía de Integración Cal.com con Google Calendar

Esta guía detalla el proceso correcto para conectar tu cuenta de Cal.com con Google Calendar, asegurando que las fechas se guarden correctamente y configurando el medio (Google Meet, Zoom, etc.) para las entrevistas.

## 1. Cómo asociar Cal.com a Google Calendar

Para que Cal.com lea tu disponibilidad y guarde las nuevas citas en tu calendario:

1.  Inicia sesión en tu cuenta de [Cal.com](https://app.cal.com/auth/login).
2.  En el menú lateral izquierdo, ve a **Apps** (o App Store).
3.  Busca **Google Calendar** en la categoría "Calendar".
4.  Haz clic en **Install** (o Detalle) y luego en el botón para conectar tu cuenta.
5.  Se abrirá una ventana de Google: selecciona tu cuenta de correo (`gmail.com` o Google Workspace) y concede los permisos solicitados.

### Configuración de "Destination Calendar" (Dónde se guardan las citas)
Una vez conectado:
1.  Ve a **Settings** (Configuración) -> **Calendars**.
2.  Verás tu cuenta de Google conectada.
3.  **Check for conflicts**: Asegúrate de que tu calendario principal esté marcado para que Cal.com sepa cuándo estás ocupado.
4.  **Add to Calendar** (Importante): Selecciona aquí el calendario donde quieres que se **guarden** las citas confirmadas.

> **Resultado:** Ahora, cuando alguien reserve contigo, el evento aparecerá automáticamente en tu Google Calendar.

---

## 2. Cómo definir el medio de la entrevista (Ubicación)

Para que el evento incluya automáticamente el enlace de videollamada (Google Meet, Zoom, etc.):

1.  Ve a **Event Types** (Tipos de Evento) en el menú lateral.
2.  Haz clic en el evento que deseas configurar (por ejemplo, "15 min Meeting" o "Auditoría").
3.  En la pestaña de edición, busca la sección **Location** (Ubicación).
4.  Haz clic en el desplegable y selecciona el medio deseado:
    *   **Google Meet**: Generará un enlace único de Meet para cada reunión. (Recomendado si usas Google Calendar).
    *   **Zoom**: Requiere instalar la App de Zoom en Cal.com primero.
    *   **Phone Call**: Pedirá el número de teléfono al usuario.
    *   **Link / Custom**: Si prefieres usar siempre el mismo enlace (tu sala personal).
5.  Haz clic en **Update** o **Save** para guardar los cambios.

> **Resultado:** Cuando el cliente reciba el correo de confirmación y el evento se guarde en el calendario, incluirá el botón "Unirse con Google Meet" (o el enlace correspondiente).

---

## 3. Cómo poner las notificaciones y calendario en ESPAÑOL

Si los correos de confirmación ("Meeting Confirmed") o el evento en el calendario aparecen en inglés, debes cambiar la configuración regional en Cal.com:

### Opción A: Idioma del Perfil (Global)
1.  Ve a **Settings** (Configuración) -> **Profile** (Perfil).
2.  Busca la opción **Language**.
3.  Selecciona **Español**.
4.  Haz clic en **Update**.

### Opción B: Idioma Específico por Evento (Avanzado)
Si solo quieres que un tipo de reserva específico esté en español:
1.  Ve a **Event Types**.
2.  Entra a editar tu evento (ej. "Auditoria").
3.  Ve a la pestaña **Advanced** (Avanzada).
4.  Busca la opción **Language** y asegúrate de que diga **Spanish** o "Default" (si ya cambiaste tu perfil).

> **Nota:** Esto cambiará el idioma de los correos que recibe el cliente y el texto del evento que se guarda en el calendario (ej: dirá "Reunión confirmada" en lugar de "Meeting confirmed").

---

## 4. Próximos pasos
Una vez tengas tu enlace configurado (ej: `cal.com/neurova/auditoria`), recuerda actualizar el archivo **SOCIAL_MEDIA_PROFILES.md** reemplazando `[TU_LINK_DE_CAL_COM]` con tu URL real.
