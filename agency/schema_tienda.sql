-- ============================================================================
-- SCHEMA: TIENDA EMPRENDEDOR SOLIDARIO (Versión Idempotente)
-- ============================================================================

-- 1. Tabla de Emprendedores
CREATE TABLE IF NOT EXISTS entrepreneurs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL,
    business_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    description TEXT DEFAULT '',
    payment_link TEXT DEFAULT '',
    instagram_handle TEXT DEFAULT '',
    facebook_url TEXT DEFAULT '',
    status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entrepreneur_id UUID REFERENCES entrepreneurs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_entrepreneur ON products(entrepreneur_id);
CREATE INDEX IF NOT EXISTS idx_entrepreneurs_clerk_user_id ON entrepreneurs(clerk_user_id);

-- RLS
ALTER TABLE entrepreneurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ELIMINAR POLÍTICAS EXISTENTES PARA EVITAR ERRORES
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON entrepreneurs;
    DROP POLICY IF EXISTS "Allow public insert to entrepreneurs" ON entrepreneurs;
    DROP POLICY IF EXISTS "Allow public update to entrepreneurs" ON entrepreneurs;
    DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;
    DROP POLICY IF EXISTS "Allow public insert to products" ON products;
    DROP POLICY IF EXISTS "Allow public update to products" ON products;
    DROP POLICY IF EXISTS "Allow public delete to products" ON products;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- RECREAR POLÍTICAS
CREATE POLICY "Public profiles are viewable by everyone" ON entrepreneurs FOR SELECT USING (status = 'active');
CREATE POLICY "Allow public insert to entrepreneurs" ON entrepreneurs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to entrepreneurs" ON entrepreneurs FOR UPDATE USING (true);

CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public insert to products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to products" ON products FOR DELETE USING (true);
