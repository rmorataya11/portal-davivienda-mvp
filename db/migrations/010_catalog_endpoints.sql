-- Operaciones del catálogo. El ejemplo y los textos viven en JSON;
-- método, path y URL quedan en columnas porque no se traducen.
CREATE TABLE catalog_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_api_id UUID NOT NULL REFERENCES catalog_apis(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  method TEXT NOT NULL,
  path TEXT NOT NULL,
  http_url TEXT NOT NULL,
  content_es JSONB NOT NULL,
  content_en JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (catalog_api_id, slug)
);

-- Down:
-- DROP TABLE catalog_endpoints;
