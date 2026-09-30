import { config } from 'dotenv';

config({ path: '.env.local' });

import { getPool, query } from '../lib/db/client';
import { getCatalogApis } from '../lib/catalog/queries';

async function verifyCatalog() {
  const apis = await getCatalogApis();
  const rows = await query(
    `SELECT slug,
            content_es ? 'quickFacts' AS quick_facts_es,
            content_en ? 'coverage' AS coverage_en
     FROM catalog_apis
     ORDER BY slug`,
  );

  console.log(
    JSON.stringify(
      {
        note: 'El catálogo ya vive en Cloud SQL. Este script solo verifica las filas.',
        count: apis.length,
        rows: rows.rows,
        titles: apis.map((api) => ({
          slug: api.slug,
          titleEs: api.contentEs.title,
          titleEn: api.contentEn.title,
          quickFacts: api.contentEs.quickFacts.length,
          coverage: api.contentEn.coverage.value,
        })),
      },
      null,
      2,
    ),
  );

  await (await getPool()).end();
  process.exit(0);
}

verifyCatalog().catch(async (error) => {
  console.error(error);
  await (await getPool())
    .end()
    .catch(() => undefined);
  process.exit(1);
});
