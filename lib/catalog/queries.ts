import { cache } from 'react';

import { query } from '@/lib/db/client';

export type CatalogFact = {
  label: string;
  value: string;
};

export type CatalogCoverage = {
  value: string;
  detail: string;
};

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
  quickFacts: CatalogFact[];
  coverage: CatalogCoverage;
};

export type CatalogEndpointParameter = {
  name: string;
  type: string;
  required: boolean;
  location: 'query' | 'body' | 'header';
  description: string;
};

export type CatalogEndpointError = {
  code: string;
  title: string;
  description: string;
};

export type CatalogRequestExamples = {
  json: string;
  curl: string;
  javascript: string;
  python: string;
};

export type CatalogResponseExample = {
  status: number;
  label: string;
  kind: 'success' | 'error';
  body: string;
};

export type CatalogEndpointContent = {
  description: string;
  parameters: CatalogEndpointParameter[];
  requestBody: string;
  responseBody: string;
  responseStatus: string;
  credentialsLabel: string;
  errors: CatalogEndpointError[];
  requestExamples?: CatalogRequestExamples;
  responseExamples?: CatalogResponseExample[];
};

export type CatalogEndpoint = {
  id: string;
  catalogApiId: string;
  slug: string;
  method: string;
  path: string;
  httpUrl: string;
  contentEs: CatalogEndpointContent;
  contentEn: CatalogEndpointContent;
  createdAt: string | null;
  updatedAt: string | null;
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
    quickFacts: readFacts(content.quickFacts, `${field}.quickFacts`),
    coverage: readCoverage(content.coverage, `${field}.coverage`),
  };
}

function readFacts(value: unknown, field: string): CatalogFact[] {
  if (!Array.isArray(value)) {
    throw new Error(`catalog_apis.${field} no es un arreglo.`);
  }

  return value.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`catalog_apis.${field}[${index}] no es un objeto.`);
    }

    const fact = item as Record<string, unknown>;

    if (typeof fact.label !== 'string' || typeof fact.value !== 'string') {
      throw new Error(`catalog_apis.${field}[${index}] no tiene label y value.`);
    }

    return { label: fact.label, value: fact.value };
  });
}

function readCoverage(value: unknown, field: string): CatalogCoverage {
  if (!value || typeof value !== 'object') {
    throw new Error(`catalog_apis.${field} no es un objeto.`);
  }

  const coverage = value as Record<string, unknown>;

  if (typeof coverage.value !== 'string' || typeof coverage.detail !== 'string') {
    throw new Error(`catalog_apis.${field} no tiene value y detail.`);
  }

  return { value: coverage.value, detail: coverage.detail };
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

type CatalogEndpointRow = {
  id: string;
  catalog_api_id: string;
  slug: string;
  method: string;
  path: string;
  http_url: string;
  content_es: unknown;
  content_en: unknown;
  created_at: Date | string | null;
  updated_at: Date | string | null;
};

const ENDPOINT_COLUMNS = `
  id,
  catalog_api_id,
  slug,
  method,
  path,
  http_url,
  content_es,
  content_en,
  created_at,
  updated_at
`;

function readParameters(value: unknown, field: string): CatalogEndpointParameter[] {
  if (!Array.isArray(value)) {
    throw new Error(`catalog_endpoints.${field} no es un arreglo.`);
  }

  return value.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`catalog_endpoints.${field}[${index}] no es un objeto.`);
    }

    const parameter = item as Record<string, unknown>;
    const location = parameter.location;

    if (
      typeof parameter.name !== 'string' ||
      typeof parameter.type !== 'string' ||
      typeof parameter.required !== 'boolean' ||
      (location !== 'query' && location !== 'body' && location !== 'header') ||
      typeof parameter.description !== 'string'
    ) {
      throw new Error(`catalog_endpoints.${field}[${index}] no tiene name, type, required, location y description.`);
    }

    return {
      name: parameter.name,
      type: parameter.type,
      required: parameter.required,
      location,
      description: parameter.description,
    };
  });
}

function readErrors(value: unknown, field: string): CatalogEndpointError[] {
  if (!Array.isArray(value)) {
    throw new Error(`catalog_endpoints.${field} no es un arreglo.`);
  }

  return value.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`catalog_endpoints.${field}[${index}] no es un objeto.`);
    }

    const error = item as Record<string, unknown>;

    if (typeof error.code !== 'string' || typeof error.title !== 'string' || typeof error.description !== 'string') {
      throw new Error(`catalog_endpoints.${field}[${index}] no tiene code, title y description.`);
    }

    return { code: error.code, title: error.title, description: error.description };
  });
}

