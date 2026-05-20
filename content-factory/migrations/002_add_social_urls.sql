-- ============================================================
-- SALES ENGINE — Add social media URL columns
-- Run in Supabase SQL Editor
-- ============================================================

-- LinkedIn URL (missing from previous migrations)
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Ensure instagram_url and facebook_url exist (idempotent)
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS facebook_url TEXT;

-- Add rejection_reason for dead leads tracking
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Index for social discovery queries
CREATE INDEX IF NOT EXISTS idx_sales_leads_discovery_source ON sales_leads(discovery_source);
