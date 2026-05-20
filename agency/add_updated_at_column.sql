-- ═══════════════════════════════════════════════════════════
-- AGREGAR COLUMNA updated_at A agency_tools
-- ═══════════════════════════════════════════════════════════
-- El panel necesita esta columna para registrar cuándo se actualizó el saldo.

ALTER TABLE agency_tools 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Opcional: Trigger para que se actualice automáticamente (aunque el JS ya lo manda)
-- CREATE OR REPLACE FUNCTION update_modified_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- DROP TRIGGER IF EXISTS update_agency_tools_changetimestamp ON agency_tools;
-- CREATE TRIGGER update_agency_tools_changetimestamp BEFORE UPDATE ON agency_tools FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
