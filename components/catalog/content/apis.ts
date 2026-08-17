export type ApiCatalogItem = {
  slug?: string;
  name: string;
  description: string;
  category: string;
  status: "Producción";
};

export type ApiDetailSection = {
  title: string;
  items: string[];
};

export type ApiEndpoint = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
};

export type ApiError = {
  code: string;
  title: string;
  description: string;
};

export type ApiDetail = ApiCatalogItem & {
  slug: string;
  heroDescription: string;
  intro: string;
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

export const apiCategories = ["Todas", "Pagos", "Cuentas", "Autenticación", "Tarjetas", "Identidad"];

export const apiCatalogItems: ApiCatalogItem[] = [
  {
    slug: "api-tesoreria",
    name: "API Tesorería",
    description:
      "Optimice la liquidez corporativa y la toma de decisiones en tiempo real. Integre la posición consolidada de fondos de su empresa directamente con sus sistemas centrales.",
    category: "Cuentas",
    status: "Producción",
  },
  {
    name: "API Dispersión de Fondos",
    description:
      "Automatice el pago masivo a proveedores y nóminas en segundos. Garantice operaciones directas con validación previa y comprobante instantáneo para maximizar su eficiencia operativa.",
    category: "Pagos",
    status: "Producción",
  },
  {
    name: "API Notificación de Pago",
    description:
      "Reciba alertas automáticas e instantáneas en su sistema cada vez que un cliente realice un abono. Acelere la conciliación y cierre ventas al momento con verificación manual.",
    category: "Eventos",
    status: "Producción",
  },
  {
    name: "API Daviplata as a Service",
    description:
      "Integre el ecosistema de la billetera digital líder de El Salvador en su propia plataforma. Facilite el onboarding, enrolamiento y transferencias ágiles, impulsando la inclusión financiera.",
    category: "Cuentas",
    status: "Producción",
  },
  {
    name: "API Información de Cuenta",
    description:
      "Acceda al historial detallado de movimientos y saldos bancarios bajo el estricto consentimiento del titular. Obtenga data valiosa para potenciar sus análisis financieros.",
    category: "Cuentas",
    status: "Producción",
  },
  {
    name: "API Validación de Cuenta",
    description:
      "Mitigue el riesgo de fraude y rechazos verificando al instante la titularidad y el estado activo de las cuentas bancarias antes de originar cualquier transacción o contrato.",
    category: "Cuentas",
    status: "Producción",
  },
  {
    name: "API Pay Davivienda",
    description:
      "Incorpore nuestra robusta pasarela de pagos en su e-commerce o aplicación. Procese cobros con tarjetas de crédito y débito de forma segura y con los más altos estándares de conversión.",
    category: "Pagos / Tarjetas",
    status: "Producción",
  },
];

export const apiDetails: ApiDetail[] = [
  {
    slug: "api-tesoreria",
    name: "API Tesorería",
    description:
      "Optimice la liquidez corporativa y la toma de decisiones en tiempo real. Integre la posición consolidada de fondos de su empresa directamente con sus sistemas centrales.",
    category: "Cuentas",
    status: "Producción",
    heroDescription:
      "Consulte saldos, movimientos y posiciones consolidadas para tomar decisiones de tesorería con más velocidad y trazabilidad.",
    intro:
      "Pensada para empresas que necesitan visibilidad financiera en tiempo casi real, esta API centraliza información clave para conciliar, proyectar caja y automatizar procesos de backoffice.",
    benefits: [
      "Obtenga una vista consolidada de fondos para sus cuentas empresariales.",
      "Automatice conciliaciones y reduzca pasos manuales en sus procesos internos.",
      "Integre información de tesorería en ERPs, dashboards y flujos operativos.",
    ],
    useCases: [
      "Consulta de saldos disponibles para tesorería diaria.",
      "Monitoreo de movimientos para conciliación automática.",
      "Generación de tableros ejecutivos y alertas de liquidez.",
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
      headers: ["Authorization: Bearer <token>", "x-api-key: <client-id>", "x-correlation-id: <uuid>"],
    },
    environments: ["Sandbox para pruebas funcionales", "Producción para operaciones autorizadas"],
    endpoints: [
      {
        method: "GET",
        path: "/treasury/v1/balances",
        description: "Consulta saldos consolidados y disponibles por cuenta.",
      },
      {
        method: "GET",
        path: "/treasury/v1/movements",
        description: "Devuelve movimientos por rango de fechas y criterios de búsqueda.",
      },
      {
        method: "POST",
        path: "/treasury/v1/reports",
        description: "Solicita reportes de tesorería para procesos de conciliación y auditoría.",
      },
    ],
    sampleRequest: `curl --request GET \\
  --url https://api.davivienda.com/treasury/v1/balances?accountId=987654321 \\
  --header 'Authorization: Bearer <token>' \\
  --header 'x-api-key: <client-id>' \\
  --header 'x-correlation-id: 45ef2c7a-01f4-4f35-b7f5-8f81d2c0e9be'`,
    sampleResponse: `{
  "accountId": "987654321",
  "currency": "USD",
  "availableBalance": 245000.45,
  "bookBalance": 251320.45,
  "updatedAt": "2026-08-16T18:10:00Z"
}`,
    errors: [
      {
        code: "400",
        title: "Solicitud inválida",
        description: "Faltan parámetros requeridos o el formato enviado no es válido.",
      },
      {
        code: "401",
        title: "No autorizado",
        description: "Las credenciales son inválidas, expiraron o no corresponden al ambiente actual.",
      },
      {
        code: "429",
        title: "Límite excedido",
        description: "La aplicación superó la cantidad de solicitudes permitidas en el intervalo configurado.",
      },
      {
        code: "500",
        title: "Error interno",
        description: "Ocurrió una incidencia temporal al procesar la consulta y debe reintentarse.",
      },
    ],
    supportNote:
      "Si su caso de uso requiere validaciones adicionales, cobertura por múltiples cuentas o volúmenes corporativos altos, nuestro equipo le acompaña en el proceso de habilitación.",
  },
];

export function getApiDetailBySlug(slug: string) {
  return apiDetails.find((api) => api.slug === slug);
}
