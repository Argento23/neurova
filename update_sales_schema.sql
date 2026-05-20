-- ============================================================
-- AGREGAR TRACKING PARA PASO 2 (DEMO ENVIADA) 
-- Evitar envíos duplicados de links.
-- ============================================================
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS step2_sent_at TIMESTAMPTZ;

-- ============================================================
-- AGREGAR TRACKING SOCIAL (NUEVAS REDES)
-- ============================================================
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS facebook_url TEXT;
