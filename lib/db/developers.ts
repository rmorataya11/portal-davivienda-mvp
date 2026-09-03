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
  companyName?: string;
};

type CreatedDeveloper = {
  id: string;
  identityUid: string;
  email: string;
};

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

export async function createDeveloper({
  identityUid,
  email,
  fullName,
  companyName,
}: CreateDeveloperInput): Promise<CreatedDeveloper> {
  try {
    const result = await query(
      `INSERT INTO developers (identity_uid, email, full_name, company_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, identity_uid, email`,
      [identityUid, email, fullName, companyName ?? null],
    );

    const row = result.rows[0] as {
      id: string;
      identity_uid: string;
      email: string;
    };

    return {
      id: row.id,
      identityUid: row.identity_uid,
      email: row.email,
    };
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new DeveloperConflictError(uniqueViolationMessage(error));
    }

    throw error;
  }
}
