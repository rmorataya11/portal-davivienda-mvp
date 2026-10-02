import { Pool } from 'pg';

// DESACTIVADO TEMPORALMENTE: conexión vía Cloud SQL Connector. Se reactivará cuando el banco provea una instancia real. Para revertir, descomenta este bloque y comenta el bloque de Neon/DATABASE_URL de abajo.
/*
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
*/

// Conexión temporal vía Neon (DATABASE_URL). Para volver a Cloud SQL, comenta este bloque y descomenta el de arriba.
let pool: Pool | null = null;

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL no está definida.');
  }

  const url = new URL(connectionString);
  // La URL de Neon ya incluye sslmode=require (y channel_binding=require).
  // pg 8 trata sslmode=require como verify-full y, al fusionar la cadena,
  // ese valor pisa un `ssl` explícito del mismo objeto. Se retiran de la
  // cadena que recibe el Pool y se fija el SSL que Neon documenta para Node.
  url.searchParams.delete('sslmode');
  url.searchParams.delete('channel_binding');

  return new Pool({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
    max: 5,
  });
}

export async function getPool(): Promise<Pool> {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

export async function query(text: string, params?: unknown[]) {
  const dbPool = await getPool();
  const result = await dbPool.query(text, params);
  return result;
}
