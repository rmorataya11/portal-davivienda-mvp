import { NextResponse } from 'next/server';

import {
  createContractingRequest,
  getContractingRequestsByDeveloper,
} from '@/lib/db/contracting-requests';
import { sendNotificationEmail } from '@/lib/email/mailer';
import { renderContractingRequestEmail } from '@/lib/email/templates';
import {
  isExplicitTrue,
  isValidEmail,
  isValidPhone,
  readTrimmedString,
} from '@/lib/validation/fields';

export const runtime = 'nodejs';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function readOptionalUuid(value: unknown): string | null {
  if (value == null || value === '') return null;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return UUID_PATTERN.test(trimmed) ? trimmed : null;
}

type ContractingRequestBody = {
  developerId?: unknown;
  razonSocial?: unknown;
  nit?: unknown;
  industria?: unknown;
  casoUso?: unknown;
  volumenEstimado?: unknown;
  ambienteDestino?: unknown;
  ipWhitelist?: unknown;
  contactoTecnicoNombre?: unknown;
  contactoTecnicoEmail?: unknown;
  contactoTecnicoTelefono?: unknown;
  aceptaTerminos?: unknown;
  app_id?: unknown;
};

export async function GET(request: Request) {
  try {
    const developerId = new URL(request.url).searchParams.get('developerId')?.trim() ?? '';

    if (!developerId) {
      return NextResponse.json({ message: 'developerId es obligatorio.' }, { status: 400 });
    }

    const requests = await getContractingRequestsByDeveloper(developerId);
    return NextResponse.json(requests);
  } catch (error) {
    console.error('No se pudieron obtener las solicitudes de contratación.', error);
    return NextResponse.json(
      { message: 'Ocurrió un error interno al obtener las solicitudes.' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContractingRequestBody;
    const developerId = readTrimmedString(body.developerId);
    const razonSocial = readTrimmedString(body.razonSocial);
    const nit = readTrimmedString(body.nit);
    const industria = readTrimmedString(body.industria);
    const casoUso = readTrimmedString(body.casoUso);
    const volumenEstimado = readTrimmedString(body.volumenEstimado);
    const ambienteDestino = readTrimmedString(body.ambienteDestino);
    const contactoTecnicoNombre = readTrimmedString(body.contactoTecnicoNombre);
    const contactoTecnicoEmail = readTrimmedString(body.contactoTecnicoEmail);
    const contactoTecnicoTelefono = readTrimmedString(body.contactoTecnicoTelefono);
    const ipWhitelist = readTrimmedString(body.ipWhitelist);
    const aceptaTerminos = isExplicitTrue(body.aceptaTerminos);
    const appId = readOptionalUuid(body.app_id);

    if (body.app_id != null && body.app_id !== '' && !appId) {
      return NextResponse.json({ message: 'app_id no es un identificador válido.' }, { status: 400 });
    }

    if (
      !developerId ||
      !razonSocial ||
      !nit ||
      !industria ||
      !casoUso ||
      !volumenEstimado ||
      !ambienteDestino ||
      !contactoTecnicoNombre ||
      !contactoTecnicoEmail ||
      !contactoTecnicoTelefono
    ) {
      return NextResponse.json(
        { message: 'Faltan campos obligatorios para crear la solicitud.' },
        { status: 400 },
      );
    }

    if (!isValidEmail(contactoTecnicoEmail)) {
      return NextResponse.json({ message: 'Ingrese un correo válido.' }, { status: 400 });
    }

    if (!isValidPhone(contactoTecnicoTelefono)) {
      return NextResponse.json({ message: 'Ingrese un teléfono válido.' }, { status: 400 });
    }

    if (!aceptaTerminos) {
      return NextResponse.json(
        { message: 'Debe aceptar los términos y condiciones.' },
        { status: 400 },
      );
    }

    const created = await createContractingRequest({
      developerId,
      razonSocial,
      nit,
      industria,
      casoUso,
      volumenEstimado,
      ambienteDestino,
      ipWhitelist: ipWhitelist || undefined,
      contactoTecnicoNombre,
      contactoTecnicoEmail,
      contactoTecnicoTelefono,
      aceptaTerminos,
      appId,
    });

    await sendNotificationEmail(
      `[CONTRATACIÓN] Nueva solicitud de contratación: ${razonSocial}`,
      renderContractingRequestEmail({
        id: created.id,
        razonSocial: created.razonSocial,
        nit: created.nit,
        industria: created.industria,
        casoUso: created.casoUso,
        volumenEstimado: created.volumenEstimado,
        ambienteDestino: created.ambienteDestino,
        ipWhitelist: created.ipWhitelist,
        contactoTecnicoNombre: created.contactoTecnicoNombre,
        contactoTecnicoEmail: created.contactoTecnicoEmail,
        contactoTecnicoTelefono: created.contactoTecnicoTelefono,
      }),
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('No se pudo crear la solicitud de contratación.', error);

    if (error instanceof Error && error.message.includes('No se encontró el developer')) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Ocurrió un error interno al crear la solicitud.' },
      { status: 500 },
    );
  }
}
