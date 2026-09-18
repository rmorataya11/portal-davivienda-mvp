ALTER TABLE developers
  ADD COLUMN reason TEXT,
  ADD COLUMN environment TEXT,
  ADD COLUMN product TEXT,
  ADD COLUMN subject TEXT,
  ADD COLUMN description TEXT,
  ADD COLUMN terms_accepted_at TIMESTAMPTZ,
  ADD COLUMN privacy_accepted_at TIMESTAMPTZ;

-- Down:
-- ALTER TABLE developers
--   DROP COLUMN IF EXISTS reason,
--   DROP COLUMN IF EXISTS environment,
--   DROP COLUMN IF EXISTS product,
--   DROP COLUMN IF EXISTS subject,
--   DROP COLUMN IF EXISTS description,
--   DROP COLUMN IF EXISTS terms_accepted_at,
--   DROP COLUMN IF EXISTS privacy_accepted_at;
