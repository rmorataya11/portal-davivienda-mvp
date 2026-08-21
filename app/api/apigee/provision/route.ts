import { NextResponse } from "next/server";

import { ApigeeRequestError, createDeveloper, createDeveloperApp } from "@/lib/apigee/client";

export const runtime = "nodejs";

type ProvisionRequestBody = {
  email?: unknown;
  firstName?: unknown;
  lastName?: unknown;
};

function readHostname() {
  const hostname = process.env.APIGEE_HOSTNAME;

  if (!hostname) {
    throw new Error("Missing required environment variable: APIGEE_HOSTNAME");
  }

  return hostname;
}

function normalizeName(value: string | undefined, fallback: string) {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : fallback;
}

function buildFallbackNames(email: string) {
  const localPart = email.split("@")[0] ?? "developer";
  const segments = localPart
    .split(/[._-]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const firstName = segments[0] ? capitalize(segments[0]) : "Developer";
  const lastName = segments[1] ? capitalize(segments.slice(1).join(" ")) : "Portal";

  return { firstName, lastName };
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildAppName(email: string) {
  const safeEmail = email
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return `sandbox-${safeEmail || "developer"}-${Date.now()}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ProvisionRequestBody;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json({ message: "El correo es obligatorio para provisionar credenciales." }, { status: 400 });
    }

    const fallbackNames = buildFallbackNames(email);
    const firstName = normalizeName(typeof body.firstName === "string" ? body.firstName : undefined, fallbackNames.firstName);
    const lastName = normalizeName(typeof body.lastName === "string" ? body.lastName : undefined, fallbackNames.lastName);

    await createDeveloper(email, firstName, lastName);

    const { consumerKey, expiresAt } = await createDeveloperApp(email, buildAppName(email));

    return NextResponse.json({
      consumerKey,
      expiresAt,
      hostname: readHostname(),
      basePath: "/v1",
    });
  } catch (error) {
    console.error("Apigee provisioning failed.", error);

    if (error instanceof ApigeeRequestError) {
      if (error.status === 401 || error.status === 403) {
        return NextResponse.json(
          { message: "Apigee rechazó la autenticación de la service account. Revise permisos y credenciales." },
          { status: 502 },
        );
      }

      if (error.status === 429) {
        return NextResponse.json(
          { message: "Apigee limitó temporalmente la Management API. Intente nuevamente en unos minutos." },
          { status: 429 },
        );
      }

      return NextResponse.json(
        { message: "No fue posible provisionar las credenciales en Apigee." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { message: "Ocurrió un error interno al provisionar las credenciales." },
      { status: 500 },
    );
  }
}
