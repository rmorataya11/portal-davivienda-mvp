import { config } from 'dotenv';

config({ path: '.env.local' });

import { apiDetails } from '../components/catalog/content/apis';
import { productMessageKeys } from '../components/catalog/content/localize-api';
import type { ApiEndpoint, ApiError } from '../components/catalog/content/types';
import { problemDetails, toDocsEndpoint } from '../lib/catalog/generate-code-samples';
import type { CodeSampleSource } from '../lib/catalog/generate-code-samples';
import { getCatalogApis, getEndpointBySlug, getEndpointsForApi } from '../lib/catalog/queries';
import type { CatalogEndpointContent, CatalogRequestExamples, CatalogResponseExample } from '../lib/catalog/queries';
import { getPool, query } from '../lib/db/client';
import { docsApis } from '../lib/mock/mockDocs';
import enMessages from '../messages/en.json';

const endpointKeys: Record<string, string> = {
  '/conciliacion/bancaempresa/movimientos/': 'consulta-movimientos',
  '/pagos/estatus/busqueda/': 'busqueda',
  '/pagos/estatus/bloqueo/': 'bloqueo',
  '/pagos/pay/cobro/': 'cobro',
  '/pagos/pay/reembolso/': 'reembolso',
  '/cuentas/validacion/': 'validacion',
};

const messageEndpointKeys: Record<string, string> = {
  '/conciliacion/bancaempresa/movimientos/': 'movimientos',
  '/pagos/estatus/busqueda/': 'busqueda',
  '/pagos/estatus/bloqueo/': 'bloqueo',
  '/pagos/pay/cobro/': 'cobro',
  '/pagos/pay/reembolso/': 'reembolso',
  '/cuentas/validacion/': 'validacion',
};

const errorTypeSlugs: Record<string, string> = {
  '400': 'invalid-request',
  '401': 'unauthorized',
  '500': 'internal-error',
};

type EnglishProduct = {
  quickFacts?: Record<string, { label: string; value: string }>;
  coverage?: { value?: string };
  endpoints?: Record<string, { description?: string; parameters?: Record<string, string> }>;
  errors?: Record<string, { title?: string; description?: string }>;
};

const englishProducts = enMessages.Catalog.products as Record<string, EnglishProduct>;
const objectArrayEn = enMessages.Catalog.types.objectArray;
const docsMovimientos = enMessages.Documentacion.contenido.consultaMovimientos;

const consultaMovimientos = docsApis
  .flatMap((api) => api.endpoints)
  .find((endpoint) => endpoint.id === 'consulta-movimientos');

if (!consultaMovimientos) {
  throw new Error('mockDocs no tiene el endpoint consulta-movimientos.');
}

function parameterKey(name: string) {
  return name.replace(/\./g, '_');
}

function englishParameterDescription(path: string, name: string, product: EnglishProduct | undefined, fallback: string) {
  if (path === '/conciliacion/bancaempresa/movimientos/') {
    const fromDocs = docsMovimientos.parametros[parameterKey(name) as keyof typeof docsMovimientos.parametros];
    if (fromDocs?.descripcion) {
      return fromDocs.descripcion;
    }
  }

  return product?.endpoints?.[messageEndpointKeys[path] ?? path]?.parameters?.[parameterKey(name)] ?? fallback;
}

function englishType(type: string) {
  return type === 'array de objetos' ? objectArrayEn : type;
}

function localizedErrors(errors: ApiError[], product: EnglishProduct | undefined, locale: 'es' | 'en') {
  if (locale === 'es') {
    return errors;
  }

  return errors.map((error) => ({
    code: error.code,
    title: product?.errors?.[error.code]?.title ?? error.title,
    description: product?.errors?.[error.code]?.description ?? error.description,
  }));
}

function translatedResponseExamples(
  examples: CatalogResponseExample[],
  errors: ApiError[],
  path: string,
): CatalogResponseExample[] {
  return examples.map((example) => {
    if (example.kind !== 'error') {
      return example;
    }

    const error = errors.find((item) => item.code === String(example.status));
    if (!error) {
      return example;
    }

    return {
      ...example,
      body: problemDetails(example.status, error.title, error.description, path, errorTypeSlugs[error.code] ?? 'error'),
    };
  });
}

