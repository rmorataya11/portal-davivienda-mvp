import { query } from './client';

export class DeveloperConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DeveloperConflictError';
  }
}

type CreateDeveloperInput = {
  identityUid: string;
  email: string;
  fullName: string;
  companyName: string;
  documentType: string;
  documentId: string;
  phone?: string;
  reason: string;
  environment: string | null;
  product: string | null;
  subject: string | null;
  description: string | null;
};

type CreatedDeveloper = {
  id: string;
  identityUid: string;
  email: string;
  reason: string | null;
  environment: string | null;
  product: string | null;
  subject: string | null;
  description: string | null;
  termsAcceptedAt: string | null;
  privacyAcceptedAt: string | null;
};

export type DeveloperProfile = {
  id: string;
  identityUid: string;
  email: string;
  fullName: string;
  companyName: string;
  documentType: string;
  documentId: string;
  dui: string;
  phone: string;
  notifyBeforeExpiration: boolean;
  /** ISO timestamp when sandbox/docs access was granted; null if not yet. */
  sandboxAccessGrantedAt: string | null;
  /** ISO timestamp when the admin disabled portal access; null if active. */
  portalDisabledAt: string | null;
};

type UpdateDeveloperProfileInput = {
  fullName?: string;
  companyName?: string;
  dui?: string;
  phone?: string;
  notifyBeforeExpiration?: boolean;
};

type DeveloperRow = {
  id: string;
  identity_uid: string;
  email: string;
  full_name: string;
  company_name: string | null;
  document_type: string | null;
  document_id: string | null;
  dui: string | null;
  phone: string | null;
  notify_before_expiration: boolean;
  sandbox_access_granted_at: Date | string | null;
  portal_disabled_at: Date | string | null;
};

const PROFILE_COLUMNS =
  'id, identity_uid, email, full_name, company_name, document_type, document_id, dui, phone, notify_before_expiration, sandbox_access_granted_at, portal_disabled_at';

function mapDeveloperProfile(row: DeveloperRow): DeveloperProfile {
  return {
    id: row.id,
    identityUid: row.identity_uid,
    email: row.email,
    fullName: row.full_name,
    companyName: row.company_name ?? '',
    documentType: row.document_type ?? '',
    documentId: row.document_id ?? '',
    dui: row.dui ?? '',
    phone: row.phone ?? '',
    notifyBeforeExpiration: row.notify_before_expiration === true,
    sandboxAccessGrantedAt: toIso(row.sandbox_access_granted_at),
    portalDisabledAt: toIso(row.portal_disabled_at),
  };
}

function isUniqueViolation(error: unknown): error is { code: string; constraint?: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: unknown }).code === '23505'
  );
}

function uniqueViolationMessage(error: { constraint?: string }): string {
  const constraint = error.constraint ?? '';

  if (constraint.includes('identity_uid')) {
    return 'Ya existe un developer registrado con esta identidad.';
  }

  if (constraint.includes('email')) {
    return 'Ya existe un developer registrado con este correo.';
  }

  return 'Ya existe un developer con estos datos.';
}

function toIso(value: Date | string | null): string | null {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value.toISOString() : value;
}

export async function createDeveloper({
  identityUid,
  email,
  fullName,
  companyName,
  documentType,
  documentId,
  phone,
  reason,
  environment,
  product,
  subject,
  description,
}: CreateDeveloperInput): Promise<CreatedDeveloper> {
  try {
    const result = await query(
      `INSERT INTO developers (
         identity_uid,
         email,
         full_name,
         company_name,
         document_type,
         document_id,
         phone,
         reason,
         environment,
         product,
         subject,
         description,
         terms_accepted_at,
         privacy_accepted_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now(), now())
       RETURNING
         id,
         identity_uid,
         email,
         reason,
         environment,
         product,
         subject,
         description,
         terms_accepted_at,
         privacy_accepted_at`,
      [
        identityUid,
        email,
        fullName,
        companyName,
        documentType,
        documentId,
        phone?.trim() || null,
        reason,
        environment,
        product,
        subject,
        description,
      ],
    );

    const row = result.rows[0] as {
      id: string;
      identity_uid: string;
      email: string;
      reason: string | null;
      environment: string | null;
      product: string | null;
      subject: string | null;
      description: string | null;
      terms_accepted_at: Date | string | null;
      privacy_accepted_at: Date | string | null;
    };

    return {
      id: row.id,
      identityUid: row.identity_uid,
      email: row.email,
      reason: row.reason,
      environment: row.environment,
      product: row.product,
      subject: row.subject,
      description: row.description,
      termsAcceptedAt: toIso(row.terms_accepted_at),
      privacyAcceptedAt: toIso(row.privacy_accepted_at),
    };
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new DeveloperConflictError(uniqueViolationMessage(error));
    }

    throw error;
  }
}

