import { config } from 'dotenv';
config({ path: '.env.local' });

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { query } from '../lib/db/client';

const MIGRATION_FILE = path.join(
  process.cwd(),
  'db',
  'migrations',
  '001_initial_schema.sql',
);

async function runMigrations() {
  const sql = await readFile(MIGRATION_FILE, 'utf8');
  await query(sql);
  console.log('Migración aplicada:', path.basename(MIGRATION_FILE));
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error('Error al aplicar migraciones:', err);
  process.exit(1);
});