function contentForEndpoint(
  endpoint: ApiEndpoint,
  errors: ApiError[],
  product: EnglishProduct | undefined,
  locale: 'es' | 'en',
): CatalogEndpointContent {
  const isMovimientos = endpoint.path === '/conciliacion/bancaempresa/movimientos/';
  const endpointCopy = product?.endpoints?.[messageEndpointKeys[endpoint.path] ?? endpoint.path];
  const sourceParameters = isMovimientos ? consultaMovimientos!.parameters : endpoint.playground.parameters;

  const parameters = sourceParameters.map((parameter) => {
    const catalogParameter = endpoint.playground.parameters.find((item) => item.name === parameter.name);
    const description =
      locale === 'es'
        ? parameter.description
        : englishParameterDescription(endpoint.path, parameter.name, product, parameter.description);

    return {
      name: parameter.name,
      type: locale === 'en' ? englishType(parameter.type) : parameter.type,
      required: Boolean(parameter.required),
      location: catalogParameter?.location ?? 'body',
      description,
    };
  });

  const requestExamples: CatalogRequestExamples | undefined = isMovimientos ? consultaMovimientos!.requestExamples : undefined;
  const responseExamples = isMovimientos
    ? locale === 'es'
      ? consultaMovimientos!.responseExamples
      : translatedResponseExamples(
          consultaMovimientos!.responseExamples,
          localizedErrors(errors, product, 'en'),
          endpoint.path,
        )
    : undefined;

  return {
    description:
      locale === 'es'
        ? isMovimientos
          ? consultaMovimientos!.description
          : endpoint.description
        : isMovimientos
          ? docsMovimientos.descripcion
          : (endpointCopy?.description ?? endpoint.description),
    parameters,
    requestBody: isMovimientos ? consultaMovimientos!.requestExamples.json : endpoint.playground.requestBody,
    responseBody: isMovimientos ? consultaMovimientos!.responseExample : endpoint.playground.responseBody,
    responseStatus: endpoint.playground.responseStatus,
    credentialsLabel: endpoint.playground.credentialsLabel,
    errors: localizedErrors(errors, product, locale),
    ...(requestExamples ? { requestExamples } : {}),
    ...(responseExamples ? { responseExamples } : {}),
  };
}

async function updateCatalogSummaries() {
  for (const api of apiDetails) {
    const productKey = productMessageKeys[api.slug as keyof typeof productMessageKeys];
    const product = englishProducts[productKey];

    if (!product) {
      throw new Error(`No hay traducción en Catalog.products para ${api.slug}.`);
    }

    const contentEs = {
      quickFacts: api.quickFacts,
      coverage: api.coverage,
    };
    const contentEn = {
      quickFacts: api.quickFacts.map((fact, index) => product.quickFacts?.[String(index)] ?? fact),
      coverage: {
        value: product.coverage?.value ?? api.coverage.value,
        detail: api.coverage.detail,
      },
    };

    const updated = await query(
      `UPDATE catalog_apis
       SET content_es = content_es || $2::jsonb,
           content_en = content_en || $3::jsonb,
           updated_at = now()
       WHERE slug = $1`,
      [api.slug, JSON.stringify(contentEs), JSON.stringify(contentEn)],
    );

    if (updated.rowCount !== 1) {
      throw new Error(`No se actualizó la fila de catalog_apis para ${api.slug}.`);
    }
  }
}

async function upsertEndpoints() {
  for (const api of apiDetails) {
    const productKey = productMessageKeys[api.slug as keyof typeof productMessageKeys];
    const product = englishProducts[productKey];
    const apiRow = await query('SELECT id FROM catalog_apis WHERE slug = $1', [api.slug]);
    const catalogApiId = (apiRow.rows[0] as { id: string } | undefined)?.id;

    if (!catalogApiId) {
      throw new Error(`catalog_apis no tiene el slug ${api.slug}.`);
    }

    for (const endpoint of api.endpoints) {
      const slug = endpointKeys[endpoint.path];

      if (!slug) {
        throw new Error(`No hay slug para ${endpoint.path}.`);
      }

      const contentEs = contentForEndpoint(endpoint, api.errors, product, 'es');
      const contentEn = contentForEndpoint(endpoint, api.errors, product, 'en');

      await query(
        `INSERT INTO catalog_endpoints (
           catalog_api_id, slug, method, path, http_url, content_es, content_en
         )
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb)
         ON CONFLICT (catalog_api_id, slug) DO UPDATE
         SET method = EXCLUDED.method,
             path = EXCLUDED.path,
             http_url = EXCLUDED.http_url,
             content_es = EXCLUDED.content_es,
             content_en = EXCLUDED.content_en,
             updated_at = now()`,
        [
          catalogApiId,
          slug,
          endpoint.method,
          endpoint.path,
          endpoint.playground.httpUrl,
          JSON.stringify(contentEs),
          JSON.stringify(contentEn),
        ],
      );
    }
  }
}

