import { config } from 'dotenv';
config({ path: '.env.local' });

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { query } from '../lib/db/client';

const MIGRATIONS_DIR = path.join(process.cwd(), 'db', 'migrations');

async function ensureMigrationsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

async function getAppliedFilenames() {
  const result = await query('SELECT filename FROM schema_migrations');
  return new Set(result.rows.map((row: { filename: string }) => row.filename));
}

async function markApplied(filename: string) {
  await query('INSERT INTO schema_migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING', [
    filename,
  ]);
}

async function bootstrapLegacyMigrations(applied: Set<string>) {
  if (applied.has('001_initial_schema.sql')) {
    return;
  }

  const existing = await query(`SELECT to_regclass('public.developers') AS name`);

  if (!existing.rows[0]?.name) {
    return;
  }

  await markApplied('001_initial_schema.sql');
  applied.add('001_initial_schema.sql');
  console.log('Registrada como aplicada (ya existía): 001_initial_schema.sql');
}

async function runMigrations() {
  await ensureMigrationsTable();
  const applied = await getAppliedFilenames();
  await bootstrapLegacyMigrations(applied);

  const files = (await readdir(MIGRATIONS_DIR))
    .filter((file) => file.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    console.log('No hay archivos de migración.');
    process.exit(0);
  }

  let appliedCount = 0;

  for (const file of files) {
    if (applied.has(file)) {
      console.log('Omitida (ya aplicada):', file);
      continue;
    }

    const sql = await readFile(path.join(MIGRATIONS_DIR, file), 'utf8');
    await query(sql);
    await markApplied(file);
    appliedCount += 1;
    console.log('Migración aplicada:', file);
  }

  if (appliedCount === 0) {
    console.log('No hay migraciones pendientes.');
  }

  process.exit(0);
}

runMigrations().catch((err) => {
  console.error('Error al aplicar migraciones:', err);
  process.exit(1);
});
