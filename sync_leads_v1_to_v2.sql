-- ============================================================
-- LEAD SYNC: Backfill V2 columns from V1 data
-- Ejecutar UNA VEZ en Supabase SQL Editor
-- Esto hace que todos los leads del Panel V1 aparezcan
-- correctamente en el Sales Engine (app.generarise.space/sales)
-- ============================================================

-- 1. Sincronizar ai_score desde lead_score donde ai_score está vacío
UPDATE sales_leads
SET ai_score = lead_score
WHERE (ai_score IS NULL OR ai_score = 0)
  AND lead_score > 0;

-- 2. Mapear pipeline_stage basado en el estado del Panel V1
UPDATE sales_leads
SET pipeline_stage = CASE
    WHEN last_call_result = 'closed' THEN 'closed'
    WHEN last_call_result = 'not_interested' THEN 'lost'
    WHEN step2_sent_at IS NOT NULL THEN 'demo'
    WHEN step1_sent_at IS NOT NULL THEN 'contacted'
    WHEN lead_score >= 35 THEN 'scored'
    ELSE 'discovered'
END
WHERE pipeline_stage IS NULL 
   OR pipeline_stage = 'discovered';

-- 3. Mapear outreach_status basado en acciones realizadas
UPDATE sales_leads
SET outreach_status = CASE
    WHEN last_call_result IN ('interested', 'callback') THEN 'replied'
    WHEN step1_sent_at IS NOT NULL OR whatsapp_sent = true THEN 'contacted'
    ELSE 'pending'
END
WHERE outreach_status IS NULL 
   OR outreach_status = 'pending';

-- 4. Verificación: cuántos leads se sincronizaron
SELECT 
  COUNT(*) as total_leads,
  COUNT(CASE WHEN ai_score > 0 THEN 1 END) as with_ai_score,
  COUNT(CASE WHEN pipeline_stage != 'discovered' THEN 1 END) as with_pipeline,
  COUNT(CASE WHEN outreach_status != 'pending' THEN 1 END) as with_outreach
FROM sales_leads;
