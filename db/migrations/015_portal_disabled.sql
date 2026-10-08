-- Acceso al portal bloqueado por el panel admin (login/contenido).
ALTER TABLE developers
  ADD COLUMN IF NOT EXISTS portal_disabled_at TIMESTAMPTZ;

ALTER TABLE developers
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Down:
-- ALTER TABLE developers DROP COLUMN IF EXISTS admin_notes;
-- ALTER TABLE developers DROP COLUMN IF EXISTS portal_disabled_at;
