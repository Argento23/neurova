-- ============================================================
-- SALES ENGINE Schema — GenerArise Panel
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Tabla principal de leads de ventas
CREATE TABLE IF NOT EXISTS sales_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  company TEXT,
  industry TEXT,
  region TEXT DEFAULT 'americas',
  language TEXT DEFAULT 'es',
  lead_score INTEGER DEFAULT 0,
  interest_level TEXT DEFAULT 'cold',
  budget_range TEXT,
  urgency TEXT DEFAULT 'low',
  call_count INTEGER DEFAULT 0,
  last_call_at TIMESTAMPTZ,
  last_call_result TEXT,
  last_call_duration INTEGER,
  whatsapp_sent BOOLEAN DEFAULT false,
  form_sent BOOLEAN DEFAULT false,
  form_completed BOOLEAN DEFAULT false,
  main_pain TEXT,
  ai_diagnosis TEXT,
  notes TEXT,
  next_action TEXT,
  next_action_at TIMESTAMPTZ,
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Log de llamadas
CREATE TABLE IF NOT EXISTS sales_call_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES sales_leads(id) ON DELETE CASCADE,
  phone_used TEXT,
  region TEXT,
  duration_seconds INTEGER,
  result TEXT,
  notes TEXT,
  vapi_call_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS + Políticas públicas (matching panel pattern)
ALTER TABLE sales_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_call_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "full_access_sales_leads" ON sales_leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_sales_call_log" ON sales_call_log FOR ALL USING (true) WITH CHECK (true);

-- 4. Auto-update trigger
CREATE OR REPLACE FUNCTION update_sales_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sales_leads_updated
  BEFORE UPDATE ON sales_leads
  FOR EACH ROW EXECUTE FUNCTION update_sales_updated_at();