function readRequestExamples(value: unknown, field: string): CatalogRequestExamples | undefined {
  if (value == null) {
    return undefined;
  }

  if (!value || typeof value !== 'object') {
    throw new Error(`catalog_endpoints.${field} no es un objeto.`);
  }

  const examples = value as Record<string, unknown>;

  if (
    typeof examples.json !== 'string' ||
    typeof examples.curl !== 'string' ||
    typeof examples.javascript !== 'string' ||
    typeof examples.python !== 'string'
  ) {
    throw new Error(`catalog_endpoints.${field} no tiene json, curl, javascript y python.`);
  }

  return {
    json: examples.json,
    curl: examples.curl,
    javascript: examples.javascript,
    python: examples.python,
  };
}

function readResponseExamples(value: unknown, field: string): CatalogResponseExample[] | undefined {
  if (value == null) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new Error(`catalog_endpoints.${field} no es un arreglo.`);
  }

  return value.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`catalog_endpoints.${field}[${index}] no es un objeto.`);
    }

    const example = item as Record<string, unknown>;

    if (
      typeof example.status !== 'number' ||
      typeof example.label !== 'string' ||
      (example.kind !== 'success' && example.kind !== 'error') ||
      typeof example.body !== 'string'
    ) {
      throw new Error(`catalog_endpoints.${field}[${index}] no tiene status, label, kind y body.`);
    }

    return {
      status: example.status,
      label: example.label,
      kind: example.kind,
      body: example.body,
    };
  });
}

function readEndpointContent(value: unknown, field: string): CatalogEndpointContent {
  if (!value || typeof value !== 'object') {
    throw new Error(`catalog_endpoints.${field} no es un objeto.`);
  }

  const content = value as Record<string, unknown>;

  if (
    typeof content.description !== 'string' ||
    typeof content.requestBody !== 'string' ||
    typeof content.responseBody !== 'string' ||
    typeof content.responseStatus !== 'string' ||
    typeof content.credentialsLabel !== 'string'
  ) {
    throw new Error(`catalog_endpoints.${field} no tiene description, requestBody, responseBody, responseStatus y credentialsLabel.`);
  }

  const requestExamples = readRequestExamples(content.requestExamples, `${field}.requestExamples`);
  const responseExamples = readResponseExamples(content.responseExamples, `${field}.responseExamples`);

  return {
    description: content.description,
    parameters: readParameters(content.parameters, `${field}.parameters`),
    requestBody: content.requestBody,
    responseBody: content.responseBody,
    responseStatus: content.responseStatus,
    credentialsLabel: content.credentialsLabel,
    errors: readErrors(content.errors, `${field}.errors`),
    ...(requestExamples ? { requestExamples } : {}),
    ...(responseExamples ? { responseExamples } : {}),
  };
}

function mapCatalogEndpoint(row: CatalogEndpointRow): CatalogEndpoint {
  return {
    id: row.id,
    catalogApiId: row.catalog_api_id,
    slug: row.slug,
    method: row.method,
    path: row.path,
    httpUrl: row.http_url,
    contentEs: readEndpointContent(row.content_es, 'content_es'),
    contentEn: readEndpointContent(row.content_en, 'content_en'),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

export const getEndpointsForApi = cache(async function getEndpointsForApi(catalogApiId: string): Promise<CatalogEndpoint[]> {
  const result = await query(
    `SELECT ${ENDPOINT_COLUMNS}
     FROM catalog_endpoints
     WHERE catalog_api_id = $1
     ORDER BY created_at ASC, slug ASC`,
    [catalogApiId],
  );

  return result.rows.map((row) => mapCatalogEndpoint(row as CatalogEndpointRow));
});

export const getEndpointBySlug = cache(async function getEndpointBySlug(
  apiSlug: string,
  endpointSlug: string,
): Promise<CatalogEndpoint | null> {
  const result = await query(
    `SELECT e.id,
            e.catalog_api_id,
            e.slug,
            e.method,
            e.path,
            e.http_url,
            e.content_es,
            e.content_en,
            e.created_at,
            e.updated_at
     FROM catalog_endpoints e
     JOIN catalog_apis a ON a.id = e.catalog_api_id
     WHERE a.slug = $1 AND e.slug = $2`,
    [apiSlug, endpointSlug],
  );

  const row = result.rows[0] as CatalogEndpointRow | undefined;
  return row ? mapCatalogEndpoint(row) : null;
});
