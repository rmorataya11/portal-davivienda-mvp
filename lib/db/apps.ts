import { randomBytes } from 'node:crypto';

import { getPool, query } from './client';

const MAX_APPS_PER_PRODUCT = 3;
const TOKEN_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

export class AppLimitError extends Error {
  constructor() {
    super('Ya alcanzó el límite de 3 apps activas para este producto.');
    this.name = 'AppLimitError';
  }
}

export class AppNotFoundError extends Error {
  constructor() {
    super('No se encontró la app.');
    this.name = 'AppNotFoundError';
  }
}

export class AppForbiddenError extends Error {
  constructor() {
    super('No tiene permiso para acceder a esta app.');
    this.name = 'AppForbiddenError';
  }
}

export class AppStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppStateError';
  }
}

export type AppEnvironment = 'sandbox' | 'contracting' | 'production';
export type AppRecordStatus = 'active' | 'revoked';

export type DeveloperAppRecord = {
  id: string;
  developerId: string;
  name: string;
  description: string | null;
  apiProduct: string;
  environment: AppEnvironment;
  apigeeAppName: string | null;
  status: AppRecordStatus;
  dailyQuota: number;
  createdAt: string;
  consumerKey: string | null;
  expiresAt: string | null;
};

export type CreatedDeveloperApp = DeveloperAppRecord & {
  consumerSecret: string;
};

type AppRow = {
  id: string;
  developer_id: string;
  name: string;
  description: string | null;
  api_product: string;
  environment: AppEnvironment;
  apigee_app_name: string | null;
  status: AppRecordStatus;
  daily_quota: number;
  created_at: Date | string;
  consumer_key: string | null;
  expires_at: Date | string | null;
};

const APP_COLUMNS = `
  a.id,
  a.developer_id,
  a.name,
  a.description,
  a.api_product,
  a.environment,
  a.apigee_app_name,
  a.status,
  a.daily_quota,
  a.created_at,
  k.consumer_key,
  k.expires_at
`;

const APP_KEY_JOIN = `
  LEFT JOIN LATERAL (
    SELECT consumer_key, expires_at
    FROM api_keys
    WHERE app_id = a.id
      AND status = 'approved'
    ORDER BY created_at DESC
    LIMIT 1
  ) k ON true
`;

function randomToken(length: number) {
  const bytes = randomBytes(length);
  let token = '';

  for (let index = 0; index < length; index += 1) {
    token += TOKEN_ALPHABET[bytes[index] % TOKEN_ALPHABET.length];
  }

  return token;
}

function toIso(value: Date | string | null) {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value.toISOString() : value;
}

function mapApp(row: AppRow): DeveloperAppRecord {
  return {
    id: row.id,
    developerId: row.developer_id,
    name: row.name,
    description: row.description,
    apiProduct: row.api_product,
    environment: row.environment,
    apigeeAppName: row.apigee_app_name,
    status: row.status,
    dailyQuota: Number(row.daily_quota),
    createdAt: toIso(row.created_at) ?? '',
    consumerKey: row.consumer_key,
    expiresAt: toIso(row.expires_at),
  };
}

async function findAppRow(appId: string): Promise<AppRow | null> {
  const result = await query(
    `SELECT ${APP_COLUMNS}
     FROM apps a
     ${APP_KEY_JOIN}
     WHERE a.id = $1`,
    [appId],
  );

  return (result.rows[0] as AppRow | undefined) ?? null;
}

function assertOwnership(row: AppRow, developerId: string) {
  if (row.developer_id !== developerId) {
    throw new AppForbiddenError();
  }
}

