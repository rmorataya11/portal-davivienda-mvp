import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import { Pool } from 'pg';

const connector = new Connector();

let pool: Pool | null = null;

async function createPool(): Promise<Pool> {
  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME!,
    ipType: IpAddressTypes.PUBLIC,
  });

  return new Pool({
    ...clientOpts,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 5,
  });
}

export async function getPool(): Promise<Pool> {
  if (!pool) {
    pool = await createPool();
  }
  return pool;
}

export async function query(text: string, params?: unknown[]) {
  const dbPool = await getPool();
  const result = await dbPool.query(text, params);
  return result;
}
