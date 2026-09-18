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
  environment: string;
  product: string;
  subject: string;
  description: string;
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
  phone: string;
  notifyBeforeExpiration: boolean;
};

type UpdateDeveloperProfileInput = {
  fullName?: string;
  companyName?: string;
  documentType?: string;
  documentId?: string;
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
  phone: string | null;
  notify_before_expiration: boolean;
};

function mapDeveloperProfile(row: DeveloperRow): DeveloperProfile {
  return {
    id: row.id,
    identityUid: row.identity_uid,
    email: row.email,
    fullName: row.full_name,
    companyName: row.company_name ?? '',
    documentType: row.document_type ?? '',
    documentId: row.document_id ?? '',
    phone: row.phone ?? '',
    notifyBeforeExpiration: row.notify_before_expiration === true,
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

export async function getDeveloperProfile(developerId: string): Promise<DeveloperProfile | null> {
  const result = await query(
    `SELECT id, identity_uid, email, full_name, company_name, document_type, document_id, phone, notify_before_expiration
     FROM developers
     WHERE id::text = $1 OR identity_uid = $1
     LIMIT 1`,
    [developerId],
  );

  const row = result.rows[0] as DeveloperRow | undefined;
  return row ? mapDeveloperProfile(row) : null;
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
       document_type = COALESCE($4, document_type),
       document_id = COALESCE($5, document_id),
       phone = COALESCE($6, phone),
       notify_before_expiration = COALESCE($7, notify_before_expiration),
       updated_at = now()
     WHERE id::text = $1 OR identity_uid = $1
     RETURNING id, identity_uid, email, full_name, company_name, document_type, document_id, phone, notify_before_expiration`,
    [
      developerId,
      input.fullName ?? null,
      input.companyName ?? null,
      input.documentType ?? null,
      input.documentId ?? null,
      input.phone ?? null,
      input.notifyBeforeExpiration ?? null,
    ],
  );

  const row = result.rows[0] as DeveloperRow | undefined;
  return row ? mapDeveloperProfile(row) : null;
}
