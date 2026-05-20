-- SQL Script to fix GenerArise Agency Database Schema
-- Run this in your Supabase SQL Editor (SQL Editor -> New Query)

-- 1. Add updated_at column to agency_tools (Fixes Panel Crash)
ALTER TABLE agency_tools 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Add updated_at column to audit_leads (For consistency)
ALTER TABLE audit_leads 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. (Optional) Create function to auto-update the timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. (Optional) Attach triggers to auto-update the timestamp when a row changes
DROP TRIGGER IF EXISTS update_agency_tools_timestamp ON agency_tools;
CREATE TRIGGER update_agency_tools_timestamp
BEFORE UPDATE ON agency_tools
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS update_audit_leads_timestamp ON audit_leads;
CREATE TRIGGER update_audit_leads_timestamp
BEFORE UPDATE ON audit_leads
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();
