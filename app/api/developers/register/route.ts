import { NextResponse } from 'next/server';

import { createDeveloper, DeveloperConflictError } from '@/lib/db/developers';
import {
  isValidDocumentId,
  isValidDocumentType,
  isValidEmail,
  isValidPhone,
  readTrimmedString,
} from '@/lib/validation/fields';

export const runtime = 'nodejs';

type RegisterDeveloperBody = {
  identityUid?: unknown;
  email?: unknown;
  fullName?: unknown;
  companyName?: unknown;
  documentType?: unknown;
  documentId?: unknown;
  phone?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterDeveloperBody;
    const identityUid = readTrimmedString(body.identityUid);
    const email = readTrimmedString(body.email);
    const fullName = readTrimmedString(body.fullName);
    const companyName = readTrimmedString(body.companyName);
    const documentType = readTrimmedString(body.documentType);
    const documentId = readTrimmedString(body.documentId);
    const phone = readTrimmedString(body.phone);

    if (!identityUid || !email || !fullName || !companyName || !documentType || !documentId) {
      return NextResponse.json(
        {
          message:
            'identityUid, email, fullName, companyName, documentType y documentId son obligatorios.',
        },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: 'Ingrese un correo válido.' }, { status: 400 });
    }

    if (!isValidDocumentType(documentType)) {
      return NextResponse.json({ message: 'Seleccione un tipo de identificación válido.' }, { status: 400 });
    }

    if (!isValidDocumentId(documentId)) {
      return NextResponse.json({ message: 'Ingrese el número de identificación.' }, { status: 400 });
    }

    if (phone && !isValidPhone(phone)) {
      return NextResponse.json({ message: 'Ingrese un teléfono válido.' }, { status: 400 });
    }

    const developer = await createDeveloper({
      identityUid,
      email,
      fullName,
      companyName,
      documentType,
      documentId,
      phone: phone || undefined,
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
