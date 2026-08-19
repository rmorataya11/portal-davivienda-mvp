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

const sharedAuthentication: ApiDetail["authentication"] = {
  title: "Credenciales de cliente y cabeceras seguras",
  description:
    "La integración requiere credenciales provistas por Davivienda y el envío de cabeceras de seguridad para identificar la aplicación y rastrear cada operación.",
  headers: ["Authorization: Bearer <token>", "x-api-key: <client-id>", "x-correlation-id: <uuid>"],
};

const sharedRequirements = [
  "Tener una cuenta de desarrollador activa y acceso aprobado al producto.",
  "Contar con credenciales del ambiente Sandbox o Producción según la etapa de integración.",
  "Disponer de un backend seguro para gestionar tokens, trazabilidad y consumo de endpoints.",
];

const sharedErrors: ApiError[] = [
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
];

const tesoreria: ApiDetail = {
  slug: "api-tesoreria",
  name: "API Tesorería",
  description:
    "Optimice la liquidez corporativa y la toma de decisiones en tiempo real. Integre la posición consolidada de fondos de su empresa directamente con sus sistemas centrales.",
  category: "Cuentas",
  status: "Producción",
  heroSceneSrc: "/treasury-hero-illustration.svg",
  heroDescription:
    "Consulte saldos, movimientos y posiciones consolidadas para tomar decisiones de tesorería con más velocidad y trazabilidad.",
  intro:
    "Pensada para empresas que necesitan visibilidad financiera en tiempo casi real, esta API centraliza información clave para conciliar, proyectar caja y automatizar procesos de backoffice.",
  quickFacts: [
    { label: "Producto", value: "Tesorería" },
    { label: "Uso ideal", value: "B2B corporativo" },
    { label: "Cobertura", value: "Saldos + movimientos" },
    { label: "Valor", value: "Liquidez en tiempo real" },
  ],
  coverage: {
    value: "3 flujos",
    detail: "Saldos, movimientos y reportes corporativos.",
  },
  idealFor:
    "Equipos que necesitan liquidez visible, conciliación rápida y automatización en sus flujos internos.",
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
  requirements: sharedRequirements,
  authentication: sharedAuthentication,
  environments: ["Sandbox para pruebas funcionales", "Producción para operaciones autorizadas"],
  endpoints: [
    {
      method: "GET",
      path: "/treasury/v1/balances",
      description: "Consulta saldos consolidados y disponibles por cuenta.",
      playground: {
        httpUrl: "https://api.davivienda.com/treasury/v1/balances",
        contentType: "application/json",
        credentialsLabel: "ApiKeyAuth",
        parameters: [
          {
            name: "accountId",
            type: "string",
            required: true,
            location: "query",
            description: "Identificador de la cuenta empresarial a consultar.",
          },
          {
            name: "Authorization",
            type: "Bearer token",
            required: true,
            location: "header",
            description: "Token de acceso para autorizar el consumo.",
          },
        ],
        requestBody: `{
  "accountId": "987654321"
}`,
        responseStatus: "200 OK",
        responseBody: `{
  "accountId": "987654321",
  "currency": "USD",
  "availableBalance": 245000.45,
  "bookBalance": 251320.45,
  "updatedAt": "2026-08-16T18:10:00Z"
}`,
      },
    },
    {
      method: "GET",
      path: "/treasury/v1/movements",
      description: "Devuelve movimientos por rango de fechas y criterios de búsqueda.",
      playground: {
        httpUrl: "https://api.davivienda.com/treasury/v1/movements",
        contentType: "application/json",
        credentialsLabel: "ApiKeyAuth",
        parameters: [
          {
            name: "accountId",
            type: "string",
            required: true,
            location: "query",
            description: "Cuenta objetivo de la consulta.",
          },
          {
            name: "fromDate",
            type: "date",
            required: true,
            location: "query",
            description: "Fecha inicial del rango de búsqueda.",
          },
          {
            name: "toDate",
            type: "date",
            required: true,
            location: "query",
            description: "Fecha final del rango de búsqueda.",
          },
        ],
        requestBody: `{
  "accountId": "987654321",
  "fromDate": "2026-08-01",
  "toDate": "2026-08-16"
}`,
        responseStatus: "200 OK",
        responseBody: `{
  "accountId": "987654321",
  "movements": [
    {
      "date": "2026-08-16",
      "type": "credit",
      "amount": 12500.00,
      "reference": "ABONO-CORP-001"
    }
  ]
}`,
      },
    },
    {
      method: "POST",
      path: "/treasury/v1/reports",
      description: "Solicita reportes de tesorería para procesos de conciliación y auditoría.",
      playground: {
        httpUrl: "https://api.davivienda.com/treasury/v1/reports",
        contentType: "application/json",
        credentialsLabel: "ApiKeyAuth",
        parameters: [
          {
            name: "reportType",
            type: "string",
            required: true,
            location: "body",
            description: "Tipo de reporte corporativo que desea generar.",
          },
          {
            name: "accountIds",
            type: "string[]",
            required: true,
            location: "body",
            description: "Listado de cuentas incluidas en el reporte.",
          },
          {
            name: "dateRange",
            type: "object",
            required: true,
            location: "body",
            description: "Rango de fechas aplicado a la generación del reporte.",
          },
        ],
        requestBody: `{
  "reportType": "conciliation",
  "accountIds": ["987654321", "123456789"],
  "dateRange": {
    "from": "2026-08-01",
    "to": "2026-08-16"
  }
}`,
        responseStatus: "202 Accepted",
        responseBody: `{
  "reportId": "rpt-20260816-001",
  "status": "processing",
  "estimatedReadyAt": "2026-08-16T18:20:00Z"
}`,
      },
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
  errors: sharedErrors,
  supportNote:
    "Si su caso de uso requiere validaciones adicionales, cobertura por múltiples cuentas o volúmenes corporativos altos, nuestro equipo le acompaña en el proceso de habilitación.",
};

const payDavivienda: ApiDetail = {
  slug: "api-pay-davivienda",
  name: "API Pay Davivienda",
  description:
    "Incorpore nuestra robusta pasarela de pagos en su e-commerce o aplicación. Procese cobros con tarjetas de crédito y débito de forma segura y con los más altos estándares de conversión.",
  category: "Pagos",
  status: "Producción",
  heroDescription:
    "Procese cobros con tarjetas de crédito y débito desde su checkout, con autorización, consulta de estado y reembolsos.",
  intro:
    "Pensada para comercios y plataformas que necesitan una pasarela de pagos segura, esta API cubre el cobro, la consulta de transacciones y la devolución sin salir de su flujo de venta.",
  quickFacts: [
    { label: "Producto", value: "Pay Davivienda" },
    { label: "Uso ideal", value: "E-commerce y apps" },
    { label: "Cobertura", value: "Cobros + reembolsos" },
    { label: "Valor", value: "Checkout seguro" },
  ],
  coverage: {
    value: "3 flujos",
    detail: "Cobros, consulta de transacción y reembolsos.",
  },
  idealFor: "Equipos de e-commerce o apps que necesitan cobrar con tarjetas y conciliar cada transacción.",
  benefits: [
    "Incorpore cobros con tarjetas de crédito y débito en su checkout.",
    "Consulte el estado de cada transacción para conciliar ventas y soporte.",
    "Gestione reembolsos sin procesos manuales fuera de su plataforma.",
  ],
  useCases: [
    "Pago de una compra en e-commerce o aplicación móvil.",
    "Consulta de una transacción para confirmar el estado del cobro.",
    "Devolución total o parcial ante cancelaciones o ajustes.",
  ],
  requirements: sharedRequirements,
  authentication: sharedAuthentication,
  environments: ["Sandbox para pruebas funcionales", "Producción para operaciones autorizadas"],
  endpoints: [
    {
      method: "POST",
      path: "/payments/v1/charges",
      description: "Autoriza y procesa un cobro con tarjeta de crédito o débito.",
      playground: {
        httpUrl: "https://api.davivienda.com/payments/v1/charges",
        contentType: "application/json",
        credentialsLabel: "ApiKeyAuth",
        parameters: [
          {
            name: "amount",
            type: "number",
            required: true,
            location: "body",
            description: "Monto a cobrar, en la moneda de la transacción.",
          },
          {
            name: "currency",
            type: "string",
            required: true,
            location: "body",
            description: "Código de moneda, por ejemplo USD o COP.",
          },
          {
            name: "paymentMethod",
            type: "object",
            required: true,
            location: "body",
            description: "Medio de pago y datos tokenizados de la tarjeta.",
          },
        ],
        requestBody: `{
  "amount": 125.50,
  "currency": "USD",
  "orderId": "ORD-100245",
  "paymentMethod": {
    "type": "card",
    "token": "tok_sandbox_4f9c2a"
  }
}`,
        responseStatus: "201 Created",
        responseBody: `{
  "chargeId": "chg_8f21c0",
  "status": "approved",
  "amount": 125.50,
  "currency": "USD",
  "orderId": "ORD-100245"
}`,
      },
    },
    {
      method: "GET",
      path: "/payments/v1/charges/{chargeId}",
      description: "Consulta el estado y el detalle de un cobro previamente creado.",
      playground: {
        httpUrl: "https://api.davivienda.com/payments/v1/charges/{chargeId}",
        contentType: "application/json",
        credentialsLabel: "ApiKeyAuth",
        parameters: [
          {
            name: "chargeId",
            type: "string",
            required: true,
            location: "query",
            description: "Identificador del cobro a consultar.",
          },
        ],
        requestBody: `{
  "chargeId": "chg_8f21c0"
}`,
        responseStatus: "200 OK",
        responseBody: `{
  "chargeId": "chg_8f21c0",
  "status": "approved",
  "amount": 125.50,
  "currency": "USD",
  "updatedAt": "2026-08-16T18:12:00Z"
}`,
      },
    },
    {
      method: "POST",
      path: "/payments/v1/refunds",
      description: "Solicita un reembolso total o parcial sobre un cobro aprobado.",
      playground: {
        httpUrl: "https://api.davivienda.com/payments/v1/refunds",
        contentType: "application/json",
        credentialsLabel: "ApiKeyAuth",
        parameters: [
          {
            name: "chargeId",
            type: "string",
            required: true,
            location: "body",
            description: "Cobro original al que se aplica la devolución.",
          },
          {
            name: "amount",
            type: "number",
            required: true,
            location: "body",
            description: "Monto a reembolsar. Puede ser igual o menor al cobro.",
          },
        ],
        requestBody: `{
  "chargeId": "chg_8f21c0",
  "amount": 125.50,
  "reason": "customer_request"
}`,
        responseStatus: "202 Accepted",
        responseBody: `{
  "refundId": "rfd_3aa91b",
  "chargeId": "chg_8f21c0",
  "status": "processing",
  "amount": 125.50
}`,
      },
    },
  ],
  sampleRequest: `curl --request POST \\
  --url https://api.davivienda.com/payments/v1/charges \\
  --header 'Authorization: Bearer <token>' \\
  --header 'x-api-key: <client-id>' \\
  --header 'x-correlation-id: 45ef2c7a-01f4-4f35-b7f5-8f81d2c0e9be' \\
  --header 'Content-Type: application/json' \\
  --data '{"amount":125.50,"currency":"USD","orderId":"ORD-100245"}'`,
  sampleResponse: `{
  "chargeId": "chg_8f21c0",
  "status": "approved",
  "amount": 125.50,
  "currency": "USD",
  "orderId": "ORD-100245"
}`,
  errors: sharedErrors,
  supportNote:
    "Si su checkout requiere 3DS, múltiples monedas o conciliación masiva, nuestro equipo le acompaña en el proceso de habilitación.",
};

const validacionCuenta: ApiDetail = {
  slug: "api-validacion-cuenta",
  name: "API Validación de Cuenta",
  description:
    "Mitigue el riesgo de fraude y rechazos verificando al instante la titularidad y el estado activo de las cuentas bancarias antes de originar cualquier transacción o contrato.",
  category: "Cuentas",
  status: "Producción",
  heroDescription:
    "Verifique titularidad y estado de una cuenta bancaria antes de dispersar, contratar o registrar un beneficiario.",
  intro:
    "Pensada para operaciones que no pueden fallar por una cuenta inválida o un titular incorrecto, esta API confirma datos clave antes de mover dinero o firmar un acuerdo.",
  quickFacts: [
    { label: "Producto", value: "Validación de cuenta" },
    { label: "Uso ideal", value: "Onboarding y pagos" },
    { label: "Cobertura", value: "Titularidad + estado" },
    { label: "Valor", value: "Menos fraude y rechazos" },
  ],
  coverage: {
    value: "2 flujos",
    detail: "Validación de cuenta y consulta del resultado.",
  },
  idealFor: "Equipos de pagos, onboarding o cumplimiento que necesitan confirmar una cuenta antes de operar.",
  benefits: [
    "Confirme titularidad y estado activo antes de originar una transacción.",
    "Reduzca rechazos, devoluciones y riesgo de fraude en el alta de beneficiarios.",
    "Integre la validación en sus flujos de registro, contratos o dispersión.",
  ],
  useCases: [
    "Validar una cuenta destino antes de una dispersión o transferencia.",
    "Confirmar titularidad en el onboarding de un proveedor o cliente.",
    "Consultar el resultado de una validación previa para auditoría.",
  ],
  requirements: sharedRequirements,
  authentication: sharedAuthentication,
  environments: ["Sandbox para pruebas funcionales", "Producción para operaciones autorizadas"],
  endpoints: [
    {
      method: "POST",
      path: "/accounts/v1/validate",
      description: "Verifica titularidad y estado de una cuenta bancaria en tiempo real.",
      playground: {
        httpUrl: "https://api.davivienda.com/accounts/v1/validate",
        contentType: "application/json",
        credentialsLabel: "ApiKeyAuth",
        parameters: [
          {
            name: "accountNumber",
            type: "string",
            required: true,
            location: "body",
            description: "Número de cuenta a validar.",
          },
          {
            name: "documentNumber",
            type: "string",
            required: true,
            location: "body",
            description: "Documento de identidad del titular esperado.",
          },
          {
            name: "bankCode",
            type: "string",
            required: true,
            location: "body",
            description: "Código del banco dueño de la cuenta.",
          },
        ],
        requestBody: `{
  "accountNumber": "0123456789",
  "accountType": "savings",
  "bankCode": "012",
  "documentType": "CC",
  "documentNumber": "1020304050"
}`,
        responseStatus: "200 OK",
        responseBody: `{
  "validationId": "val_91c4e2",
  "match": true,
  "accountStatus": "active",
  "holderName": "EMPRESA DE PRUEBA S.A.S."
}`,
      },
    },
    {
      method: "GET",
      path: "/accounts/v1/validate/{validationId}",
      description: "Consulta el resultado de una validación previamente ejecutada.",
      playground: {
        httpUrl: "https://api.davivienda.com/accounts/v1/validate/{validationId}",
        contentType: "application/json",
        credentialsLabel: "ApiKeyAuth",
        parameters: [
          {
            name: "validationId",
            type: "string",
            required: true,
            location: "query",
            description: "Identificador de la validación a consultar.",
          },
        ],
        requestBody: `{
  "validationId": "val_91c4e2"
}`,
        responseStatus: "200 OK",
        responseBody: `{
  "validationId": "val_91c4e2",
  "match": true,
  "accountStatus": "active",
  "createdAt": "2026-08-16T18:08:00Z"
}`,
      },
    },
  ],
  sampleRequest: `curl --request POST \\
  --url https://api.davivienda.com/accounts/v1/validate \\
  --header 'Authorization: Bearer <token>' \\
  --header 'x-api-key: <client-id>' \\
  --header 'x-correlation-id: 45ef2c7a-01f4-4f35-b7f5-8f81d2c0e9be' \\
  --header 'Content-Type: application/json' \\
  --data '{"accountNumber":"0123456789","bankCode":"012","documentNumber":"1020304050"}'`,
  sampleResponse: `{
  "validationId": "val_91c4e2",
  "match": true,
  "accountStatus": "active",
  "holderName": "EMPRESA DE PRUEBA S.A.S."
}`,
  errors: sharedErrors,
  supportNote:
    "Si necesita validación masiva, otros tipos de cuenta o reglas de coincidencia más estrictas, nuestro equipo le acompaña en el proceso de habilitación.",
};

/** Fuente única del catálogo. Para agregar una API, copie un objeto y súmalo a este arreglo. */
export const apiDetails: ApiDetail[] = [tesoreria, payDavivienda, validacionCuenta];

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
