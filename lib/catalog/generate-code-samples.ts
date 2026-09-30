export type CodeSampleMethod = "GET" | "POST" | "PUT" | "DELETE";

export type CodeSampleParameter = {
  name: string;
  location: "query" | "body" | "header";
  type?: string;
  required?: boolean;
  description?: string;
};

export type CodeSampleError = {
  code: string;
  title: string;
  description: string;
};

export type CodeSampleSource = {
  method: CodeSampleMethod;
  path: string;
  httpUrl: string;
  contentType: string;
  description: string;
  requestBody: string;
  responseStatus: string;
  responseBody: string;
  parameters: CodeSampleParameter[];
  errors: CodeSampleError[];
};

export type CodeRequestExamples = {
  json: string;
  curl: string;
  javascript: string;
  python: string;
};

export type CodeResponseExample = {
  status: number;
  label: string;
  kind: "success" | "error";
  body: string;
};

export type GeneratedDocsEndpoint = {
  id: string;
  name: string;
  method: CodeSampleMethod;
  path: string;
  httpUrl: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  requestExamples: CodeRequestExamples;
  responseExample: string;
  responseExamples: CodeResponseExample[];
};

const CORRELATION_ID = "45ef2c7a-01f4-4f35-b7f5-8f81d2c0e9be";

const AUTH_HEADERS: Record<string, string> = {
  Authorization: "Bearer <token>",
  "x-api-key": "<client-id>",
  "x-correlation-id": CORRELATION_ID,
};

const ERROR_LABELS: Record<string, string> = {
  "400": "400 Bad Request",
  "401": "401 Unauthorized",
  "500": "500 Internal Server Error",
};

const ERROR_TYPE_SLUGS: Record<string, string> = {
  "400": "invalid-request",
  "401": "unauthorized",
  "500": "internal-error",
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

export function resolveHttpUrl(endpoint: CodeSampleSource): string {
  const values = parseBody(endpoint.requestBody);
  const usedKeys = new Set<string>();

  const url = endpoint.httpUrl.replace(/\{(\w+)\}/g, (_, key: string) => {
    usedKeys.add(key);
    return values[key] != null ? asQueryValue(values[key]) : `{${key}}`;
  });

  if (endpoint.method !== "GET") {
    return url;
  }

  const search = new URLSearchParams();

  endpoint.parameters.forEach((parameter) => {
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

function sendsRequestBody(method: CodeSampleMethod): boolean {
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
  return requestBody.trim().replace(/\btrue\b/g, "True").replace(/\bfalse\b/g, "False").replace(/\bnull\b/g, "None");
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

export function buildCurlExample(endpoint: CodeSampleSource, url = resolveHttpUrl(endpoint)): string {
  const includeBody = sendsRequestBody(endpoint.method);
  const lines = [
    `curl --request ${endpoint.method} \\`,
    `  --url ${url} \\`,
    ...headerLines(includeBody ? endpoint.contentType : undefined).map((line) => `  ${line}`),
  ];

  if (includeBody) {
    lines[lines.length - 1] = `${lines[lines.length - 1]} \\`;
    lines.push(`  --data '${compactJson(endpoint.requestBody)}'`);
  }

  return lines.join("\n");
}

export function buildJavascriptExample(endpoint: CodeSampleSource, url = resolveHttpUrl(endpoint)): string {
  const includeBody = sendsRequestBody(endpoint.method);
  const headers = includeBody ? { ...AUTH_HEADERS, "Content-Type": endpoint.contentType } : AUTH_HEADERS;

  if (!includeBody) {
    return `const response = await fetch(${JSON.stringify(url)}, {
  method: ${JSON.stringify(endpoint.method)},
  headers: ${formatJsHeaders(headers)},
});

const data = await response.json();`;
  }

  return `const payload = ${endpoint.requestBody.trim()};

const response = await fetch(${JSON.stringify(url)}, {
  method: ${JSON.stringify(endpoint.method)},
  headers: ${formatJsHeaders(headers)},
  body: JSON.stringify(payload),
});

const data = await response.json();`;
}

export function buildPythonExample(endpoint: CodeSampleSource, url = resolveHttpUrl(endpoint)): string {
  const method = endpoint.method.toLowerCase();
  const includeBody = sendsRequestBody(endpoint.method);
  const headers = includeBody ? { ...AUTH_HEADERS, "Content-Type": endpoint.contentType } : AUTH_HEADERS;

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
payload = ${toPythonLiteral(endpoint.requestBody)}

response = requests.${method}(url, headers=headers, json=payload)
print(response.json())`;
}

export function prettyRequestJson(requestBody: string) {
  try {
    return JSON.stringify(JSON.parse(requestBody), null, 2);
  } catch {
    return requestBody.trim();
  }
}

export function buildRequestExamples(endpoint: CodeSampleSource): CodeRequestExamples {
  return {
    json: prettyRequestJson(endpoint.requestBody),
    curl: buildCurlExample(endpoint),
    javascript: buildJavascriptExample(endpoint),
    python: buildPythonExample(endpoint),
  };
}

export function problemDetails(status: number, title: string, detail: string, instance: string, typeSlug: string) {
  return JSON.stringify(
    {
      type: `https://api.example.com/problems/${typeSlug}`,
      title,
      status,
      detail,
      instance,
    },
    null,
    2,
  );
}

function successStatus(responseStatus: string) {
  const raw = responseStatus.match(/^(\d{3})/)?.[1];
  return raw ? Number(raw) : 200;
}

export function buildResponseExamples(endpoint: CodeSampleSource): CodeResponseExample[] {
  const examples: CodeResponseExample[] = [
    {
      status: successStatus(endpoint.responseStatus),
      label: endpoint.responseStatus,
      kind: "success",
      body: endpoint.responseBody.trim(),
    },
  ];

  for (const error of endpoint.errors) {
    const status = Number(error.code);
    if (!Number.isInteger(status)) {
      continue;
    }

    examples.push({
      status,
      label: ERROR_LABELS[error.code] ?? `${error.code} ${error.title}`,
      kind: "error",
      body: problemDetails(
        status,
        error.title,
        error.description,
        endpoint.path,
        ERROR_TYPE_SLUGS[error.code] ?? "error",
      ),
    });
  }

  return examples;
}

export function endpointFileName(endpoint: Pick<CodeSampleSource, "method" | "path">) {
  if (endpoint.path === "/conciliacion/bancaempresa/movimientos/") {
    return "consulta-movimientos";
  }

  const segment = endpoint.path.split("/").filter((part) => part && !part.startsWith("{")).at(-1) ?? "endpoint";
  return `${segment}.${endpoint.method.toLowerCase()}`;
}

export function toDocsEndpoint(apiId: string, endpoint: CodeSampleSource): GeneratedDocsEndpoint {
  return {
    id: `${apiId}:${endpoint.method}:${endpoint.path}`,
    name: endpointFileName(endpoint),
    method: endpoint.method,
    path: endpoint.path,
    httpUrl: endpoint.httpUrl,
    description: endpoint.description,
    parameters: endpoint.parameters.map((parameter) => ({
      name: parameter.name,
      type: parameter.type ?? "string",
      required: Boolean(parameter.required),
      description: parameter.description ?? "",
    })),
    requestExamples: buildRequestExamples(endpoint),
    responseExample: endpoint.responseBody,
    responseExamples: buildResponseExamples(endpoint),
  };
}
