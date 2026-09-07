import type { ApiEndpoint } from "@/components/catalog/content/apis";

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
    json: string;
    curl: string;
    javascript: string;
    python: string;
  };
  responseExample: string;
  responseExamples: DocsResponseExample[];
};

export type DocsResponseExample = {
  status: number;
  label: string;
  kind: "success" | "error";
  body: string;
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

function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function prettyRequestJson(requestBody: string) {
  try {
    return prettyJson(JSON.parse(requestBody));
  } catch {
    return requestBody.trim();
  }
}

function problemDetails(status: number, title: string, detail: string, instance: string, typeSlug: string) {
  return prettyJson({
    type: `https://api.example.com/problems/${typeSlug}`,
    title,
    status,
    detail,
    instance,
  });
}

function successStatus(endpoint: ApiEndpoint) {
  const raw = endpoint.playground.responseStatus.match(/^(\d{3})/)?.[1];
  return raw ? Number(raw) : 200;
}

function buildResponseExamples(endpoint: ApiEndpoint): DocsResponseExample[] {
  const instance = endpoint.path;
  const success = successStatus(endpoint);
  const examples: DocsResponseExample[] = [
    {
      status: success,
      label: endpoint.playground.responseStatus,
      kind: "success",
      body: endpoint.playground.responseBody.trim(),
    },
  ];

  const hasPathId = endpoint.path.includes("{");
  const isLookup = endpoint.method === "GET" && hasPathId;
  const refundsRelatedResource = endpoint.path.includes("/refunds");
  const readsAccount = endpoint.path.includes("/balances") || endpoint.path.includes("/movements");

  examples.push({
    status: 400,
    label: "400 Bad Request",
    kind: "error",
    body: problemDetails(
      400,
      "Solicitud inválida",
      endpoint.method === "GET"
        ? "Falta un parámetro requerido o el valor enviado no es válido para esta consulta."
        : "El cuerpo de la solicitud está incompleto o no cumple el formato esperado.",
      instance,
      "invalid-request",
    ),
  });

  examples.push({
    status: 401,
    label: "401 Unauthorized",
    kind: "error",
    body: problemDetails(
      401,
      "No autorizado",
      "La llave de acceso es inválida, expiró o no corresponde a este ambiente.",
      instance,
      "unauthorized",
    ),
  });

  if (isLookup || refundsRelatedResource || readsAccount) {
    examples.push({
      status: 404,
      label: "404 Not Found",
      kind: "error",
      body: problemDetails(
        404,
        "Recurso no encontrado",
        isLookup
          ? "No existe un recurso con el identificador indicado."
          : refundsRelatedResource
            ? "No se encontró el cobro asociado a esta solicitud de reembolso."
            : "No se encontró la cuenta indicada en accountId.",
        instance,
        "not-found",
      ),
    });
  }

  if (endpoint.method === "POST") {
    examples.push({
      status: 500,
      label: "500 Internal Server Error",
      kind: "error",
      body: problemDetails(
        500,
        "Error interno",
        "Ocurrió una incidencia temporal al procesar la operación. Reintente más tarde.",
        instance,
        "internal-error",
      ),
    });
  }

  return examples;
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
      json: prettyRequestJson(endpoint.playground.requestBody),
      curl: buildCurlExample(endpoint, url),
      javascript: buildJavascriptExample(endpoint, url),
      python: buildPythonExample(endpoint, url),
    },
    responseExample: endpoint.playground.responseBody,
    responseExamples: buildResponseExamples(endpoint),
  };
}

const consultaMovimientosResponse = `{
  "code": "OK",
  "message": "Exito",
  "listMessage": null,
  "response": {
    "contenido": [
      {
        "niu": 100099999,
        "cuenta": "5199988877",
        "movimiento": {
          "tipo": "CUENTA CORRIENTE CON INTERESES",
          "numero": "5199988877",
          "fecha": "9-01-2025 20:57:01",
          "nombre": "EMPRESA DE EJEMPLO S.A.",
          "nombreBeneficiario": "",
          "tipoTransaccion": "OTROS",
          "tipoMovimiento": "Cargo",
          "tipoEjecucion": "",
          "moneda": "USD",
          "monto": 500.00,
          "idInterno": 0,
          "idInterno2": null,
          "descripcion": "PAGO DE SERVICIOS",
          "numeroCheque": "",
          "detalle": {
            "confirmacionDetalle": "Detalle no encontrado"
          }
        }
      }
    ],
    "pagina": 0,
    "tamanoPagina": 1,
    "totalElementos": 11299,
    "totalPaginas": 11299,
    "primeraPagina": true,
    "ultimaPagina": false
  }
}`;

