import { NextResponse } from 'next/server';

import { createDeveloper, DeveloperConflictError } from '@/lib/db/developers';

export const runtime = 'nodejs';

type RegisterDeveloperBody = {
  identityUid?: unknown;
  email?: unknown;
  fullName?: unknown;
  companyName?: unknown;
};

function readRequiredString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterDeveloperBody;
    const identityUid = readRequiredString(body.identityUid);
    const email = readRequiredString(body.email);
    const fullName = readRequiredString(body.fullName);
    const companyName = readRequiredString(body.companyName);

    if (!identityUid || !email || !fullName) {
      return NextResponse.json(
        { message: 'identityUid, email y fullName son obligatorios.' },
        { status: 400 },
      );
    }

    const developer = await createDeveloper({
      identityUid,
      email,
      fullName,
      companyName: companyName || undefined,
    });

    return NextResponse.json(developer, { status: 201 });
  } catch (error) {
    if (error instanceof DeveloperConflictError) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    console.error('No se pudo registrar el developer.', error);
    return NextResponse.json(
      { message: 'Ocurrió un error interno al registrar el developer.' },
      { status: 500 },
    );
  }
}
