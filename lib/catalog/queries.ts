import { cache } from 'react';

import { query } from '@/lib/db/client';

export type CatalogApiContent = {
  title: string;
  subtitle: string;
  description: string;
  valor: string[];
  casosDeUso: string[];
  authentication: {
    mechanism: string;
    headers: string[];
  };
  requirements: string[];
  journeySteps: string[];
};

export type CatalogApi = {
  id: string;
  slug: string;
  status: string;
  category: string;
  icon: string;
  contentEs: CatalogApiContent;
  contentEn: CatalogApiContent;
  createdAt: string | null;
  updatedAt: string | null;
};

type CatalogApiRow = {
  id: string;
  slug: string;
  status: string;
  category: string;
  icon: string;
  content_es: unknown;
  content_en: unknown;
  created_at: Date | string | null;
  updated_at: Date | string | null;
};

const CATALOG_COLUMNS = `
  id,
  slug,
  status,
  category,
  icon,
  content_es,
  content_en,
  created_at,
  updated_at
`;

function toIso(value: Date | string | null) {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value.toISOString() : value;
}

function readStringList(value: unknown, field: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(`catalog_apis.${field} no es un arreglo de texto.`);
  }

  return value;
}

function readContent(value: unknown, field: string): CatalogApiContent {
  if (!value || typeof value !== 'object') {
    throw new Error(`catalog_apis.${field} no es un objeto.`);
  }

  const content = value as Record<string, unknown>;
  const authentication = content.authentication;

  if (!authentication || typeof authentication !== 'object') {
    throw new Error(`catalog_apis.${field}.authentication no es un objeto.`);
  }

  const auth = authentication as Record<string, unknown>;

  if (typeof content.title !== 'string' || typeof content.subtitle !== 'string' || typeof content.description !== 'string') {
    throw new Error(`catalog_apis.${field} no tiene title, subtitle y description.`);
  }

  if (typeof auth.mechanism !== 'string') {
    throw new Error(`catalog_apis.${field}.authentication.mechanism no es texto.`);
  }

  return {
    title: content.title,
    subtitle: content.subtitle,
    description: content.description,
    valor: readStringList(content.valor, `${field}.valor`),
    casosDeUso: readStringList(content.casosDeUso, `${field}.casosDeUso`),
    authentication: {
      mechanism: auth.mechanism,
      headers: readStringList(auth.headers, `${field}.authentication.headers`),
    },
    requirements: readStringList(content.requirements, `${field}.requirements`),
    journeySteps: readStringList(content.journeySteps, `${field}.journeySteps`),
  };
}

function mapCatalogApi(row: CatalogApiRow): CatalogApi {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    category: row.category,
    icon: row.icon,
    contentEs: readContent(row.content_es, 'content_es'),
    contentEn: readContent(row.content_en, 'content_en'),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

export const getCatalogApis = cache(async function getCatalogApis(): Promise<CatalogApi[]> {
  const result = await query(
    `SELECT ${CATALOG_COLUMNS}
     FROM catalog_apis
     ORDER BY created_at ASC, slug ASC`,
  );

  return result.rows.map((row) => mapCatalogApi(row as CatalogApiRow));
});

export const getCatalogApiBySlug = cache(async function getCatalogApiBySlug(slug: string): Promise<CatalogApi | null> {
  const result = await query(
    `SELECT ${CATALOG_COLUMNS}
     FROM catalog_apis
     WHERE slug = $1`,
    [slug],
  );

  const row = result.rows[0] as CatalogApiRow | undefined;
  return row ? mapCatalogApi(row) : null;
});
