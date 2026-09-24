import { NextResponse } from "next/server";

import { createSupportCase, isSupportCaseSeverity } from "@/lib/db/support-cases";
import { escapeHtml, sendNotificationEmail } from "@/lib/email/resend";
import { readTrimmedString } from "@/lib/validation/fields";

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
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SupportCaseBody;
    const titulo = readTrimmedString(body.titulo) || readTrimmedString(body.title);
    const descripcion = readTrimmedString(body.descripcion) || readTrimmedString(body.description);
    const severidad = readTrimmedString(body.severidad) || readTrimmedString(body.severity);
    const developerId = readTrimmedString(body.developerId);
    const apiSlug = readTrimmedString(body.apiSlug);

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
      developerId: developerId || undefined,
      titulo,
      descripcion,
      severidad,
    });

    await sendNotificationEmail(
      `Nuevo caso de soporte: ${titulo}`,
      `
        <h1>Nuevo caso de soporte</h1>
        <p><strong>ID:</strong> ${escapeHtml(created.id)}</p>
        <p><strong>Título:</strong> ${escapeHtml(created.titulo)}</p>
        <p><strong>Descripción:</strong> ${escapeHtml(created.descripcion)}</p>
        <p><strong>Severidad:</strong> ${escapeHtml(created.severidad)}</p>
        <p><strong>Estado:</strong> ${escapeHtml(created.status)}</p>
        <p><strong>Developer ID:</strong> ${escapeHtml(created.developerId ?? "no identificado")}</p>
        <p><strong>API afectada:</strong> ${escapeHtml(apiSlug || "No aplica / General")}</p>
      `,
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("No se pudo crear el caso de soporte.", error);
    return NextResponse.json(
      { message: "Ocurrió un error interno al crear el caso de soporte." },
      { status: 500 },
    );
  }
}
