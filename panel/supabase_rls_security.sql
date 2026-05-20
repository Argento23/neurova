-- ============================================================
-- BLINDAJE DE SEGURIDAD — GenerArise / Neurova
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- SOLO seguridad, no inserta datos.
-- ============================================================

-- PASO 1: ACTIVAR RLS
ALTER TABLE agency_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_tools ENABLE ROW LEVEL SECURITY;

-- PASO 2: Permitir INSERT público (formularios)
DROP POLICY IF EXISTS "Allow public insert" ON agency_clients;
CREATE POLICY "Allow public insert"
  ON agency_clients
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- PASO 3: Bloquear lectura/borrado desde código público
REVOKE SELECT, UPDATE, DELETE ON agency_clients FROM anon;
REVOKE ALL ON agency_services FROM anon;
REVOKE ALL ON agency_tools FROM anon;
GRANT INSERT ON agency_clients TO anon;