export async function findDeveloperIdByIdentityUid(identityUid: string): Promise<string | null> {
  const result = await query(`SELECT id FROM developers WHERE identity_uid = $1 LIMIT 1`, [identityUid]);
  const id = result.rows[0]?.id;
  return typeof id === 'string' ? id : null;
}

export async function findDeveloperIdByEmail(email: string): Promise<string | null> {
  const result = await query(`SELECT id FROM developers WHERE lower(email) = lower($1) LIMIT 1`, [
    email,
  ]);
  const id = result.rows[0]?.id;
  return typeof id === 'string' ? id : null;
}

export async function resolveDeveloperId(lookup: {
  developerId?: string | null;
  identityUid?: string | null;
  email?: string | null;
}): Promise<string | null> {
  const identityUid = lookup.identityUid?.trim() || '';
  if (identityUid) {
    const fromIdentity = await findDeveloperIdByIdentityUid(identityUid);
    if (fromIdentity) {
      return fromIdentity;
    }
  }

  const developerId = lookup.developerId?.trim() || '';
  if (developerId) {
    const profile = await getDeveloperProfile(developerId);
    if (profile) {
      return profile.id;
    }

    const fromIdentity = await findDeveloperIdByIdentityUid(developerId);
    if (fromIdentity) {
      return fromIdentity;
    }
  }

  const email = lookup.email?.trim() || '';
  if (email) {
    return findDeveloperIdByEmail(email);
  }

  return null;
}

export async function getDeveloperProfile(developerId: string): Promise<DeveloperProfile | null> {
  const result = await query(
    `SELECT ${PROFILE_COLUMNS}
     FROM developers
     WHERE id::text = $1 OR identity_uid = $1
     LIMIT 1`,
    [developerId],
  );

  const row = result.rows[0] as DeveloperRow | undefined;
  return row ? mapDeveloperProfile(row) : null;
}

/** True when the developer may see docs/detalle técnico and create sandbox apps. */
export async function developerHasSandboxAccess(developerId: string): Promise<boolean> {
  const resolvedId = await resolveDeveloperId({ developerId });
  if (!resolvedId) {
    return false;
  }

  const result = await query(
    `SELECT
       (
         d.portal_disabled_at IS NULL
         AND (
           d.sandbox_access_granted_at IS NOT NULL
           OR EXISTS (SELECT 1 FROM apps a WHERE a.developer_id = d.id)
           OR EXISTS (
             SELECT 1
             FROM contracting_requests cr
             WHERE cr.developer_id = d.id
               AND cr.status = 'approved'
               AND cr.ambiente_destino IN ('sandbox', 'pruebas-extendidas')
           )
         )
       ) AS has_access
     FROM developers d
     WHERE d.id = $1
     LIMIT 1`,
    [resolvedId],
  );

  return result.rows[0]?.has_access === true;
}

export async function developerIsPortalDisabled(developerId: string): Promise<boolean> {
  const resolvedId = await resolveDeveloperId({ developerId });
  if (!resolvedId) {
    return false;
  }

  const result = await query(
    `SELECT portal_disabled_at IS NOT NULL AS disabled
     FROM developers
     WHERE id = $1
     LIMIT 1`,
    [resolvedId],
  );

  return result.rows[0]?.disabled === true;
}

export async function updateDeveloperProfile(
  developerId: string,
  input: UpdateDeveloperProfileInput,
): Promise<DeveloperProfile | null> {
  const result = await query(
    `UPDATE developers
     SET
       full_name = COALESCE($2, full_name),
       company_name = COALESCE($3, company_name),
       dui = CASE WHEN $4::boolean THEN $5 ELSE dui END,
       phone = CASE WHEN $6::boolean THEN $7 ELSE phone END,
       notify_before_expiration = COALESCE($8, notify_before_expiration),
       updated_at = now()
     WHERE id::text = $1 OR identity_uid = $1
     RETURNING ${PROFILE_COLUMNS}`,
    [
      developerId,
      input.fullName ?? null,
      input.companyName ?? null,
      input.dui !== undefined,
      input.dui ?? '',
      input.phone !== undefined,
      input.phone ?? '',
      input.notifyBeforeExpiration ?? null,
    ],
  );

  const row = result.rows[0] as DeveloperRow | undefined;
  return row ? mapDeveloperProfile(row) : null;
}
