import { problemDetails } from "@/lib/catalog/generate-code-samples";

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
    "0614-290191-101-3"
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
    "nit": ["0614-290191-101-3"],
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
    nit: ["0614-290191-101-3"],
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
        "nit": ["0614-290191-101-3"],
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
