import { getSessionIdToken } from "@/lib/auth/session";

import type { AppEnvironment, AppRecordStatus, CreateAppInput, CreatedAppResult, DeveloperApp, UpdateAppInput } from "./types";

export class AppsRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "AppsRequestError";
    this.status = status;
  }
}

type AppPayload = {
  id?: unknown;
  developerId?: unknown;
  name?: unknown;
  description?: unknown;
  apiProduct?: unknown;
  environment?: unknown;
  apigeeAppName?: unknown;
  status?: unknown;
  dailyQuota?: unknown;
  createdAt?: unknown;
  consumerKey?: unknown;
  expiresAt?: unknown;
  consumerSecret?: unknown;
};

function isEnvironment(value: unknown): value is AppEnvironment {
  return value === "sandbox" || value === "contracting" || value === "production";
}

function isRecordStatus(value: unknown): value is AppRecordStatus {
  return value === "active" || value === "revoked";
}

function toApp(payload: AppPayload): DeveloperApp {
  if (
    typeof payload.id !== "string" ||
    typeof payload.developerId !== "string" ||
    typeof payload.name !== "string" ||
    typeof payload.apiProduct !== "string" ||
    !isEnvironment(payload.environment) ||
    !isRecordStatus(payload.status) ||
    typeof payload.createdAt !== "string"
  ) {
    throw new AppsRequestError(500, "La respuesta de la app no tiene el formato esperado.");
  }

  return {
    id: payload.id,
    developerId: payload.developerId,
    name: payload.name,
    description: typeof payload.description === "string" ? payload.description : null,
    apiProduct: payload.apiProduct,
    environment: payload.environment,
    apigeeAppName: typeof payload.apigeeAppName === "string" ? payload.apigeeAppName : null,
    status: payload.status,
    dailyQuota: typeof payload.dailyQuota === "number" ? payload.dailyQuota : 2,
    createdAt: payload.createdAt,
    consumerKey: typeof payload.consumerKey === "string" ? payload.consumerKey : null,
    expiresAt: typeof payload.expiresAt === "string" ? payload.expiresAt : null,
  };
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
  const token = await getSessionIdToken();

  if (!token) {
    throw new AppsRequestError(401, "Debe iniciar sesión para gestionar sus apps.");
  }

  const response = await fetch(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
  });

  const body = (await response.json().catch(() => null)) as { message?: unknown } | AppPayload[] | null;

  if (!response.ok) {
    const message = body && !Array.isArray(body) && typeof body.message === "string" ? body.message : "";
    throw new AppsRequestError(response.status, message);
  }

  return body;
}

export async function fetchDeveloperApps(): Promise<DeveloperApp[]> {
  const body = await request("/api/apps");

  if (!Array.isArray(body)) {
    throw new AppsRequestError(500, "La respuesta del listado no tiene el formato esperado.");
  }

  return body.map((item) => toApp(item as AppPayload));
}

export async function fetchDeveloperApp(appId: string): Promise<DeveloperApp> {
  const body = await request(`/api/apps/${appId}`);
  return toApp(body as AppPayload);
}

export async function createDeveloperApp(input: CreateAppInput): Promise<CreatedAppResult> {
  const body = (await request("/api/apps", {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      description: input.description,
      apiProduct: input.apiProduct,
    }),
  })) as AppPayload;

  const consumerSecret = typeof body.consumerSecret === "string" ? body.consumerSecret : "";

  if (!consumerSecret) {
    throw new AppsRequestError(500, "La app se creó sin devolver el consumer secret.");
  }

  return {
    app: toApp(body),
    consumerSecret,
  };
}

export async function updateDeveloperApp(appId: string, input: UpdateAppInput): Promise<DeveloperApp> {
  const body = await request(`/api/apps/${appId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  return toApp(body as AppPayload);
}

export async function revokeDeveloperApp(appId: string): Promise<DeveloperApp> {
  const body = await request(`/api/apps/${appId}`, { method: "DELETE" });
  return toApp(body as AppPayload);
}

export async function markDeveloperAppContracting(appId: string): Promise<DeveloperApp> {
  const body = await request(`/api/apps/${appId}/mark-contracting`, { method: "POST" });
  return toApp(body as AppPayload);
}
