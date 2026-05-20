-- FIX DEFINITIVO: Tabla audit_leads con TODAS las columnas
-- Correr en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS audit_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    company TEXT DEFAULT '',
    website TEXT DEFAULT '',
    country TEXT DEFAULT '',
    role TEXT DEFAULT '',
    industry TEXT DEFAULT '',
    years_in_market TEXT DEFAULT '',
    employees TEXT DEFAULT '',
    monthly_revenue TEXT DEFAULT '',
    channels JSONB DEFAULT '[]',
    uses_crm TEXT DEFAULT '',
    weekly_messages TEXT DEFAULT '',
    main_pain TEXT DEFAULT '',
    goal_90_days TEXT DEFAULT '',
    budget TEXT DEFAULT '',
    contact_preference TEXT DEFAULT '',
    industry_data JSONB DEFAULT '{}',
    source TEXT DEFAULT 'audit_form_v1',
    status TEXT DEFAULT 'pending',
    ai_diagnosis TEXT DEFAULT ''
);

-- 2. Si la tabla ya existía, agregar columnas faltantes
DO $$
BEGIN
    -- Agregar cada columna si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='name') THEN
        ALTER TABLE audit_leads ADD COLUMN name TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='email') THEN
        ALTER TABLE audit_leads ADD COLUMN email TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='phone') THEN
        ALTER TABLE audit_leads ADD COLUMN phone TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='company') THEN
        ALTER TABLE audit_leads ADD COLUMN company TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='website') THEN
        ALTER TABLE audit_leads ADD COLUMN website TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='country') THEN
        ALTER TABLE audit_leads ADD COLUMN country TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='role') THEN
        ALTER TABLE audit_leads ADD COLUMN role TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='industry') THEN
        ALTER TABLE audit_leads ADD COLUMN industry TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='years_in_market') THEN
        ALTER TABLE audit_leads ADD COLUMN years_in_market TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='employees') THEN
        ALTER TABLE audit_leads ADD COLUMN employees TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='monthly_revenue') THEN
        ALTER TABLE audit_leads ADD COLUMN monthly_revenue TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='channels') THEN
        ALTER TABLE audit_leads ADD COLUMN channels JSONB DEFAULT '[]';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='uses_crm') THEN
        ALTER TABLE audit_leads ADD COLUMN uses_crm TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='weekly_messages') THEN
        ALTER TABLE audit_leads ADD COLUMN weekly_messages TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='main_pain') THEN
        ALTER TABLE audit_leads ADD COLUMN main_pain TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='goal_90_days') THEN
        ALTER TABLE audit_leads ADD COLUMN goal_90_days TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='budget') THEN
        ALTER TABLE audit_leads ADD COLUMN budget TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='contact_preference') THEN
        ALTER TABLE audit_leads ADD COLUMN contact_preference TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='industry_data') THEN
        ALTER TABLE audit_leads ADD COLUMN industry_data JSONB DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='source') THEN
        ALTER TABLE audit_leads ADD COLUMN source TEXT DEFAULT 'audit_form_v1';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='status') THEN
        ALTER TABLE audit_leads ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_leads' AND column_name='ai_diagnosis') THEN
        ALTER TABLE audit_leads ADD COLUMN ai_diagnosis TEXT DEFAULT '';
    END IF;
END $$;

-- 3. RLS: Permitir acceso completo desde anon (la landing usa anon key)
ALTER TABLE audit_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous inserts on audit_leads" ON audit_leads;
CREATE POLICY "Allow anonymous inserts on audit_leads"
ON audit_leads FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon reads on audit_leads" ON audit_leads;
CREATE POLICY "Allow anon reads on audit_leads"
ON audit_leads FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow anon deletes on audit_leads" ON audit_leads;
CREATE POLICY "Allow anon deletes on audit_leads"
ON audit_leads FOR DELETE TO anon USING (true);

DROP POLICY IF EXISTS "Allow anon updates on audit_leads" ON audit_leads;
CREATE POLICY "Allow anon updates on audit_leads"
ON audit_leads FOR UPDATE TO anon USING (true) WITH CHECK (true);
