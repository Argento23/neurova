-- ============================================================================
-- FIX: Limpiar leads sobre-contactados y agregar soporte para rechazos
-- ============================================================================

-- 1. Agregar columna rejection_reason si no existe
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 2. Marcar como DEAD todos los leads contactados 2+ veces que nunca respondieron
UPDATE sales_leads 
SET outreach_status = 'dead', 
    pipeline_stage = 'dead',
    rejection_reason = 'max_contacts_reached',
    updated_at = NOW()
WHERE outreach_count >= 2 
  AND outreach_status = 'contacted'
  AND pipeline_stage NOT IN ('replied', 'meeting', 'proposal', 'closed');

-- 3. Ver cuántos leads se limpiaron
SELECT 
  outreach_status, 
  pipeline_stage, 
  COUNT(*) as total,
  AVG(outreach_count) as avg_contacts
FROM sales_leads 
GROUP BY outreach_status, pipeline_stage
ORDER BY total DESC;

-- 4. Ver leads que quedaron activos para outreach (los que SÍ se contactarían)
SELECT COUNT(*) as leads_pendientes 
FROM sales_leads 
WHERE outreach_status = 'pending' 
  AND ai_score >= 50
  AND pipeline_stage NOT IN ('rejected', 'dead', 'unsubscribed')
  AND (phone IS NOT NULL OR email IS NOT NULL);
