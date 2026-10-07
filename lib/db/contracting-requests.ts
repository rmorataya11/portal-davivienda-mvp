import { query } from './client';
import { resolveDeveloperId } from './developers';

export type CreateContractingRequestInput = {
  developerId: string;
  razonSocial: string;
  nit: string;
  industria: string;
  casoUso: string;
  volumenEstimado: string;
  ambienteDestino: string;
  ipWhitelist?: string;
  contactoTecnicoNombre: string;
  contactoTecnicoEmail: string;
  contactoTecnicoTelefono: string;
  aceptaTerminos: boolean;
  apiProduct: string;
  appId?: string | null;
};

export type ContractingRequest = {
  id: string;
  developerId: string;
  razonSocial: string;
  nit: string;
  industria: string;
  casoUso: string;
  volumenEstimado: string;
  ambienteDestino: string;
  ipWhitelist: string | null;
  contactoTecnicoNombre: string;
  contactoTecnicoEmail: string;
  contactoTecnicoTelefono: string | null;
  aceptaTerminos: boolean;
  confirmaVeracidad: boolean;
  apiProduct: string | null;
  appId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type ContractingRequestRow = {
  id: string;
  developer_id: string;
  razon_social: string;
  nit: string;
  industria: string;
  caso_uso: string;
  volumen_estimado: string;
  ambiente_destino: string;
  ip_whitelist: string | null;
  contacto_tecnico_nombre: string;
  contacto_tecnico_email: string;
  contacto_tecnico_telefono: string | null;
  acepta_terminos: boolean;
  confirma_veracidad: boolean;
  api_product: string | null;
  app_id: string | null;
  status: string;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}

function mapContractingRequest(row: ContractingRequestRow): ContractingRequest {
  return {
    id: row.id,
    developerId: row.developer_id,
    razonSocial: row.razon_social,
    nit: row.nit,
    industria: row.industria,
    casoUso: row.caso_uso,
    volumenEstimado: row.volumen_estimado,
    ambienteDestino: row.ambiente_destino,
    ipWhitelist: row.ip_whitelist,
    contactoTecnicoNombre: row.contacto_tecnico_nombre,
    contactoTecnicoEmail: row.contacto_tecnico_email,
    contactoTecnicoTelefono: row.contacto_tecnico_telefono,
    aceptaTerminos: row.acepta_terminos,
    confirmaVeracidad: row.confirma_veracidad,
    apiProduct: row.api_product,
    appId: row.app_id,
    status: row.status,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

export async function createContractingRequest(
  data: CreateContractingRequestInput,
): Promise<ContractingRequest> {
  const developerId = await resolveDeveloperId({ developerId: data.developerId });

  if (!developerId) {
    throw new Error('No se encontró el developer para crear la solicitud.');
  }

  const result = await query(
    `INSERT INTO contracting_requests (
       developer_id,
       razon_social,
       nit,
       industria,
       caso_uso,
       volumen_estimado,
       ambiente_destino,
       ip_whitelist,
       contacto_tecnico_nombre,
       contacto_tecnico_email,
       contacto_tecnico_telefono,
       acepta_terminos,
       api_product,
       app_id
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     RETURNING
       id,
       developer_id,
       razon_social,
       nit,
       industria,
       caso_uso,
       volumen_estimado,
       ambiente_destino,
       ip_whitelist,
       contacto_tecnico_nombre,
       contacto_tecnico_email,
       contacto_tecnico_telefono,
       acepta_terminos,
       confirma_veracidad,
       api_product,
       app_id,
       status,
       created_at,
       updated_at`,
    [
      developerId,
      data.razonSocial,
      data.nit,
      data.industria,
      data.casoUso,
      data.volumenEstimado,
      data.ambienteDestino,
      data.ipWhitelist?.trim() || null,
      data.contactoTecnicoNombre,
      data.contactoTecnicoEmail,
      data.contactoTecnicoTelefono.trim() || null,
      data.aceptaTerminos,
      data.apiProduct.trim(),
      data.appId?.trim() || null,
    ],
  );

  return mapContractingRequest(result.rows[0] as ContractingRequestRow);
}

export async function getContractingRequestsByDeveloper(
  developerId: string,
): Promise<ContractingRequest[]> {
  const resolvedId = await resolveDeveloperId({ developerId });

  if (!resolvedId) {
    return [];
  }

  const result = await query(
    `SELECT
       id,
       developer_id,
       razon_social,
       nit,
       industria,
       caso_uso,
       volumen_estimado,
       ambiente_destino,
       ip_whitelist,
       contacto_tecnico_nombre,
       contacto_tecnico_email,
       contacto_tecnico_telefono,
       acepta_terminos,
       confirma_veracidad,
       api_product,
       app_id,
       status,
       created_at,
       updated_at
     FROM contracting_requests
     WHERE developer_id = $1
     ORDER BY created_at DESC`,
    [resolvedId],
  );

  return (result.rows as ContractingRequestRow[]).map(mapContractingRequest);
}
