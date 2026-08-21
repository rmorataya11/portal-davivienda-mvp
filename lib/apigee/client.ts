import { JWT } from "google-auth-library";

const APIGEE_SCOPE = "https://www.googleapis.com/auth/cloud-platform";
const APIGEE_BASE_URL = "https://apigee.googleapis.com/v1";
const APP_KEY_EXPIRES_IN_MS = "2592000000";

type ApigeeCredential = {
  consumerKey?: string;
  consumerSecret?: string;
  expiresAt?: string;
};

type ApigeeDeveloperAppResponse = {
  credentials?: ApigeeCredential[];
};

type ApigeeErrorDetails = {
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

export class ApigeeRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApigeeRequestError";
  }
}

function readRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getApigeeOrg() {
  return readRequiredEnv("APIGEE_ORG");
}

function getApigeeApiProductName() {
  return readRequiredEnv("APIGEE_API_PRODUCT_NAME");
}

let jwtClient: JWT | undefined;

function getJwtClient() {
  if (jwtClient) {
    return jwtClient;
  }

  jwtClient = new JWT({
    email: readRequiredEnv("APIGEE_SA_CLIENT_EMAIL"),
    key: readRequiredEnv("APIGEE_SA_PRIVATE_KEY").replace(/\\n/g, "\n"),
    scopes: [APIGEE_SCOPE],
  });

  return jwtClient;
}

async function getAccessToken() {
  const token = await getJwtClient().authorize();

  if (!token.access_token) {
    throw new Error("Could not obtain an Apigee access token.");
  }

  return token.access_token;
}

async function apigeeRequest<T>(path: string, init: RequestInit) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${APIGEE_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const rawBody = await response.text();
  const parsedBody = rawBody ? safeJsonParse(rawBody) : undefined;

  if (!response.ok) {
    const details = parsedBody ?? rawBody;
    const message =
      getApigeeErrorMessage(parsedBody) ??
      response.statusText ??
      "Apigee request failed.";

    throw new ApigeeRequestError(message, response.status, details);
  }

  return (parsedBody ?? rawBody) as T;
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return undefined;
  }
}

function getApigeeErrorMessage(details: unknown) {
  if (!details || typeof details !== "object") {
    return undefined;
  }

  return (details as ApigeeErrorDetails).error?.message;
}

function isDeveloperAlreadyExistsError(error: unknown) {
  if (!(error instanceof ApigeeRequestError)) {
    return false;
  }

  if (error.status === 409) {
    return true;
  }

  const message = `${error.message}`.toLowerCase();
  return message.includes("already exists") || message.includes("duplicate");
}

export async function createDeveloper(email: string, firstName: string, lastName: string) {
  try {
    await apigeeRequest<void>(`/organizations/${encodeURIComponent(getApigeeOrg())}/developers`, {
      method: "POST",
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        userName: email,
      }),
    });
  } catch (error) {
    if (isDeveloperAlreadyExistsError(error)) {
      return;
    }

    throw error;
  }
}

export async function createDeveloperApp(email: string, appName: string) {
  const response = await apigeeRequest<ApigeeDeveloperAppResponse>(
    `/organizations/${encodeURIComponent(getApigeeOrg())}/developers/${encodeURIComponent(email)}/apps`,
    {
      method: "POST",
      body: JSON.stringify({
        name: appName,
        apiProducts: [getApigeeApiProductName()],
        keyExpiresIn: APP_KEY_EXPIRES_IN_MS,
      }),
    },
  );

  const credential = response.credentials?.[0];

  if (!credential?.consumerKey || !credential.consumerSecret || !credential.expiresAt) {
    throw new Error("Apigee app response did not include the expected credentials.");
  }

  return {
    consumerKey: credential.consumerKey,
    consumerSecret: credential.consumerSecret,
    expiresAt: credential.expiresAt,
  };
}
