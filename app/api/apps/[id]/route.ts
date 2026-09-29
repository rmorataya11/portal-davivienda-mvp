import { NextResponse } from 'next/server';

import {
  appErrorResponse,
  parseAppId,
  readAppName,
  readJsonObject,
  readOptionalDescription,
  requireAppDeveloper,
} from '@/lib/apps/access';
import { getDeveloperApp, revokeDeveloperApp, updateDeveloperApp } from '@/lib/db/apps';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ id: string }>;
};

function missingAppResponse() {
  return NextResponse.json({ message: 'No se encontró la app.' }, { status: 404 });
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const auth = await requireAppDeveloper(request);

    if (auth.response) {
      return auth.response;
    }

    const { id } = await context.params;
    const appId = parseAppId(id);

    if (!appId) {
      return missingAppResponse();
    }

    const app = await getDeveloperApp(auth.developerId, appId);
    return NextResponse.json(app);
  } catch (error) {
    const mapped = appErrorResponse(error);

    if (mapped) {
      return mapped;
    }

    console.error('No se pudo obtener la app.', error);
    return NextResponse.json(
      { message: 'Ocurrió un error interno al obtener la app.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const auth = await requireAppDeveloper(request);

    if (auth.response) {
      return auth.response;
    }

    const { id } = await context.params;
    const appId = parseAppId(id);

    if (!appId) {
      return missingAppResponse();
    }

    const parsed = await readJsonObject(request);

    if ('response' in parsed) {
      return parsed.response;
    }

    if ('apiProduct' in parsed.body || 'api_product' in parsed.body || 'environment' in parsed.body) {
      return NextResponse.json(
        { message: 'No se puede cambiar el producto ni el ambiente de la app.' },
        { status: 400 },
      );
    }

    const hasName = Object.prototype.hasOwnProperty.call(parsed.body, 'name');
    const hasDescription = Object.prototype.hasOwnProperty.call(parsed.body, 'description');

    if (!hasName && !hasDescription) {
      return NextResponse.json(
        { message: 'Indique el nombre o la descripción a actualizar.' },
        { status: 400 },
      );
    }

    const patch: { name?: string; description?: string | null } = {};

    if (hasName) {
      const nameResult = readAppName(parsed.body.name);

      if ('response' in nameResult) {
        return nameResult.response;
      }

      if (!nameResult.value) {
        return NextResponse.json({ message: 'El nombre es obligatorio.' }, { status: 400 });
      }

      patch.name = nameResult.value;
    }

    if (hasDescription) {
      const descriptionResult = readOptionalDescription(parsed.body);

      if ('response' in descriptionResult) {
        return descriptionResult.response;
      }

      patch.description = descriptionResult.value;
    }

    const updated = await updateDeveloperApp(auth.developerId, appId, patch);
    return NextResponse.json(updated);
  } catch (error) {
    const mapped = appErrorResponse(error);

    if (mapped) {
      return mapped;
    }

    console.error('No se pudo actualizar la app.', error);
    return NextResponse.json(
      { message: 'Ocurrió un error interno al actualizar la app.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const auth = await requireAppDeveloper(request);

    if (auth.response) {
      return auth.response;
    }

    const { id } = await context.params;
    const appId = parseAppId(id);

    if (!appId) {
      return missingAppResponse();
    }

    const revoked = await revokeDeveloperApp(auth.developerId, appId);
    return NextResponse.json(revoked);
  } catch (error) {
    const mapped = appErrorResponse(error);

    if (mapped) {
      return mapped;
    }

    console.error('No se pudo revocar la app.', error);
    return NextResponse.json(
      { message: 'Ocurrió un error interno al revocar la app.' },
      { status: 500 },
    );
  }
}
