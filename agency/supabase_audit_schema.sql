-- ═══════════════════════════════════════════════════════════
-- GenerArise Audit Leads - Supabase Schema
-- ═══════════════════════════════════════════════════════════
-- Run this in the Supabase SQL Editor to create the table

CREATE TABLE IF NOT EXISTS audit_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),

    -- Step 1: Company Info
    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT DEFAULT '',
    company TEXT DEFAULT '',
    website TEXT DEFAULT '',
    country TEXT DEFAULT '',
    role TEXT DEFAULT '',

    -- Step 2: Operations
    industry TEXT DEFAULT '',
    years_in_market TEXT DEFAULT '',
    employees TEXT DEFAULT '',
    monthly_revenue TEXT DEFAULT '',
    channels JSONB DEFAULT '[]',
    uses_crm TEXT DEFAULT '',
    weekly_messages TEXT DEFAULT '',

    -- Step 3: Industry-Specific Data (stored as JSON)
    industry_data JSONB DEFAULT '{}',

    -- Step 4: Goals
    main_pain TEXT DEFAULT '',
    goal_90_days TEXT DEFAULT '',
    budget TEXT DEFAULT '',
    contact_preference TEXT DEFAULT '',

    -- Meta
    source TEXT DEFAULT 'audit_form_v1',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'audited', 'contacted', 'demo', 'closed', 'lost')),
    ai_proposal TEXT DEFAULT '',

    -- Optional: track who handled this lead
    assigned_to TEXT DEFAULT ''
);

-- Create index on common query patterns
CREATE INDEX IF NOT EXISTS idx_audit_leads_status ON audit_leads(status);
CREATE INDEX IF NOT EXISTS idx_audit_leads_industry ON audit_leads(industry);
CREATE INDEX IF NOT EXISTS idx_audit_leads_created ON audit_leads(created_at DESC);

-- ═══════════════════════════════════════════════════════════
-- Row Level Security
-- ═══════════════════════════════════════════════════════════
ALTER TABLE audit_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from the form)
CREATE POLICY "Allow anonymous inserts" ON audit_leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow authenticated users to read all
CREATE POLICY "Allow authenticated select" ON audit_leads
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to update (change status, add proposal)
CREATE POLICY "Allow authenticated update" ON audit_leads
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow service_role full access (for n8n webhook to update ai_proposal)
CREATE POLICY "Allow service role all" ON audit_leads
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
