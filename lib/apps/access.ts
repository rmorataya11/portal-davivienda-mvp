import { NextResponse } from 'next/server';

import { getRequestSession } from '@/lib/auth/server';
import {
  AppForbiddenError,
  AppLimitError,
  AppNotFoundError,
  AppStateError,
} from '@/lib/db/apps';
import { findDeveloperIdByIdentityUid } from '@/lib/db/developers';
import { readTrimmedString } from '@/lib/validation/fields';

const APP_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const NAME_MAX = 200;
const DESCRIPTION_MAX = 4000;
const API_PRODUCT_MAX = 120;

export const SECRET_WARNING =
  'El consumer secret solo se muestra en esta respuesta y no se podrá volver a consultar.';

type AuthSuccess = { developerId: string; response?: undefined };
type AuthFailure = { developerId?: undefined; response: NextResponse };

export async function requireAppDeveloper(request: Request): Promise<AuthSuccess | AuthFailure> {
  const session = await getRequestSession(request);

  if (!session) {
    return {
      response: NextResponse.json(
        { message: 'Debe iniciar sesión para gestionar sus apps.' },
        { status: 401 },
      ),
    };
  }

  const developerId = await findDeveloperIdByIdentityUid(session.uid);

  if (!developerId) {
    return {
      response: NextResponse.json(
        { message: 'No hay un perfil de developer asociado a esta sesión.' },
        { status: 403 },
      ),
    };
  }

  return { developerId };
}

export function parseAppId(id: string) {
  return APP_ID_PATTERN.test(id) ? id : null;
}

export async function readJsonObject(
  request: Request,
): Promise<{ body: Record<string, unknown> } | { response: NextResponse }> {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return {
        response: NextResponse.json(
          { message: 'El cuerpo de la solicitud no es válido.' },
          { status: 400 },
        ),
      };
    }

    return { body: body as Record<string, unknown> };
  } catch {
    return {
      response: NextResponse.json(
        { message: 'El cuerpo de la solicitud no es válido.' },
        { status: 400 },
      ),
    };
  }
}

export function readApiProduct(
  value: unknown,
): { value: string } | { response: NextResponse } {
  if (Array.isArray(value)) {
    return {
      response: NextResponse.json(
        { message: 'Indique un solo producto, no una lista.' },
        { status: 400 },
      ),
    };
  }

  if (value !== undefined && value !== null && typeof value !== 'string') {
    return {
      response: NextResponse.json({ message: 'El producto debe ser texto.' }, { status: 400 }),
    };
  }

  const apiProduct = readTrimmedString(value);

  if (apiProduct.length > API_PRODUCT_MAX) {
    return {
      response: NextResponse.json(
        { message: `El producto no puede superar ${API_PRODUCT_MAX} caracteres.` },
        { status: 400 },
      ),
    };
  }

  return { value: apiProduct };
}

export function readAppName(value: unknown): { value: string } | { response: NextResponse } {
  if (value !== undefined && value !== null && typeof value !== 'string') {
    return {
      response: NextResponse.json({ message: 'El nombre debe ser texto.' }, { status: 400 }),
    };
  }

  const name = readTrimmedString(value);

  if (name.length > NAME_MAX) {
    return {
      response: NextResponse.json(
        { message: `El nombre no puede superar ${NAME_MAX} caracteres.` },
        { status: 400 },
      ),
    };
  }

  return { value: name };
}

export function readOptionalDescription(
  body: Record<string, unknown>,
): { value: string | null } | { response: NextResponse } {
  if (!Object.prototype.hasOwnProperty.call(body, 'description') || body.description == null) {
    return { value: null };
  }

  if (typeof body.description !== 'string') {
    return {
      response: NextResponse.json({ message: 'La descripción debe ser texto.' }, { status: 400 }),
    };
  }

  const description = body.description.trim();

  if (description.length > DESCRIPTION_MAX) {
    return {
      response: NextResponse.json(
        { message: `La descripción no puede superar ${DESCRIPTION_MAX} caracteres.` },
        { status: 400 },
      ),
    };
  }

  return { value: description || null };
}

export function appErrorResponse(error: unknown) {
  if (error instanceof AppLimitError) {
    return NextResponse.json({ message: error.message }, { status: 409 });
  }

  if (error instanceof AppNotFoundError) {
    return NextResponse.json({ message: error.message }, { status: 404 });
  }

  if (error instanceof AppForbiddenError) {
    return NextResponse.json({ message: error.message }, { status: 403 });
  }

  if (error instanceof AppStateError) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return null;
}
