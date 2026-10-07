-- API del catálogo que el desarrollador pide habilitar en producción.
-- Queda nula en solicitudes anteriores a este cambio.
ALTER TABLE contracting_requests
  ADD COLUMN IF NOT EXISTS api_product TEXT;

CREATE INDEX IF NOT EXISTS idx_contracting_requests_api_product ON contracting_requests (api_product);

-- Down:
-- DROP INDEX idx_contracting_requests_api_product;
-- ALTER TABLE contracting_requests DROP COLUMN api_product;
