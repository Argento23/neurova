-- ============================================================================
-- MIGRACIÓN: Personalización de marca + Servicios
-- Ejecutar en Supabase SQL Editor
-- ============================================================================

-- 1. Agregar campos de branding a entrepreneurs
ALTER TABLE entrepreneurs ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE entrepreneurs ADD COLUMN IF NOT EXISTS tagline TEXT DEFAULT '';
ALTER TABLE entrepreneurs ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT '';
ALTER TABLE entrepreneurs ADD COLUMN IF NOT EXISTS banner_url TEXT DEFAULT '';
ALTER TABLE entrepreneurs ADD COLUMN IF NOT EXISTS brand_color TEXT DEFAULT '#6366f1';
ALTER TABLE entrepreneurs ADD COLUMN IF NOT EXISTS city TEXT DEFAULT '';
ALTER TABLE entrepreneurs ADD COLUMN IF NOT EXISTS category_focus TEXT DEFAULT '';

-- 2. Agregar tipo (producto/servicio) a products
ALTER TABLE products ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'product' CHECK (type IN ('product', 'service'));

-- 3. Índices
CREATE INDEX IF NOT EXISTS idx_entrepreneurs_slug ON entrepreneurs(slug);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);

-- 4. Generar slugs automáticos para los que no tienen
UPDATE entrepreneurs 
SET slug = LOWER(REGEXP_REPLACE(REPLACE(business_name, ' ', '-'), '[^a-z0-9\-]', '', 'g'))
WHERE slug IS NULL OR slug = '';
