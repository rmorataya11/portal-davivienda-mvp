import { NextResponse } from "next/server";

import { getRequestSession } from "@/lib/auth/server";
import { createSupportCase, isSupportCaseSeverity } from "@/lib/db/support-cases";
import { sendConfirmationEmail, sendNotificationEmail } from "@/lib/email/mailer";
import { renderSupportCaseConfirmationEmail, renderSupportCaseEmail } from "@/lib/email/templates";
import { isValidEmail, readTrimmedString } from "@/lib/validation/fields";

export const runtime = "nodejs";

type SupportCaseBody = {
  titulo?: unknown;
  title?: unknown;
  descripcion?: unknown;
  description?: unknown;
  severidad?: unknown;
  severity?: unknown;
  developerId?: unknown;
  apiSlug?: unknown;
  email?: unknown;
};

export async function POST(request: Request) {
  try {
    const session = await getRequestSession(request);

    if (!session) {
      return NextResponse.json(
        { message: "Debe iniciar sesión para abrir un caso de soporte" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as SupportCaseBody;
    const titulo = readTrimmedString(body.titulo) || readTrimmedString(body.title);
    const descripcion = readTrimmedString(body.descripcion) || readTrimmedString(body.description);
    const severidad = readTrimmedString(body.severidad) || readTrimmedString(body.severity);
    const developerId = readTrimmedString(body.developerId);
    const apiSlug = readTrimmedString(body.apiSlug);
    const email = session.email || readTrimmedString(body.email);

    if (!titulo || !descripcion || !severidad) {
      return NextResponse.json(
        { message: "El título, la descripción y la severidad son obligatorios." },
        { status: 400 },
      );
    }

    if (!isSupportCaseSeverity(severidad)) {
      return NextResponse.json({ message: "Seleccione una severidad válida." }, { status: 400 });
    }

    const created = await createSupportCase({
      developerId: developerId || session.uid,
      titulo,
      descripcion,
      severidad,
    });

    await sendNotificationEmail(
      `[${severidad.toUpperCase()}] Nuevo caso de soporte: ${titulo}`,
      renderSupportCaseEmail({
        id: created.id,
        titulo: created.titulo,
        descripcion: created.descripcion,
        severidad: created.severidad,
        status: created.status,
        developerId: created.developerId,
        apiSlug,
      }),
      severidad === "bloqueante" ? "high" : "normal",
    );

    if (email && isValidEmail(email)) {
      await sendConfirmationEmail(
        email,
        "Hemos recibido su caso de soporte",
        renderSupportCaseConfirmationEmail({
          id: created.id,
          titulo: created.titulo,
        }),
      );
    } else if (email) {
      console.error("Se omitió la confirmación de soporte: el correo del usuario no es válido.");
    }

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("No se pudo crear el caso de soporte.", error);
    return NextResponse.json(
      { message: "Ocurrió un error interno al crear el caso de soporte." },
      { status: 500 },
    );
  }
}
