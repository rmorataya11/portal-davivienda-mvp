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
  journeySteps?: string[];
  endpoints: ApiEndpoint[];
  sampleRequest: string;
  sampleResponse: string;
  errors: ApiError[];
  supportNote: string;
};

const tesoreriaMovimientosRequest = `{
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
  imageSrc: "/catag/icons_apis/api_tesoreria_icon.svg",
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
    "Tenga visibilidad de la liquidez de su empresa en tiempo casi real y decida con información actualizada.",
    "Gane agilidad operativa: reduzca el tiempo de cierre contable y responda antes ante inconsistencias.",
  ],
  useCases: [
    "Conciliación bancaria automática: el cliente corporativo concilia cada día los movimientos de su cuenta contra el ERP o el sistema contable, sin intervención manual. Con fechaInicial y fechaFinal limita la consulta a las transacciones del día.",
    "Detección de pagos duplicados o inconsistencias: el equipo de tesorería cruza los movimientos con sus registros internos para identificar transacciones repetidas o montos inusuales. El NIT permite aislar cuentas específicas dentro de un grupo empresarial y la paginación recorre el histórico sin saturar el proceso.",
    "Reportería financiera para el cierre de mes: el área de finanzas genera reportes consolidados del flujo de caja para juntas directivas o auditorías. Filtra por moneda y por periodo con fechaInicial y fechaFinal, y pagina los resultados para armar la posición de tesorería del mes.",
  ],
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
            description: "Filtros adicionales, por ejemplo tipo moneda y valor usd",
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
    "nit": ["0614-290191-101-3"],
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

const estatusPagosBusquedaRequest = `{
  "nombreRemitente": "Empresa de Ejemplo S.A. de C.V.",
  "bancoEmisor": "Banco de Ejemplo",
  "montoMinimo": 100,
  "montoMaximo": 5000,
  "fechaInicial": "2025-01-01",
  "fechaFinal": "2025-01-09"
}`;

const estatusPagosBusquedaResponse = `{
  "code": "OK",
  "message": "Exito",
  "response": {
    "pagos": [
      {
        "token": "tok_pago_ejemplo_001",
        "estado": "disponible",
        "nombreRemitente": "Empresa de Ejemplo S.A. de C.V.",
        "bancoEmisor": "Banco de Ejemplo",
        "monto": 1250.00,
        "moneda": "USD",
        "fecha": "2025-01-08T14:32:00"
      }
    ]
  }
}`;

const estatusPagosBloqueoRequest = `{
  "token": "tok_pago_ejemplo_001"
}`;

const estatusPagosBloqueoResponse = `{
  "code": "OK",
  "message": "Exito",
  "response": {
    "token": "tok_pago_ejemplo_001",
    "estado": "bloqueado"
  }
}`;

const estatusPagos: ApiDetail = {
  slug: "api-estatus-pagos",
  name: "API Estatus de Pagos",
  description:
    "Consulte en tiempo real el estado de pagos interbancarios recibidos, bloquee transacciones sospechosas antes de liquidarlas y reduzca reclamos por pagos duplicados o retrasados.",
  category: "Pagos",
  status: "Producción",
  imageSrc: "/catag/icons_apis/api_estatus_pago.svg",
  heroDescription:
    "Consulte el estado de pagos interbancarios recibidos y bloquee transacciones sospechosas antes de liquidarlas.",
  intro:
    "Pensada para tesorería y operación, esta API permite buscar pagos entrantes, confirmar su estado y bloquear movimientos sospechosos antes de que se liquiden.",
  quickFacts: [
    { label: "Producto", value: "Estatus de Pagos" },
    { label: "Uso ideal", value: "B2B corporativo" },
    { label: "Cobertura", value: "Pagos interbancarios recibidos" },
    { label: "Valor", value: "Visibilidad y control en tiempo real" },
  ],
  coverage: {
    value: "2 endpoints",
    detail: "POST /pagos/estatus/busqueda/ · POST /pagos/estatus/bloqueo/",
  },
  idealFor:
    "Equipos de tesorería y operación que necesitan ver pagos entrantes y bloquear transacciones sospechosas a tiempo.",
  benefits: [
    "Reduzca fraude y pérdidas operativas bloqueando pagos sospechosos antes de que se confirmen.",
    "Tenga visibilidad en tiempo real de los pagos entrantes confirmados para su empresa, sin depender de conciliaciones manuales contra el banco.",
  ],
  useCases: [
    "Bloqueo preventivo de fraude: el equipo de tesorería identifica un pago sospechoso en la búsqueda y lo bloquea antes de que se liquide, usando el token de la transacción.",
    "Conciliación de pagos confirmados: el área contable consulta únicamente los pagos ya confirmados/bloqueados para conciliarlos contra sus registros internos, sin reprocesar pagos disponibles que aún no aplican.",
    "Búsqueda de pagos entrantes por criterios: el equipo operativo busca pagos por nombre del remitente, banco emisor, rango de monto o fecha, para dar seguimiento a transferencias específicas.",
  ],
  requirements: [
    "Tener una cuenta de desarrollador activa y acceso aprobado al producto.",
    "Contar con credenciales del ambiente Sandbox o Producción según la etapa de integración.",
    "Disponer de un backend seguro para gestionar el token de bloqueo con trazabilidad.",
  ],
  authentication: {
    title: "Credenciales de cliente y cabeceras seguras",
    description:
      "La integración requiere credenciales provistas por Davivienda y cabeceras de seguridad. Incluya API_ESTATUS_NITS con los NITs autorizados de su empresa, separados por coma; las consultas quedan limitadas a las cuentas asociadas a esos NITs.",
    headers: [
      "x-api-key: TU_API_KEY",
      "Content-Type: application/json",
      "API_ESTATUS_NITS: 038403410,038403411",
    ],
  },
  environments: ["Sandbox para pruebas funcionales", "Producción para operaciones autorizadas"],
  journeySteps: [
    "Solicite acceso y configure el header API_ESTATUS_NITS con los NITs autorizados de su empresa.",
    "Valide la búsqueda de pagos y el bloqueo de una transacción en Sandbox.",
    "Integre monitoreo y paso controlado a Producción.",
  ],
  endpoints: [
    {
      method: "POST",
      path: "/pagos/estatus/busqueda/",
      description:
        "Busca pagos interbancarios recibidos por remitente, banco emisor, rango de monto o fecha.",
      playground: {
        httpUrl: "https://api.davivienda.com/pagos/estatus/busqueda/",
        contentType: "application/json",
        credentialsLabel: "ApiKeyAuth",
        parameters: [
          {
            name: "nombreRemitente",
            type: "string",
            required: false,
            location: "body",
            description: "Nombre del remitente del pago",
          },
          {
            name: "bancoEmisor",
            type: "string",
            required: false,
            location: "body",
            description: "Banco emisor de la transferencia",
          },
          {
            name: "montoMinimo",
            type: "number",
            required: false,
            location: "body",
            description: "Monto mínimo del rango de búsqueda",
          },
          {
            name: "montoMaximo",
            type: "number",
            required: false,
            location: "body",
            description: "Monto máximo del rango de búsqueda",
          },
          {
            name: "fechaInicial",
            type: "string (YYYY-MM-DD)",
            required: false,
            location: "body",
            description: "Fecha inicial del rango de búsqueda",
          },
          {
            name: "fechaFinal",
            type: "string (YYYY-MM-DD)",
            required: false,
            location: "body",
            description: "Fecha final del rango de búsqueda",
          },
        ],
        requestBody: estatusPagosBusquedaRequest,
        responseStatus: "200 OK",
        responseBody: estatusPagosBusquedaResponse,
      },
    },
    {
      method: "POST",
      path: "/pagos/estatus/bloqueo/",
      description: "Bloquea un pago sospechoso antes de liquidarlo, usando el token de la transacción.",
      playground: {
        httpUrl: "https://api.davivienda.com/pagos/estatus/bloqueo/",
        contentType: "application/json",
        credentialsLabel: "ApiKeyAuth",
        parameters: [
          {
            name: "token",
            type: "string",
            required: true,
            location: "body",
            description: "Token de la transacción a bloquear",
          },
        ],
        requestBody: estatusPagosBloqueoRequest,
        responseStatus: "200 OK",
        responseBody: estatusPagosBloqueoResponse,
      },
    },
  ],
  sampleRequest: `curl -X POST https://api.davivienda.com/pagos/estatus/busqueda/ \\
  -H "x-api-key: TU_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "API_ESTATUS_NITS: 038403410,038403411" \\
  -d '{
    "nombreRemitente": "Empresa de Ejemplo S.A. de C.V.",
    "fechaInicial": "2025-01-01",
    "fechaFinal": "2025-01-09"
  }'`,
  sampleResponse: estatusPagosBusquedaResponse,
  errors: [
    {
      code: "400",
      title: "Solicitud inválida",
      description: "Faltan criterios de búsqueda, el token de bloqueo o el header API_ESTATUS_NITS no es válido.",
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
    "Si su caso de uso requiere validaciones adicionales, más NITs autorizados o volúmenes corporativos altos, nuestro equipo le acompaña en el proceso de habilitación.",
};

/** Fuente única del catálogo. */
export const apiDetails: ApiDetail[] = [tesoreria, estatusPagos];

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
