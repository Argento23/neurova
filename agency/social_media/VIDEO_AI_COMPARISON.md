# Comparativa de APIs para Generación de Videos

## Opción Recomendada: D-ID ✅

### D-ID
- **Precio:** $5.99/mes (10 minutos)
- **Mejor para:** Videos con avatar hablando
- **API:** ✅ Incluida desde plan Lite
- **Pros:**
  - Más económico
  - Avatares realistas
  - Voz natural (Microsoft TTS)
  - Fácil integración
- **Cons:**
  - Solo avatar parlante (no motion graphics complejos)
- **Uso estimado:** ~5-6 videos/mes (60 seg c/u)

### Synthesia
- **Precio:** $29/mes (10 min) - Sin API
- **Precio API:** $89/mes (40 min)
- **Mejor para:** Videos corporativos largos
- **Pros:**
  - Avatares premium
  - Templates profesionales
- **Cons:**
  - 5x más caro
  - API solo en plan Creator ($89)
- **Conclusión:** ❌ Demasiado caro para shorts

### Pictory
- **Precio API:** $49 (120 créditos)
- **Mejor para:** Convertir texto/blog a video
- **Pros:**
  - Buenos para contenido automático
  - Buena biblioteca de stock
- **Cons:**
  - No incluye avatares parlantes
  - Modelo de créditos (no minutos)
- **Conclusión:** ~ Alternativa si no quieres avatares

## Decisión Final: D-ID

**Ventajas para GenerArise:**
1. **Costo:** $5.99/mes vs $89/mes (Synthesia)
2. **Suficiente:** 10 min/mes = 10 videos de 60 seg
3. **Calidad:** Avatares realistas + natural voice
4. **API:** Integración directa desde n8n
5. **TikTok/YouTube:** Formato perfecto para shorts

**Workflow propuesto:**
```
Groq genera guion → D-ID crea video con avatar → 
Guarda en Google Drive → Actualiza calendar con URL →
Publisher automático a TikTok/YouTube
```

**Costos totales Community Manager:**
- Leonardo AI: $24/mes (imágenes)
- D-ID: $5.99/mes (videos)
- Groq: ~$10/mes (IA)
- **Total: ~$40/mes**
