import { NextResponse } from 'next/server';

import {
  createContractingRequest,
  getContractingRequestsByDeveloper,
} from '@/lib/db/contracting-requests';

export const runtime = 'nodejs';

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
  aceptaTerminos?: unknown;
  confirmaVeracidad?: unknown;
};

function readRequiredString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function readOptionalString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function readBoolean(value: unknown) {
  return value === true || value === 'true';
}

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
    const developerId = readRequiredString(body.developerId);
    const razonSocial = readRequiredString(body.razonSocial);
    const nit = readRequiredString(body.nit);
    const industria = readRequiredString(body.industria);
    const casoUso = readRequiredString(body.casoUso);
    const volumenEstimado = readRequiredString(body.volumenEstimado);
    const ambienteDestino = readRequiredString(body.ambienteDestino);
    const contactoTecnicoNombre = readRequiredString(body.contactoTecnicoNombre);
    const contactoTecnicoEmail = readRequiredString(body.contactoTecnicoEmail);
    const ipWhitelist = readOptionalString(body.ipWhitelist);
    const aceptaTerminos = readBoolean(body.aceptaTerminos);
    const confirmaVeracidad = readBoolean(body.confirmaVeracidad);

    if (
      !developerId ||
      !razonSocial ||
      !nit ||
      !industria ||
      !casoUso ||
      !volumenEstimado ||
      !ambienteDestino ||
      !contactoTecnicoNombre ||
      !contactoTecnicoEmail
    ) {
      return NextResponse.json(
        { message: 'Faltan campos obligatorios para crear la solicitud.' },
        { status: 400 },
      );
    }

    if (!aceptaTerminos || !confirmaVeracidad) {
      return NextResponse.json(
        { message: 'Debe aceptar los términos y confirmar la veracidad de los datos.' },
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
      aceptaTerminos,
      confirmaVeracidad,
    });

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
