import { query } from "./client";
import { getDeveloperProfile } from "./developers";

export const SUPPORT_CASE_SEVERITIES = ["bloqueante", "importante", "consulta"] as const;

export type SupportCaseSeverity = (typeof SUPPORT_CASE_SEVERITIES)[number];

export type CreateSupportCaseInput = {
  developerId?: string;
  titulo: string;
  descripcion: string;
  severidad: SupportCaseSeverity;
};

export type SupportCase = {
  id: string;
  developerId: string | null;
  titulo: string;
  descripcion: string;
  severidad: SupportCaseSeverity;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type SupportCaseRow = {
  id: string;
  developer_id: string | null;
  titulo: string;
  descripcion: string;
  severidad: SupportCaseSeverity;
  status: string;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}

function mapSupportCase(row: SupportCaseRow): SupportCase {
  return {
    id: row.id,
    developerId: row.developer_id,
    titulo: row.titulo,
    descripcion: row.descripcion,
    severidad: row.severidad,
    status: row.status,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

export function isSupportCaseSeverity(value: string): value is SupportCaseSeverity {
  return SUPPORT_CASE_SEVERITIES.includes(value as SupportCaseSeverity);
}

async function resolveDeveloperId(developerId?: string) {
  const lookupId = developerId?.trim();

  if (!lookupId) {
    return null;
  }

  const developer = await getDeveloperProfile(lookupId);
  return developer?.id ?? null;
}

export async function createSupportCase(data: CreateSupportCaseInput): Promise<SupportCase> {
  const developerId = await resolveDeveloperId(data.developerId);

  const result = await query(
    `INSERT INTO support_cases (developer_id, titulo, descripcion, severidad)
     VALUES ($1, $2, $3, $4)
     RETURNING id, developer_id, titulo, descripcion, severidad, status, created_at, updated_at`,
    [developerId, data.titulo, data.descripcion, data.severidad],
  );

  return mapSupportCase(result.rows[0] as SupportCaseRow);
}
