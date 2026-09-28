-- El formulario de contratación ya no envía confirma_veracidad.
-- Garantiza un default para inserts que omiten la columna, sin alterar
-- filas existentes (valores true/false actuales se conservan).
ALTER TABLE contracting_requests
  ALTER COLUMN confirma_veracidad SET DEFAULT false;

-- Down:
-- ALTER TABLE contracting_requests ALTER COLUMN confirma_veracidad DROP DEFAULT;
