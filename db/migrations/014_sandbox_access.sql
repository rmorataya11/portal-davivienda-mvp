-- Acceso a sandbox / documentación técnica. El panel admin lo marca al aprobar.
ALTER TABLE developers
  ADD COLUMN IF NOT EXISTS sandbox_access_granted_at TIMESTAMPTZ;

-- Cuentas que ya tenían apps siguen con acceso (migración del self-serve previo).
UPDATE developers d
SET sandbox_access_granted_at = COALESCE(sandbox_access_granted_at, now())
WHERE sandbox_access_granted_at IS NULL
  AND EXISTS (
    SELECT 1
    FROM apps a
    WHERE a.developer_id = d.id
  );

-- Down:
-- ALTER TABLE developers DROP COLUMN sandbox_access_granted_at;
