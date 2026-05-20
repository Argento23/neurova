# Estilos Alternativos para el Teaser de Análisis Financiero

## Opción 1: Estilo Alerta Roja (Actual - Recomendado)
```html
<div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%); border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0; font-family: 'Segoe UI', sans-serif;">
    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #333;">
        <i style="color: #ef4444; margin-right: 8px;">⚠️</i>
        <strong style="color: #dc2626;">ANÁLISIS CRÍTICO:</strong> [CONTENIDO AQUÍ]
    </p>
</div>
```
**Uso**: Para alertas críticas y urgentes

---

## Opción 2: Estilo Advertencia Naranja
```html
<div style="background: linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%); border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; font-family: 'Segoe UI', sans-serif; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.15);">
    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #333;">
        <i style="color: #f59e0b; margin-right: 8px;">⚡</i>
        <strong style="color: #ea580c;">DIAGNÓSTICO FINANCIERO:</strong> [CONTENIDO AQUÍ]
    </p>
</div>
```
**Uso**: Para advertencias serias pero no críticas

---

## Opción 3: Estilo Premium (Marca GenerArise)
```html
<div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%); border-left: 4px solid #6366f1; padding: 20px; border-radius: 12px; margin: 20px 0; font-family: 'Segoe UI', sans-serif; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);">
    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #333;">
        <i style="color: #6366f1; margin-right: 8px;">🔍</i>
        <strong style="color: #6366f1;">HALLAZGOS CLAVE:</strong> [CONTENIDO AQUÍ]
    </p>
</div>
```
**Uso**: Para mantener coherencia con branding de GenerArise (más profesional, menos alarmista)

---

## Opción 4: Estilo Tarjeta Elevada (Moderna)
```html
<div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 24px; border-radius: 12px; margin: 20px 0; font-family: 'Segoe UI', sans-serif; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);">
    <div style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
        ⚠️ Situación de Riesgo
    </div>
    <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #374151;">
        [CONTENIDO AQUÍ]
    </p>
</div>
```
**Uso**: Para un look más moderno y menos "email tradicional"

---

## Opción 5: Estilo Minimalista con Ícono
```html
<table cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0; width: 100%; background: #fef2f2; border-radius: 8px; overflow: hidden;">
    <tr>
        <td style="width: 60px; background: #ef4444; text-align: center; vertical-align: middle;">
            <div style="font-size: 28px; color: white;">⚠️</div>
        </td>
        <td style="padding: 20px;">
            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #333; font-family: 'Segoe UI', sans-serif;">
                <strong style="color: #dc2626;">ALERTA FINANCIERA:</strong> [CONTENIDO AQUÍ]
            </p>
        </td>
    </tr>
</table>
```
**Uso**: Mejor compatibilidad con clientes de email antiguos (Outlook)

---

## 📌 Recomendación

Para **email HTML** → Usa **Opción 1** (Alerta Roja) o **Opción 5** (Minimalista)
- Mejor compatibilidad con clientes de email
- Mayor impacto visual
- Tono alarmista apropiado para ventas

Para **respuesta web/app** → Usa **Opción 3** (Premium) o **Opción 4** (Moderna)
- Branding consistente
- Diseño más sofisticado
- Profesional pero urgente

---

## 🎨 Personalización de Colores

### Rojo (Crítico):
- Principal: `#ef4444`
- Oscuro: `#dc2626`
- Fondo: `rgba(239, 68, 68, 0.1)`

### Naranja (Advertencia):
- Principal: `#f59e0b`
- Oscuro: `#ea580c`
- Fondo: `rgba(249, 115, 22, 0.1)`

### Púrpura (Marca):
- Principal: `#6366f1`
- Rosa: `#ec4899`
- Fondo: `rgba(99, 102, 241, 0.08)`

---

## 💡 Tips para el Prompt de IA

1. **Especificidad**: Siempre pide que use números reales del usuario
2. **Urgencia**: Palabras clave: "crítico", "riesgo", "déficit", "peligro"
3. **Profesionalismo**: Balance entre alarma y credibilidad
4. **Brevedad**: Máximo 3 líneas (60-80 palabras)
5. **Sin solución**: Solo diagnóstico, la solución se vende después

---

## Ejemplo Completo en Contexto de Email

```html
<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333;">
    Estimado/a <strong>Juan Pérez</strong>,
</p>

<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333;">
    Hemos completado el análisis preliminar de su situación financiera. Los resultados requieren su atención inmediata:
</p>

<!-- AQUÍ VA EL TEASER DE LA IA -->
<div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%); border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0; font-family: 'Segoe UI', sans-serif;">
    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #333;">
        <i style="color: #ef4444; margin-right: 8px;">⚠️</i>
        <strong style="color: #dc2626;">ANÁLISIS CRÍTICO:</strong> Sus gastos representan el 87% de sus ingresos mensuales, dejando un margen de maniobra de solo $234 USD. Con una deuda activa de $12,400 y un objetivo de estabilidad financiera, su ratio de endeudamiento está en zona de riesgo crítico.
    </p>
</div>

<p style="margin: 20px 0; font-size: 16px; line-height: 1.6; color: #333;">
    Nuestro equipo ha preparado un <strong>reporte detallado de optimización</strong> con estrategias específicas para su caso. Para acceder al análisis completo:
</p>

<!-- CTA BUTTON -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 30px 0;">
    <tr>
        <td align="center" style="padding: 10px 0;">
            <a href="[LINK_PAGO]" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                🔓 Desbloquear Reporte Completo
            </a>
        </td>
    </tr>
</table>
```
