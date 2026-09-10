export type ApiCatalogItem = {
  slug: string;
  name: string;
  description: string;
  category: string;
  status: "Producción";
  imageSrc?: string;
};

export type ApiDetailSection = {
  title: string;
  items: string[];
};

export type ApiEndpoint = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  playground: {
    httpUrl: string;
    contentType: string;
    credentialsLabel: string;
    parameters: Array<{
      name: string;
      type: string;
      required?: boolean;
      location: "query" | "body" | "header";
      description: string;
    }>;
    requestBody: string;
    responseStatus: string;
    responseBody: string;
  };
};

export type ApiError = {
  code: string;
  title: string;
  description: string;
};

export type ApiDetail = ApiCatalogItem & {
  heroImageSrc?: string;
  heroSceneSrc?: string;
  heroDescription: string;
  intro: string;
  quickFacts: Array<{ label: string; value: string }>;
  coverage: { value: string; detail: string };
  idealFor: string;
  benefits: string[];
  useCases: string[];
  requirements: string[];
  authentication: {
    title: string;
    description: string;
    headers: string[];
  };
  environments: string[];
  endpoints: ApiEndpoint[];
  sampleRequest: string;
  sampleResponse: string;
  errors: ApiError[];
  supportNote: string;
};

const tesoreriaMovimientosRequest = `{
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
}`;

const tesoreriaMovimientosResponse = `{
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

const tesoreria: ApiDetail = {
  slug: "api-tesoreria",
  name: "API Tesorería",
  description:
    "Optimice la liquidez corporativa y la toma de decisiones en tiempo real. Integre la posición consolidada de fondos de su empresa directamente con sus sistemas centrales.",
  category: "Cuentas",
  status: "Producción",
  heroSceneSrc: "/treasury-hero-illustration.svg",
  heroDescription:
    "Consulta los movimientos de una cuenta empresarial, con soporte de filtros por moneda y paginación.",
  intro:
    "Pensada para empresas que necesitan visibilidad financiera en tiempo casi real, esta API centraliza información clave para conciliar, proyectar caja y automatizar procesos de backoffice.",
  quickFacts: [
    { label: "Producto", value: "Tesorería" },
    { label: "Uso ideal", value: "B2B corporativo" },
    { label: "Cobertura", value: "Movimientos empresariales" },
    { label: "Valor", value: "Liquidez en tiempo real" },
  ],
  coverage: {
    value: "1 endpoint",
    detail: "POST /conciliacion/bancaempresa/movimientos/",
  },
  idealFor:
    "Equipos que necesitan liquidez visible, conciliación rápida y automatización en sus flujos internos.",
  benefits: [
    "Automatice conciliaciones y reduzca pasos manuales en sus procesos internos.",
    "Integre información de tesorería en ERPs, dashboards y flujos operativos.",
  ],
  useCases: ["Monitoreo de movimientos para conciliación automática."],
  requirements: [
    "Tener una cuenta de desarrollador activa y acceso aprobado al producto.",
    "Contar con credenciales del ambiente Sandbox o Producción según la etapa de integración.",
    "Disponer de un backend seguro para gestionar tokens, trazabilidad y consumo de endpoints.",
  ],
  authentication: {
    title: "Credenciales de cliente y cabeceras seguras",
    description:
      "La integración requiere credenciales provistas por Davivienda y el envío de cabeceras de seguridad para identificar la aplicación y rastrear cada operación.",
    headers: ["x-api-key: TU_API_KEY", "Content-Type: application/json"],
  },
  environments: ["Sandbox para pruebas funcionales", "Producción para operaciones autorizadas"],
  endpoints: [
    {
      method: "POST",
      path: "/conciliacion/bancaempresa/movimientos/",
      description: "Consulta los movimientos de una cuenta empresarial, con soporte de filtros por moneda y paginación.",
      playground: {
        httpUrl: "https://api.davivienda.com/conciliacion/bancaempresa/movimientos/",
        contentType: "application/json",
        credentialsLabel: "ApiKeyAuth",
        parameters: [
          {
            name: "nit",
            type: "string[]",
            required: true,
            location: "body",
            description: "NIT de la empresa (array, puede aceptar más de uno)",
          },
          {
            name: "fechaInicial",
            type: "string (YYYY-MM-DD)",
            required: true,
            location: "body",
            description: "Fecha inicial del rango de consulta",
          },
          {
            name: "fechaFinal",
            type: "string (YYYY-MM-DD)",
            required: true,
            location: "body",
            description: "Fecha final del rango de consulta",
          },
          {
            name: "filtros",
            type: "array de objetos",
            required: false,
            location: "body",
            description: "Filtros adicionales, ej. { tipo: 'moneda', valor: 'usd' }",
          },
          {
            name: "paginacion.ASC",
            type: "boolean",
            required: true,
            location: "body",
            description: "Orden ascendente (true) o descendente (false)",
          },
          {
            name: "paginacion.pagina",
            type: "number",
            required: true,
            location: "body",
            description: "Número de página, empieza en 0",
          },
          {
            name: "paginacion.tamanoPagina",
            type: "number",
            required: true,
            location: "body",
            description: "Cantidad de resultados por página",
          },
        ],
        requestBody: tesoreriaMovimientosRequest,
        responseStatus: "200 OK",
        responseBody: tesoreriaMovimientosResponse,
      },
    },
  ],
  sampleRequest: `curl -X POST https://api.davivienda.com/conciliacion/bancaempresa/movimientos/ \\
  -H "x-api-key: TU_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "nit": ["90012345601"],
    "fechaInicial": "2025-01-01",
    "fechaFinal": "2025-01-09",
    "filtros": [{ "tipo": "moneda", "valor": "usd" }],
    "paginacion": { "ASC": true, "pagina": 0, "tamanoPagina": 1 }
  }'`,
  sampleResponse: tesoreriaMovimientosResponse,
  errors: [
    {
      code: "400",
      title: "Solicitud inválida",
      description: "Falta nit, fechaInicial, fechaFinal o paginacion, o el rango de fechas no es válido.",
    },
    {
      code: "401",
      title: "No autorizado",
      description: "La llave de acceso es inválida, expiró o no corresponde a este ambiente.",
    },
    {
      code: "500",
      title: "Error interno",
      description: "Ocurrió una incidencia temporal al procesar la consulta. Reintente más tarde.",
    },
  ],
  supportNote:
    "Si su caso de uso requiere validaciones adicionales, cobertura por múltiples cuentas o volúmenes corporativos altos, nuestro equipo le acompaña en el proceso de habilitación.",
};

/** Fuente única del catálogo. El MVP publica únicamente API Tesorería. */
export const apiDetails: ApiDetail[] = [tesoreria];

export const apiCatalogItems: ApiCatalogItem[] = apiDetails.map((api) => ({
  slug: api.slug,
  name: api.name,
  description: api.description,
  category: api.category,
  status: api.status,
  imageSrc: api.imageSrc,
}));

export const apiCategories = ["Todas", ...Array.from(new Set(apiDetails.map((api) => api.category)))];

export function getApiDetailBySlug(slug: string) {
  return apiDetails.find((api) => api.slug === slug);
}
