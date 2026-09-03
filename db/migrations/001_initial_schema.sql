CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE developers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  -- identifica a qué API/producto pertenece esta app (ej. 'plan-unico-mvp')
  api_product TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('sandbox', 'production')),
  apigee_app_name TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  daily_quota INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- consumer_secret NUNCA se guarda aquí. Se muestra una sola vez al usuario
-- en el momento de creación (viene directo de la respuesta de Apigee) y no
-- se persiste en la base de datos, siguiendo el mismo principio que una
-- contraseña de un solo vistazo.
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  consumer_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'revoked')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE contracting_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  razon_social TEXT NOT NULL,
  nit TEXT NOT NULL,
  industria TEXT NOT NULL,
  caso_uso TEXT NOT NULL,
  volumen_estimado TEXT NOT NULL,
  ambiente_destino TEXT NOT NULL,
  ip_whitelist TEXT,
  contacto_tecnico_nombre TEXT NOT NULL,
  contacto_tecnico_email TEXT NOT NULL,
  acepta_terminos BOOLEAN NOT NULL DEFAULT false,
  confirma_veracidad BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_apps_developer_id ON apps (developer_id);
CREATE INDEX idx_apps_developer_id_api_product ON apps (developer_id, api_product);
CREATE INDEX idx_api_keys_app_id ON api_keys (app_id);
CREATE INDEX idx_contracting_requests_developer_id ON contracting_requests (developer_id);
