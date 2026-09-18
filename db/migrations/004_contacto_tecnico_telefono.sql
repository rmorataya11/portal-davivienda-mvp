ALTER TABLE contracting_requests
  ADD COLUMN contacto_tecnico_telefono TEXT;

-- Down:
-- ALTER TABLE contracting_requests DROP COLUMN IF EXISTS contacto_tecnico_telefono;
