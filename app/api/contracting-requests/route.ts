import { NextResponse } from 'next/server';

import { getRequestSession } from '@/lib/auth/server';
import { catalogApiSlugExists, getCatalogApiBySlug } from '@/lib/catalog/queries';
import {
  createContractingRequest,
  getContractingRequestsByDeveloper,
} from '@/lib/db/contracting-requests';
import { isAccessEnvironment } from '@/lib/access/sandbox';
import { developerHasSandboxAccess, resolveDeveloperId } from '@/lib/db/developers';
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
  apiProduct?: unknown;
  app_id?: unknown;
};

export async function GET(request: Request) {
  try {
    const session = await getRequestSession(request);
    const queryDeveloperId = new URL(request.url).searchParams.get('developerId')?.trim() ?? '';
    const developerId = await resolveDeveloperId({
      identityUid: session?.uid,
      developerId: queryDeveloperId,
      email: session?.email,
    });

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
    const session = await getRequestSession(request);
    const body = (await request.json()) as ContractingRequestBody;
    const developerId = await resolveDeveloperId({
      identityUid: session?.uid,
      developerId: readTrimmedString(body.developerId),
      email: session?.email,
    });
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
    const apiProduct = readTrimmedString(body.apiProduct);
    const appId = readOptionalUuid(body.app_id);

    if (body.app_id != null && body.app_id !== '' && !appId) {
      return NextResponse.json({ message: 'app_id no es un identificador válido.' }, { status: 400 });
    }

    if (!developerId) {
      return NextResponse.json(
        {
          message: session
            ? 'No hay un perfil de developer asociado a esta sesión.'
            : 'Debe iniciar sesión para enviar la solicitud.',
        },
        { status: session ? 403 : 401 },
      );
    }

    if (
      !razonSocial ||
      !nit ||
      !industria ||
      !casoUso ||
      !ambienteDestino ||
      !contactoTecnicoNombre ||
      !contactoTecnicoEmail ||
      !contactoTecnicoTelefono ||
      !apiProduct
    ) {
      return NextResponse.json(
        { message: 'Faltan campos obligatorios para crear la solicitud.' },
        { status: 400 },
      );
    }

    if (!isAccessEnvironment(ambienteDestino)) {
      return NextResponse.json(
        { message: 'Seleccione un ambiente destino válido (sandbox o producción).' },
        { status: 400 },
      );
    }

    if (ambienteDestino === 'produccion' && !volumenEstimado) {
      return NextResponse.json(
        { message: 'Seleccione el volumen estimado de transacciones.' },
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

    if (ambienteDestino === 'produccion') {
      const hasSandbox = await developerHasSandboxAccess(developerId);
      if (!hasSandbox) {
        return NextResponse.json(
          {
            message:
              'Primero debe tener acceso a sandbox aprobado antes de solicitar producción.',
          },
          { status: 403 },
        );
      }
    }

    const knownApi = await catalogApiSlugExists(apiProduct);
    if (!knownApi) {
      return NextResponse.json({ message: 'Seleccione una API válida del catálogo.' }, { status: 400 });
    }

    const created = await createContractingRequest({
      developerId,
      razonSocial,
      nit,
      industria,
      casoUso,
      volumenEstimado: ambienteDestino === 'produccion' ? volumenEstimado : 'no-aplica',
      ambienteDestino,
      ipWhitelist: ambienteDestino === 'produccion' && ipWhitelist ? ipWhitelist : undefined,
      contactoTecnicoNombre,
      contactoTecnicoEmail,
      contactoTecnicoTelefono,
      aceptaTerminos,
      apiProduct,
      appId: ambienteDestino === 'produccion' ? appId : null,
    });

    let apiTitle = apiProduct;
    try {
      const catalogApi = await getCatalogApiBySlug(apiProduct);
      if (catalogApi?.contentEs.title) {
        apiTitle = catalogApi.contentEs.title;
      }
    } catch {
      apiTitle = apiProduct;
    }

    const emailKind = ambienteDestino === 'sandbox' ? 'SANDBOX' : 'PRODUCCIÓN';
    await sendNotificationEmail(
      `[ACCESO ${emailKind}] Nueva solicitud: ${razonSocial}`,
      renderContractingRequestEmail({
        id: created.id,
        razonSocial: created.razonSocial,
        nit: created.nit,
        industria: created.industria,
        casoUso: created.casoUso,
        volumenEstimado: created.volumenEstimado,
        ambienteDestino: created.ambienteDestino,
        ipWhitelist: created.ipWhitelist,
        apiProduct: apiTitle,
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