function sourceFromStored(endpoint: {
  method: string;
  path: string;
  httpUrl: string;
  contentEs: CatalogEndpointContent;
}): CodeSampleSource {
  return {
    method: endpoint.method as CodeSampleSource['method'],
    path: endpoint.path,
    httpUrl: endpoint.httpUrl,
    contentType: 'application/json',
    description: endpoint.contentEs.description,
    requestBody: endpoint.contentEs.requestBody,
    responseStatus: endpoint.contentEs.responseStatus,
    responseBody: endpoint.contentEs.responseBody,
    parameters: endpoint.contentEs.parameters,
    errors: endpoint.contentEs.errors,
  };
}

async function migrateEndpoints() {
  await updateCatalogSummaries();
  await upsertEndpoints();
  await upsertEndpoints();

  const counts = await query(
    `SELECT a.slug AS api_slug, e.slug, e.method, e.path
     FROM catalog_endpoints e
     JOIN catalog_apis a ON a.id = e.catalog_api_id
     ORDER BY a.slug, e.slug`,
  );

  const apis = await getCatalogApis();
  const tesoreria = apis.find((api) => api.slug === 'api-tesoreria');

  if (!tesoreria) {
    throw new Error('No se leyó api-tesoreria.');
  }

  const tesoreriaEndpoints = await getEndpointsForApi(tesoreria.id);
  const movimientos = await getEndpointBySlug('api-tesoreria', 'consulta-movimientos');
  const cobro = await getEndpointBySlug('api-pay-davivienda', 'cobro');
  const missing = await getEndpointBySlug('api-tesoreria', 'no-existe');

  if (!movimientos?.contentEs.requestExamples || !movimientos.contentEs.responseExamples) {
    throw new Error('consulta-movimientos no guardó los ejemplos de mockDocs.');
  }

  const generated = toDocsEndpoint('api-tesoreria', sourceFromStored(movimientos));
  const storedError = movimientos.contentEs.responseExamples.find((example) => example.status === 400);

  if (!storedError || generated.responseExamples[1]?.body !== storedError.body) {
    throw new Error('El generador problem+json no reprodujo el error 400 de consulta-movimientos.');
  }

  if (
    !generated.requestExamples.curl.includes('curl --request POST') ||
    !generated.requestExamples.javascript.includes('fetch(') ||
    !generated.requestExamples.python.includes('requests.post')
  ) {
    throw new Error('Los generadores de cURL, JavaScript o Python no produjeron código.');
  }

  if (!movimientos.contentEs.requestExamples.curl.includes('TU_API_KEY')) {
    throw new Error('consulta-movimientos no conservó el cURL de mockDocs.');
  }

  if (movimientos.contentEn.requestBody !== movimientos.contentEs.requestBody) {
    throw new Error('requestBody se tradujo y debe quedar igual en ambos idiomas.');
  }

  console.log(
    JSON.stringify(
      {
        catalogApis: apis.map((api) => ({
          slug: api.slug,
          quickFactsEs: api.contentEs.quickFacts,
          quickFactsEn: api.contentEn.quickFacts.map((fact) => fact.value),
          coverageEs: api.contentEs.coverage,
          coverageEn: api.contentEn.coverage,
        })),
        endpointCount: counts.rows.length,
        endpoints: counts.rows,
        getEndpointsForApi: tesoreriaEndpoints.map((endpoint) => endpoint.slug),
        getEndpointBySlug: movimientos
          ? {
              slug: movimientos.slug,
              method: movimientos.method,
              path: movimientos.path,
              languages: Object.keys(movimientos.contentEs.requestExamples),
              responseStatuses: movimientos.contentEs.responseExamples.map((example) => example.status),
              error400Type: JSON.parse(storedError.body).type,
              filtrosEs: movimientos.contentEs.parameters.find((parameter) => parameter.name === 'filtros')?.description,
              filtrosEn: movimientos.contentEn.parameters.find((parameter) => parameter.name === 'filtros')?.description,
              error400En: movimientos.contentEn.errors.find((error) => error.code === '400')?.title,
            }
          : null,
        cobroEn: cobro?.contentEn.description ?? null,
        missing,
        generators: {
          curl: generated.requestExamples.curl.split('\n')[0],
          javascript: generated.requestExamples.javascript.includes('fetch('),
          python: generated.requestExamples.python.includes('requests.post'),
          problemJsonMatchesStored400: generated.responseExamples[1]?.body === storedError.body,
        },
      },
      null,
      2,
    ),
  );

  await (await getPool()).end();
  process.exit(0);
}

migrateEndpoints().catch(async (error) => {
  console.error(error);
  await (await getPool())
    .end()
    .catch(() => undefined);
  process.exit(1);
});
