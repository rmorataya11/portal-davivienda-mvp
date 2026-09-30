-- Catálogo de APIs del portal. El contenido localizado vive en JSON
-- para no duplicar una columna por cada campo de la ficha.
CREATE TABLE catalog_apis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  content_es JSONB NOT NULL,
  content_en JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Down:
-- DROP TABLE catalog_apis;
