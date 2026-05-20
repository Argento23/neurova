-- ============================================================
-- Add step1 tracking column to sales_leads
-- Run in Supabase SQL Editor BEFORE using batch WhatsApp
-- ============================================================
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS step1_sent_at TIMESTAMPTZ;
