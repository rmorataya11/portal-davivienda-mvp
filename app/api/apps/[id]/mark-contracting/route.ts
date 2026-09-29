import { NextResponse } from 'next/server';

import { appErrorResponse, parseAppId, requireAppDeveloper } from '@/lib/apps/access';
import { markDeveloperAppContracting } from '@/lib/db/apps';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const auth = await requireAppDeveloper(request);

    if (auth.response) {
      return auth.response;
    }

    const { id } = await context.params;
    const appId = parseAppId(id);

    if (!appId) {
      return NextResponse.json({ message: 'No se encontró la app.' }, { status: 404 });
    }

    const updated = await markDeveloperAppContracting(auth.developerId, appId);
    return NextResponse.json(updated);
  } catch (error) {
    const mapped = appErrorResponse(error);

    if (mapped) {
      return mapped;
    }

    console.error('No se pudo marcar la app en contratación.', error);
    return NextResponse.json(
      { message: 'Ocurrió un error interno al marcar la app en contratación.' },
      { status: 500 },
    );
  }
}
