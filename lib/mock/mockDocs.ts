import { apiDetails, type ApiEndpoint } from "@/components/catalog/content/apis";

export type DocsHttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type DocsParameter = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

export type DocsEndpoint = {
  id: string;
  name: string;
  method: DocsHttpMethod;
  path: string;
  httpUrl: string;
  description: string;
  parameters: DocsParameter[];
  requestExamples: {
    curl: string;
    javascript: string;
    python: string;
  };
  responseExample: string;
};

export type DocsApi = {
  apiId: string;
  apiName: string;
  endpoints: DocsEndpoint[];
};

const CORRELATION_ID = "45ef2c7a-01f4-4f35-b7f5-8f81d2c0e9be";

const AUTH_HEADERS: Record<string, string> = {
  Authorization: "Bearer <token>",
  "x-api-key": "<client-id>",
  "x-correlation-id": CORRELATION_ID,
};

function parseBody(requestBody: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(requestBody) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return {};
  }

  return {};
}

function asQueryValue(value: unknown): string {
  if (value == null) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function resolveHttpUrl(endpoint: ApiEndpoint): string {
  const values = parseBody(endpoint.playground.requestBody);
  const usedKeys = new Set<string>();

  const url = endpoint.playground.httpUrl.replace(/\{(\w+)\}/g, (_, key: string) => {
    usedKeys.add(key);
    return values[key] != null ? asQueryValue(values[key]) : `{${key}}`;
  });

  if (endpoint.method !== "GET") {
    return url;
  }

  const search = new URLSearchParams();

  endpoint.playground.parameters.forEach((parameter) => {
    if (parameter.location !== "query" || usedKeys.has(parameter.name)) {
      return;
    }

    const value = values[parameter.name];
    if (value == null) {
      return;
    }

    search.set(parameter.name, asQueryValue(value));
  });

  const query = search.toString();
  return query ? `${url}?${query}` : url;
}

function sendsRequestBody(method: DocsHttpMethod): boolean {
  return method === "POST" || method === "PUT";
}

function headerLines(contentType?: string): string[] {
  const lines = Object.entries(AUTH_HEADERS).map(([name, value]) => `--header '${name}: ${value}'`);

  if (contentType) {
    lines.push(`--header 'Content-Type: ${contentType}'`);
  }

  return lines;
}

function compactJson(requestBody: string): string {
  try {
    return JSON.stringify(JSON.parse(requestBody));
  } catch {
    return requestBody.trim();
  }
}

function toPythonLiteral(requestBody: string): string {
  return requestBody
    .trim()
    .replace(/\btrue\b/g, "True")
    .replace(/\bfalse\b/g, "False")
    .replace(/\bnull\b/g, "None");
}

function formatJsHeaders(headers: Record<string, string>): string {
  const entries = Object.entries(headers)
    .map(([name, value]) => `    ${JSON.stringify(name)}: ${JSON.stringify(value)}`)
    .join(",\n");

  return `{\n${entries},\n  }`;
}

function formatPythonHeaders(headers: Record<string, string>): string {
  const entries = Object.entries(headers)
    .map(([name, value]) => `    ${JSON.stringify(name)}: ${JSON.stringify(value)}`)
    .join(",\n");

  return `{\n${entries},\n}`;
}

function buildCurlExample(endpoint: ApiEndpoint, url: string): string {
  const method = endpoint.method;
  const includeBody = sendsRequestBody(method);
  const lines = [`curl --request ${method} \\`, `  --url ${url} \\`, ...headerLines(includeBody ? endpoint.playground.contentType : undefined).map((line) => `  ${line}`)];

  if (includeBody) {
    lines[lines.length - 1] = `${lines[lines.length - 1]} \\`;
    lines.push(`  --data '${compactJson(endpoint.playground.requestBody)}'`);
  }

  return lines.join("\n");
}

function buildJavascriptExample(endpoint: ApiEndpoint, url: string): string {
  const method = endpoint.method;
  const includeBody = sendsRequestBody(method);
  const headers = includeBody ? { ...AUTH_HEADERS, "Content-Type": endpoint.playground.contentType } : AUTH_HEADERS;

  if (!includeBody) {
    return `const response = await fetch(${JSON.stringify(url)}, {
  method: ${JSON.stringify(method)},
  headers: ${formatJsHeaders(headers)},
});

const data = await response.json();`;
  }

  return `const payload = ${endpoint.playground.requestBody.trim()};

const response = await fetch(${JSON.stringify(url)}, {
  method: ${JSON.stringify(method)},
  headers: ${formatJsHeaders(headers)},
  body: JSON.stringify(payload),
});

const data = await response.json();`;
}

function buildPythonExample(endpoint: ApiEndpoint, url: string): string {
  const method = endpoint.method.toLowerCase();
  const includeBody = sendsRequestBody(endpoint.method);
  const headers = includeBody ? { ...AUTH_HEADERS, "Content-Type": endpoint.playground.contentType } : AUTH_HEADERS;

  if (!includeBody) {
    return `import requests

url = ${JSON.stringify(url)}
headers = ${formatPythonHeaders(headers)}

response = requests.${method}(url, headers=headers)
print(response.json())`;
  }

  return `import requests

url = ${JSON.stringify(url)}
headers = ${formatPythonHeaders(headers)}
payload = ${toPythonLiteral(endpoint.playground.requestBody)}

response = requests.${method}(url, headers=headers, json=payload)
print(response.json())`;
}

function toFileName(endpoint: ApiEndpoint): string {
  const method = endpoint.method.toLowerCase();

  switch (endpoint.path) {
    case "/treasury/v1/balances":
      return `consultar-saldo.${method}`;
    case "/treasury/v1/movements":
      return `consultar-movimientos.${method}`;
    case "/treasury/v1/reports":
      return `solicitar-reportes.${method}`;
    case "/payments/v1/charges":
      return `procesar-cobro.${method}`;
    case "/payments/v1/charges/{chargeId}":
      return `consultar-cobro.${method}`;
    case "/payments/v1/refunds":
      return `solicitar-reembolso.${method}`;
    case "/accounts/v1/validate":
      return `validar-cuenta.${method}`;
    case "/accounts/v1/validate/{validationId}":
      return `consultar-validacion.${method}`;
    default: {
      const segment = endpoint.path.split("/").filter((part) => part && !part.startsWith("{")).at(-1) ?? "endpoint";
      return `${segment}.${method}`;
    }
  }
}

function toDocsEndpoint(apiId: string, endpoint: ApiEndpoint): DocsEndpoint {
  const url = resolveHttpUrl(endpoint);

  return {
    id: `${apiId}:${endpoint.method}:${endpoint.path}`,
    name: toFileName(endpoint),
    method: endpoint.method,
    path: endpoint.path,
    httpUrl: endpoint.playground.httpUrl,
    description: endpoint.description,
    parameters: endpoint.playground.parameters.map((parameter) => ({
      name: parameter.name,
      type: parameter.type,
      required: Boolean(parameter.required),
      description: parameter.description,
    })),
    requestExamples: {
      curl: buildCurlExample(endpoint, url),
      javascript: buildJavascriptExample(endpoint, url),
      python: buildPythonExample(endpoint, url),
    },
    responseExample: endpoint.playground.responseBody,
  };
}

export const docsApis: DocsApi[] = apiDetails.map((api) => ({
  apiId: api.slug,
  apiName: api.name,
  endpoints: api.endpoints.map((endpoint) => toDocsEndpoint(api.slug, endpoint)),
}));

export const defaultDocsEndpointId = docsApis[0]?.endpoints[0]?.id ?? "";

export function findDocsApi(apiId: string) {
  return docsApis.find((api) => api.apiId === apiId);
}

export function findDocsEndpoint(endpointId: string) {
  for (const api of docsApis) {
    const endpoint = api.endpoints.find((item) => item.id === endpointId);
    if (endpoint) {
      return { api, endpoint };
    }
  }

  return undefined;
}

export function docsBreadcrumbLabel(apiName: string) {
  return apiName.replace(/^API\s+/i, "");
}