const consultaMovimientos: DocsEndpoint = {
  id: "consulta-movimientos",
  name: "consulta-movimientos",
  method: "POST",
  path: "/conciliacion/bancaempresa/movimientos/",
  httpUrl: "https://api.davivienda.com/conciliacion/bancaempresa/movimientos/",
  description: "Consulta los movimientos de una cuenta empresarial, con soporte de filtros por moneda y paginación.",
  parameters: [
    {
      name: "nit",
      type: "string[]",
      required: true,
      description: "NIT de la empresa (array, puede aceptar más de uno)",
    },
    {
      name: "fechaInicial",
      type: "string (YYYY-MM-DD)",
      required: true,
      description: "Fecha inicial del rango de consulta",
    },
    {
      name: "fechaFinal",
      type: "string (YYYY-MM-DD)",
      required: true,
      description: "Fecha final del rango de consulta",
    },
    {
      name: "filtros",
      type: "array de objetos",
      required: false,
      description: "Filtros adicionales, ej. { tipo: 'moneda', valor: 'usd' }",
    },
    {
      name: "paginacion.ASC",
      type: "boolean",
      required: true,
      description: "Orden ascendente (true) o descendente (false)",
    },
    {
      name: "paginacion.pagina",
      type: "number",
      required: true,
      description: "Número de página, empieza en 0",
    },
    {
      name: "paginacion.tamanoPagina",
      type: "number",
      required: true,
      description: "Cantidad de resultados por página",
    },
  ],
  requestExamples: {
    json: `{
  "nit": [
    "90012345601"
  ],
  "fechaInicial": "2025-01-01",
  "fechaFinal": "2025-01-09",
  "filtros": [
    {
      "tipo": "moneda",
      "valor": "usd"
    }
  ],
  "paginacion": {
    "ASC": true,
    "pagina": 0,
    "tamanoPagina": 1
  }
}`,
    curl: `curl -X POST https://api.davivienda.com/conciliacion/bancaempresa/movimientos/ \\
  -H "x-api-key: TU_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "nit": ["90012345601"],
    "fechaInicial": "2025-01-01",
    "fechaFinal": "2025-01-09",
    "filtros": [{ "tipo": "moneda", "valor": "usd" }],
    "paginacion": { "ASC": true, "pagina": 0, "tamanoPagina": 1 }
  }'`,
    javascript: `const response = await fetch("https://api.davivienda.com/conciliacion/bancaempresa/movimientos/", {
  method: "POST",
  headers: {
    "x-api-key": "TU_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    nit: ["90012345601"],
    fechaInicial: "2025-01-01",
    fechaFinal: "2025-01-09",
    filtros: [{ tipo: "moneda", valor: "usd" }],
    paginacion: { ASC: true, pagina: 0, tamanoPagina: 1 }
  })
});
const data = await response.json();`,
    python: `import requests

response = requests.post(
    "https://api.davivienda.com/conciliacion/bancaempresa/movimientos/",
    headers={"x-api-key": "TU_API_KEY", "Content-Type": "application/json"},
    json={
        "nit": ["90012345601"],
        "fechaInicial": "2025-01-01",
        "fechaFinal": "2025-01-09",
        "filtros": [{"tipo": "moneda", "valor": "usd"}],
        "paginacion": {"ASC": True, "pagina": 0, "tamanoPagina": 1}
    }
)
data = response.json()`,
  },
  responseExample: consultaMovimientosResponse,
  responseExamples: [
    {
      status: 200,
      label: "200 OK",
      kind: "success",
      body: consultaMovimientosResponse,
    },
    {
      status: 400,
      label: "400 Bad Request",
      kind: "error",
      body: problemDetails(
        400,
        "Solicitud inválida",
        "Falta nit, fechaInicial, fechaFinal o paginacion, o el rango de fechas no es válido.",
        "/conciliacion/bancaempresa/movimientos/",
        "invalid-request",
      ),
    },
    {
      status: 401,
      label: "401 Unauthorized",
      kind: "error",
      body: problemDetails(
        401,
        "No autorizado",
        "La llave de acceso es inválida, expiró o no corresponde a este ambiente.",
        "/conciliacion/bancaempresa/movimientos/",
        "unauthorized",
      ),
    },
    {
      status: 500,
      label: "500 Internal Server Error",
      kind: "error",
      body: problemDetails(
        500,
        "Error interno",
        "Ocurrió una incidencia temporal al procesar la consulta. Reintente más tarde.",
        "/conciliacion/bancaempresa/movimientos/",
        "internal-error",
      ),
    },
  ],
};

export const docsApis: DocsApi[] = [
  {
    apiId: "api-tesoreria",
    apiName: "API Tesorería",
    endpoints: [consultaMovimientos],
  },
];

export const defaultDocsEndpointId = consultaMovimientos.id;

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
