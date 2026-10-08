import { NextResponse } from 'next/server';

import {
  SECRET_WARNING,
  appErrorResponse,
  readApiProduct,
  readAppName,
  readJsonObject,
  readOptionalDescription,
  requireAppDeveloper,
} from '@/lib/apps/access';
import { canCreateApp, createDeveloperApp, listDeveloperApps } from '@/lib/db/apps';
import { developerHasSandboxAccess } from '@/lib/db/developers';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const auth = await requireAppDeveloper(request);

    if (auth.response) {
      return auth.response;
    }

    const apps = await listDeveloperApps(auth.developerId);
    return NextResponse.json(apps);
  } catch (error) {
    console.error('No se pudieron listar las apps.', error);
    return NextResponse.json(
      { message: 'Ocurrió un error interno al listar las apps.' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAppDeveloper(request);

    if (auth.response) {
      return auth.response;
    }

    const parsed = await readJsonObject(request);

    if ('response' in parsed) {
      return parsed.response;
    }

    const nameResult = readAppName(parsed.body.name);
    if ('response' in nameResult) {
      return nameResult.response;
    }

    const productResult = readApiProduct(parsed.body.apiProduct);
    if ('response' in productResult) {
      return productResult.response;
    }

    const descriptionResult = readOptionalDescription(parsed.body);
    if ('response' in descriptionResult) {
      return descriptionResult.response;
    }

    if (!nameResult.value || !productResult.value) {
      return NextResponse.json(
        { message: 'El nombre y el producto son obligatorios.' },
        { status: 400 },
      );
    }

    const hasSandboxAccess = await developerHasSandboxAccess(auth.developerId);
    if (!hasSandboxAccess) {
      return NextResponse.json(
        {
          message:
            'Su acceso a sandbox aún no está aprobado. Envíe una solicitud y espere la revisión del equipo.',
        },
        { status: 403 },
      );
    }

    const allowed = await canCreateApp(auth.developerId, productResult.value);

    if (!allowed) {
      return NextResponse.json(
        { message: 'Ya alcanzó el límite de 3 apps activas para este producto.' },
        { status: 409 },
      );
    }

    const created = await createDeveloperApp({
      developerId: auth.developerId,
      name: nameResult.value,
      description: descriptionResult.value,
      apiProduct: productResult.value,
    });

    return NextResponse.json(
      {
        ...created,
        secretWarning: SECRET_WARNING,
      },
      { status: 201 },
    );
  } catch (error) {
    const mapped = appErrorResponse(error);

    if (mapped) {
      return mapped;
    }

    console.error('No se pudo crear la app.', error);
    return NextResponse.json(
      { message: 'Ocurrió un error interno al crear la app.' },
      { status: 500 },
    );
  }
}
