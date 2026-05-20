-- ============================================================
-- SALES SYNERGY ENGINE — Schema Migration v2
-- Ejecutar en Supabase SQL Editor DESPUÉS del schema v1
-- ============================================================

-- 1. Agregar columnas de Discovery
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS discovery_source TEXT DEFAULT 'manual';
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS ig_username TEXT;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS ig_followers INTEGER DEFAULT 0;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS google_place_id TEXT;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS google_rating NUMERIC(2,1);
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS google_reviews_count INTEGER DEFAULT 0;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS country TEXT;

-- 2. Agregar columnas de AI Scoring
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS ai_score INTEGER DEFAULT 0;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS ai_score_breakdown JSONB DEFAULT '{}';
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS ai_score_updated_at TIMESTAMPTZ;

-- 3. Agregar columnas de Outreach
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS outreach_status TEXT DEFAULT 'pending';
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS outreach_channel TEXT;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS outreach_first_at TIMESTAMPTZ;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS outreach_last_at TIMESTAMPTZ;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS outreach_count INTEGER DEFAULT 0;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS outreach_response TEXT;

-- 4. Agregar columnas de Pipeline
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS pipeline_stage TEXT DEFAULT 'discovered';
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS deal_value NUMERIC(10,2);
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS deal_currency TEXT DEFAULT 'USD';
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS demo_scheduled_at TIMESTAMPTZ;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS lost_reason TEXT;

-- 5. Tabla de outreach log (historial de contacto)
CREATE TABLE IF NOT EXISTS sales_outreach_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES sales_leads(id) ON DELETE CASCADE,
  channel TEXT NOT NULL, -- 'whatsapp', 'email', 'instagram_dm'
  direction TEXT DEFAULT 'outbound', -- 'outbound' o 'inbound'
  message_preview TEXT,
  template_used TEXT,
  status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'read', 'replied', 'failed'
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Tabla de discovery batches (historial de búsquedas)
CREATE TABLE IF NOT EXISTS sales_discovery_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL, -- ej: "hotel boutique Buenos Aires"
  source TEXT NOT NULL, -- 'google_maps', 'instagram', 'manual'
  leads_found INTEGER DEFAULT 0,
  leads_scored INTEGER DEFAULT 0,
  leads_qualified INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. RLS para las nuevas tablas
ALTER TABLE sales_outreach_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_discovery_batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "full_access_outreach_log" ON sales_outreach_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_discovery_batches" ON sales_discovery_batches FOR ALL USING (true) WITH CHECK (true);

-- 8. Índices para performance
CREATE INDEX IF NOT EXISTS idx_sales_leads_ai_score ON sales_leads(ai_score DESC);
CREATE INDEX IF NOT EXISTS idx_sales_leads_pipeline ON sales_leads(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_sales_leads_outreach ON sales_leads(outreach_status);
CREATE INDEX IF NOT EXISTS idx_sales_leads_industry ON sales_leads(industry);
CREATE INDEX IF NOT EXISTS idx_outreach_log_lead ON sales_outreach_log(lead_id);
CREATE INDEX IF NOT EXISTS idx_discovery_batches_date ON sales_discovery_batches(created_at DESC);

-- 9. Vista materializada para el pipeline dashboard
CREATE OR REPLACE VIEW sales_pipeline_view AS
SELECT
  pipeline_stage,
  COUNT(*) as lead_count,
  AVG(ai_score) as avg_score,
  SUM(deal_value) as total_pipeline_value,
  COUNT(CASE WHEN outreach_status = 'replied' THEN 1 END) as replied_count
FROM sales_leads
GROUP BY pipeline_stage;

-- 10. Vista de leads hot (score >= 70)
CREATE OR REPLACE VIEW sales_hot_leads AS
SELECT *
FROM sales_leads
WHERE ai_score >= 70
  AND pipeline_stage NOT IN ('closed', 'lost')
ORDER BY ai_score DESC, created_at DESC;
