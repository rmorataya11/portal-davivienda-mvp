import { NextResponse } from 'next/server';

import { getDeveloperProfile, updateDeveloperProfile } from '@/lib/db/developers';
import {
  isValidDocumentId,
  isValidDocumentType,
  isValidPhone,
  readTrimmedString,
} from '@/lib/validation/fields';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ id: string }>;
};

type ProfilePatchBody = {
  fullName?: unknown;
  companyName?: unknown;
  documentType?: unknown;
  documentId?: unknown;
  phone?: unknown;
  notifyBeforeExpiration?: unknown;
};

function hasOwn(body: ProfilePatchBody, key: keyof ProfilePatchBody) {
  return Object.prototype.hasOwnProperty.call(body, key);
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

    const fullName = hasOwn(body, 'fullName') ? readTrimmedString(body.fullName) : undefined;
    const companyName = hasOwn(body, 'companyName') ? readTrimmedString(body.companyName) : undefined;
    const documentType = hasOwn(body, 'documentType') ? readTrimmedString(body.documentType) : undefined;
    const documentId = hasOwn(body, 'documentId') ? readTrimmedString(body.documentId) : undefined;
    const phone = hasOwn(body, 'phone') ? readTrimmedString(body.phone) : undefined;

    if (fullName !== undefined && !fullName) {
      return NextResponse.json({ message: 'Ingrese el nombre para mostrar.' }, { status: 400 });
    }

    if (companyName !== undefined && !companyName) {
      return NextResponse.json({ message: 'Ingrese el nombre o razón social.' }, { status: 400 });
    }

    if (documentType !== undefined && !isValidDocumentType(documentType)) {
      return NextResponse.json({ message: 'Seleccione un tipo de identificación válido.' }, { status: 400 });
    }

    if (documentId !== undefined && !isValidDocumentId(documentId)) {
      return NextResponse.json({ message: 'Ingrese el número de identificación.' }, { status: 400 });
    }

    if (phone !== undefined && phone && !isValidPhone(phone)) {
      return NextResponse.json({ message: 'Ingrese un teléfono válido.' }, { status: 400 });
    }

    const updated = await updateDeveloperProfile(id, {
      fullName,
      companyName,
      documentType,
      documentId,
      phone,
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
