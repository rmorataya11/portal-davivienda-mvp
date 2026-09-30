import { config } from 'dotenv';

config({ path: '.env.local' });

import { getPool, query } from '../lib/db/client';
import { getCatalogApis, getEndpointBySlug, getEndpointsForApi } from '../lib/catalog/queries';

async function verifyEndpoints() {
  const apis = await getCatalogApis();
  const grouped = await Promise.all(
    apis.map(async (api) => ({
      slug: api.slug,
      endpoints: (await getEndpointsForApi(api.id)).map((endpoint) => endpoint.slug),
    })),
  );
  const movimientos = await getEndpointBySlug('api-tesoreria', 'consulta-movimientos');
  const count = await query('SELECT count(*)::int AS total FROM catalog_endpoints');

  console.log(
    JSON.stringify(
      {
        note: 'Los endpoints ya viven en Cloud SQL. Este script solo verifica las filas.',
        total: count.rows[0]?.total,
        grouped,
        consultaMovimientos: movimientos
          ? {
              slug: movimientos.slug,
              languages: movimientos.contentEs.requestExamples ? Object.keys(movimientos.contentEs.requestExamples) : [],
              statuses: movimientos.contentEs.responseExamples?.map((example) => example.status) ?? [],
            }
          : null,
      },
      null,
      2,
    ),
  );

  await (await getPool()).end();
  process.exit(0);
}

verifyEndpoints().catch(async (error) => {
  console.error(error);
  await (await getPool())
    .end()
    .catch(() => undefined);
  process.exit(1);
});
