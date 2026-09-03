import { query } from './client';

const MAX_APPS_PER_PRODUCT = 2;

export async function canCreateApp(
  developerId: string,
  apiProduct: string,
): Promise<boolean> {
  const result = await query(
    `SELECT COUNT(*)::int AS count
     FROM apps
     WHERE developer_id = $1
       AND api_product = $2
       AND status = 'active'`,
    [developerId, apiProduct],
  );

  const count = Number(result.rows[0]?.count ?? 0);
  return count < MAX_APPS_PER_PRODUCT;
}
