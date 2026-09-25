import { existsSync, writeFileSync } from 'node:fs';
import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import { Pool } from 'pg';

const GCP_CREDENTIALS_PATH = '/tmp/gcp-credentials.json';

if (process.env.GOOGLE_CREDENTIALS_BASE64) {
  if (!existsSync(GCP_CREDENTIALS_PATH)) {
    writeFileSync(GCP_CREDENTIALS_PATH, Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64'));
  }

  process.env.GOOGLE_APPLICATION_CREDENTIALS = GCP_CREDENTIALS_PATH;
}

const connector = new Connector();

let pool: Pool | null = null;

function resolveDbIpType(): IpAddressTypes {
  const raw = process.env.DB_IP_TYPE?.trim().toUpperCase();

  if (!raw || raw === IpAddressTypes.PUBLIC) {
    return IpAddressTypes.PUBLIC;
  }

  if (raw === IpAddressTypes.PRIVATE || raw === IpAddressTypes.PSC) {
    return raw;
  }

  console.warn(
    `DB_IP_TYPE="${process.env.DB_IP_TYPE}" no es válido. Use PUBLIC, PRIVATE o PSC. Se usa PUBLIC.`,
  );
  return IpAddressTypes.PUBLIC;
}

async function createPool(): Promise<Pool> {
  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME!,
    ipType: resolveDbIpType(),
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
