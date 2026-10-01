-- Liga la solicitud de contratación con la app que la originó.
-- Queda nula cuando el flujo no trae una app asociada.
ALTER TABLE contracting_requests
  ADD COLUMN app_id UUID REFERENCES apps(id) ON DELETE SET NULL;

CREATE INDEX idx_contracting_requests_app_id ON contracting_requests (app_id);

-- Down:
-- DROP INDEX idx_contracting_requests_app_id;
-- ALTER TABLE contracting_requests DROP COLUMN app_id;
