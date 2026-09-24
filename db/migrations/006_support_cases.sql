CREATE TABLE support_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES developers(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  severidad TEXT NOT NULL CHECK (severidad IN ('bloqueante', 'importante', 'consulta')),
  status TEXT NOT NULL DEFAULT 'abierto',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_support_cases_developer_id ON support_cases (developer_id);
CREATE INDEX idx_support_cases_created_at ON support_cases (created_at DESC);

-- Down:
-- DROP INDEX IF EXISTS idx_support_cases_created_at;
-- DROP INDEX IF EXISTS idx_support_cases_developer_id;
-- DROP TABLE IF EXISTS support_cases;
