import { config } from 'dotenv';

config({ path: '.env.local' });

import { apiDetails } from '../components/catalog/content/apis';
import { productMessageKeys } from '../components/catalog/content/localize-api';
import type { CatalogApiContent } from '../lib/catalog/queries';
import enMessages from '../messages/en.json';
import esMessages from '../messages/es.json';
import { getPool, query } from '../lib/db/client';
import { getCatalogApiBySlug, getCatalogApis } from '../lib/catalog/queries';

type IndexedText = Record<string, string>;

type ProductCopy = {
  name: string;
  description: string;
  heroDescription: string;
  benefits: IndexedText;
  useCases: IndexedText;
  requirements: IndexedText;
  authentication: {
    title: string;
    description: string;
  };
  journeySteps?: IndexedText;
  quickFacts?: Record<string, { label: string; value: string }>;
  coverage?: { value?: string };
};

const englishProducts = enMessages.Catalog.products as Record<string, ProductCopy>;
const spanishJourney = esMessages.Catalog.detail.journeySteps;
const englishJourney = enMessages.Catalog.detail.journeySteps;

function indexedList(value: IndexedText) {
  return Object.keys(value)
    .sort((left, right) => Number(left) - Number(right))
    .map((key) => value[key]);
}

function contentFromApi(api: (typeof apiDetails)[number], copy: ProductCopy | undefined, locale: 'es' | 'en'): CatalogApiContent {
  const sharedJourney = locale === 'es' ? spanishJourney : englishJourney;
  const journey = locale === 'es' ? api.journeySteps : copy?.journeySteps ? indexedList(copy.journeySteps) : undefined;

  if (!api.imageSrc) {
    throw new Error(`La API ${api.slug} no tiene icono.`);
  }

  if (locale === 'en' && !copy) {
    throw new Error(`No hay traducción en Catalog.products para ${api.slug}.`);
  }

  return {
    title: locale === 'es' ? api.name : copy!.name,
    subtitle: locale === 'es' ? api.heroDescription : copy!.heroDescription,
    description: locale === 'es' ? api.description : copy!.description,
    valor: locale === 'es' ? api.benefits : indexedList(copy!.benefits),
    casosDeUso: locale === 'es' ? api.useCases : indexedList(copy!.useCases),
    authentication: {
      mechanism: locale === 'es' ? api.authentication.description : copy!.authentication.description,
      headers: api.authentication.headers,
    },
    requirements: locale === 'es' ? api.requirements : indexedList(copy!.requirements),
    journeySteps: journey?.length ? journey : indexedList(sharedJourney),
    quickFacts:
      locale === 'es'
        ? api.quickFacts
        : api.quickFacts.map((fact, index) => copy?.quickFacts?.[String(index)] ?? fact),
    coverage:
      locale === 'es'
        ? api.coverage
        : {
            value: copy?.coverage?.value ?? api.coverage.value,
            detail: api.coverage.detail,
          },
  };
}

async function migrateCatalog() {
  for (const api of apiDetails) {
    if (!api.imageSrc) {
      throw new Error(`La API ${api.slug} no tiene icono.`);
    }

    const productKey = productMessageKeys[api.slug as keyof typeof productMessageKeys];
    const english = englishProducts[productKey];
    const contentEs = contentFromApi(api, english, 'es');
    const contentEn = contentFromApi(api, english, 'en');

    await query(
      `INSERT INTO catalog_apis (slug, status, category, icon, content_es, content_en)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb)
       ON CONFLICT (slug) DO UPDATE
       SET status = EXCLUDED.status,
           category = EXCLUDED.category,
           icon = EXCLUDED.icon,
           content_es = EXCLUDED.content_es,
           content_en = EXCLUDED.content_en,
           updated_at = now()`,
      [api.slug, api.status, api.category, api.imageSrc, JSON.stringify(contentEs), JSON.stringify(contentEn)],
    );
  }

  const sample = await query(
    `SELECT slug,
            category,
            left(content_es::text, 220) AS content_es,
            left(content_en::text, 220) AS content_en
     FROM catalog_apis
     ORDER BY created_at ASC, slug ASC`,
  );

  const apis = await getCatalogApis();
  const tesoreria = await getCatalogApiBySlug('api-tesoreria');
  const missing = await getCatalogApiBySlug('api-inexistente');

  console.log(
    JSON.stringify(
      {
        rows: sample.rows,
        getCatalogApis: apis.map((api) => ({
          slug: api.slug,
          status: api.status,
          category: api.category,
          icon: api.icon,
          titleEs: api.contentEs.title,
          titleEn: api.contentEn.title,
          valor: api.contentEs.valor.length,
          casosDeUso: api.contentEs.casosDeUso.length,
          headers: api.contentEs.authentication.headers.length,
          journeySteps: api.contentEs.journeySteps.length,
          journeyEn: api.contentEn.journeySteps.length,
        })),
        getCatalogApiBySlug: tesoreria
          ? {
              slug: tesoreria.slug,
              subtitle: tesoreria.contentEs.subtitle,
              mechanism: tesoreria.contentEs.authentication.mechanism.slice(0, 80),
              firstJourney: tesoreria.contentEs.journeySteps[0],
              firstJourneyEn: tesoreria.contentEn.journeySteps[0],
            }
          : null,
        missing,
      },
      null,
      2,
    ),
  );

  await (await getPool()).end();
  process.exit(0);
}

migrateCatalog().catch(async (error) => {
  console.error(error);
  await (await getPool()).end().catch(() => undefined);
  process.exit(1);
});
