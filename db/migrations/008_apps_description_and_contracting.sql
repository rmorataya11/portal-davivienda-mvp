-- La app del portal guarda una descripción libre y un ambiente intermedio
-- de contratación, entre sandbox y production.
ALTER TABLE apps
  ADD COLUMN description TEXT;

ALTER TABLE apps DROP CONSTRAINT apps_environment_check;

ALTER TABLE apps
  ADD CONSTRAINT apps_environment_check
  CHECK (environment IN ('sandbox', 'contracting', 'production'));

-- Down:
-- ALTER TABLE apps DROP CONSTRAINT apps_environment_check;
-- ALTER TABLE apps ADD CONSTRAINT apps_environment_check CHECK (environment IN ('sandbox', 'production'));
-- ALTER TABLE apps DROP COLUMN description;