export async function canCreateApp(developerId: string, apiProduct: string): Promise<boolean> {
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

export async function createDeveloperApp(input: {
  developerId: string;
  name: string;
  description: string | null;
  apiProduct: string;
}): Promise<CreatedDeveloperApp> {
  const consumerKey = `dvn_pk_sandbox_${randomToken(20)}`;
  const consumerSecret = `dvn_sk_sandbox_${randomToken(28)}`;
  const pool = await getPool();
  const client = await pool.connect();
  let committed = false;

  try {
    await client.query('BEGIN');
    await client.query(`SELECT pg_advisory_xact_lock(hashtext($1)::bigint)`, [
      `apps:${input.developerId}:${input.apiProduct}`,
    ]);

    const countResult = await client.query(
      `SELECT COUNT(*)::int AS count
       FROM apps
       WHERE developer_id = $1
         AND api_product = $2
         AND status = 'active'`,
      [input.developerId, input.apiProduct],
    );

    if (Number(countResult.rows[0]?.count ?? 0) >= MAX_APPS_PER_PRODUCT) {
      throw new AppLimitError();
    }

    const appResult = await client.query(
      `INSERT INTO apps (
         developer_id,
         name,
         description,
         api_product,
         environment,
         status,
         daily_quota
       )
       VALUES ($1, $2, $3, $4, 'sandbox', 'active', 2)
       RETURNING id`,
      [input.developerId, input.name, input.description, input.apiProduct],
    );

    const appId = appResult.rows[0]?.id as string;

    await client.query(
      `INSERT INTO api_keys (app_id, consumer_key, status, expires_at)
       VALUES ($1, $2, 'approved', now() + interval '30 days')`,
      [appId, consumerKey],
    );

    const created = await client.query(
      `SELECT ${APP_COLUMNS}
       FROM apps a
       ${APP_KEY_JOIN}
       WHERE a.id = $1`,
      [appId],
    );

    await client.query('COMMIT');
    committed = true;

    return {
      ...mapApp(created.rows[0] as AppRow),
      consumerSecret,
    };
  } catch (error) {
    if (!committed) {
      await client.query('ROLLBACK').catch(() => undefined);
    }

    throw error;
  } finally {
    client.release();
  }
}

export async function listDeveloperApps(developerId: string): Promise<DeveloperAppRecord[]> {
  const result = await query(
    `SELECT ${APP_COLUMNS}
     FROM apps a
     ${APP_KEY_JOIN}
     WHERE a.developer_id = $1
       AND a.status = 'active'
     ORDER BY a.created_at DESC`,
    [developerId],
  );

  return result.rows.map((row) => mapApp(row as AppRow));
}

export async function getDeveloperApp(developerId: string, appId: string): Promise<DeveloperAppRecord> {
  const row = await findAppRow(appId);

  if (!row) {
    throw new AppNotFoundError();
  }

  assertOwnership(row, developerId);
  return mapApp(row);
}

export async function updateDeveloperApp(
  developerId: string,
  appId: string,
  input: { name?: string; description?: string | null },
): Promise<DeveloperAppRecord> {
  const current = await getDeveloperApp(developerId, appId);

  if (current.environment === 'production') {
    throw new AppStateError('Una app en producción no se puede editar.');
  }

  const name = input.name ?? current.name;
  const description = input.description === undefined ? current.description : input.description;

  const result = await query(
    `UPDATE apps
     SET name = $3,
         description = $4
     WHERE id = $1
       AND developer_id = $2
     RETURNING id`,
    [appId, developerId, name, description],
  );

  if (!result.rows[0]) {
    throw new AppNotFoundError();
  }

  return getDeveloperApp(developerId, appId);
}

export async function revokeDeveloperApp(developerId: string, appId: string): Promise<DeveloperAppRecord> {
  const current = await getDeveloperApp(developerId, appId);

  if (current.environment === 'production') {
    throw new AppStateError('Una app en producción no se puede eliminar.');
  }

  if (current.status === 'revoked') {
    return current;
  }

  const result = await query(
    `UPDATE apps
     SET status = 'revoked'
     WHERE id = $1
       AND developer_id = $2
     RETURNING id`,
    [appId, developerId],
  );

  if (!result.rows[0]) {
    throw new AppNotFoundError();
  }

  return getDeveloperApp(developerId, appId);
}

export async function markDeveloperAppContracting(
  developerId: string,
  appId: string,
): Promise<DeveloperAppRecord> {
  const current = await getDeveloperApp(developerId, appId);

  if (current.status !== 'active') {
    throw new AppStateError('Solo se puede marcar como contratación una app activa.');
  }

  if (current.environment !== 'sandbox') {
    throw new AppStateError('La app debe estar en sandbox para pasar a contratación.');
  }

  const result = await query(
    `UPDATE apps
     SET environment = 'contracting'
     WHERE id = $1
       AND developer_id = $2
       AND status = 'active'
       AND environment = 'sandbox'
     RETURNING id`,
    [appId, developerId],
  );

  if (!result.rows[0]) {
    throw new AppStateError('La app debe estar en sandbox para pasar a contratación.');
  }

  return getDeveloperApp(developerId, appId);
}
