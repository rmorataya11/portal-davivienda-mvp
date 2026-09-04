import { NextResponse } from 'next/server';

import { getDeveloperProfile, updateDeveloperProfile } from '@/lib/db/developers';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ id: string }>;
};

type ProfilePatchBody = {
  fullName?: unknown;
  companyName?: unknown;
  documentId?: unknown;
  phone?: unknown;
  notifyBeforeExpiration?: unknown;
};

function readOptionalString(value: unknown) {
  return typeof value === 'string' ? value.trim() : undefined;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const profile = await getDeveloperProfile(id);

    if (!profile) {
      return NextResponse.json({ message: 'No se encontró el developer.' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('No se pudo obtener el perfil del developer.', error);
    return NextResponse.json(
      { message: 'Ocurrió un error interno al obtener el perfil.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as ProfilePatchBody;

    const updated = await updateDeveloperProfile(id, {
      fullName: readOptionalString(body.fullName),
      companyName: readOptionalString(body.companyName),
      documentId: readOptionalString(body.documentId),
      phone: readOptionalString(body.phone),
      notifyBeforeExpiration:
        typeof body.notifyBeforeExpiration === 'boolean' ? body.notifyBeforeExpiration : undefined,
    });

    if (!updated) {
      return NextResponse.json({ message: 'No se encontró el developer.' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('No se pudo actualizar el perfil del developer.', error);
    return NextResponse.json(
      { message: 'Ocurrió un error interno al actualizar el perfil.' },
      { status: 500 },
    );
  }
}
