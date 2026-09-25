import type { ApiCatalogItem, ApiDetail, ApiEndpoint } from "./apis";

export const productMessageKeys = {
  "api-tesoreria": "tesoreria",
  "api-estatus-pagos": "estatusPagos",
  "api-pay-davivienda": "payDavivienda",
  "api-validacion-cuenta": "validacionCuenta",
} as const;

export const categoryMessageKeys = {
  Cuentas: "accounts",
  Pagos: "payments",
  "Pagos / Tarjetas": "paymentsCards",
} as const;

export const statusMessageKeys = {
  Producción: "production",
} as const;

const parameterTypeKeys = {
  "array de objetos": "objectArray",
} as const;

const endpointMessageKeys: Record<string, string> = {
  "/conciliacion/bancaempresa/movimientos/": "movimientos",
  "/pagos/estatus/busqueda/": "busqueda",
  "/pagos/estatus/bloqueo/": "bloqueo",
  "/pagos/pay/cobro/": "cobro",
  "/pagos/pay/reembolso/": "reembolso",
  "/cuentas/validacion/": "validacion",
};

export type CatalogTranslate = ((key: string) => string) & {
  has?: (key: string) => boolean;
};

function catalogMessage(t: CatalogTranslate, key: string, fallback: string) {
  if (t.has && !t.has(key)) {
    return fallback;
  }

  try {
    return t(key);
  } catch {
    return fallback;
  }
}

export function getProductMessageKey(slug: string) {
  return slug in productMessageKeys ? productMessageKeys[slug as keyof typeof productMessageKeys] : slug;
}

export function getCategoryMessageKey(category: string) {
  return category in categoryMessageKeys
    ? categoryMessageKeys[category as keyof typeof categoryMessageKeys]
    : category;
}

export function getStatusMessageKey(status: string) {
  return status in statusMessageKeys ? statusMessageKeys[status as keyof typeof statusMessageKeys] : status;
}

export function getCatalogFilterKeys(categories: string[]) {
  return ["all", ...Array.from(new Set(categories.map(getCategoryMessageKey)))];
}

export function localizeCatalogItem(item: ApiCatalogItem, t: CatalogTranslate): ApiCatalogItem {
  const productKey = getProductMessageKey(item.slug);

  return {
    ...item,
    name: catalogMessage(t, `products.${productKey}.name`, item.name),
    description: catalogMessage(t, `products.${productKey}.description`, item.description),
    category: catalogMessage(t, `categories.${getCategoryMessageKey(item.category)}`, item.category),
    status: catalogMessage(t, `status.${getStatusMessageKey(item.status)}`, item.status) as ApiCatalogItem["status"],
  };
}

export function localizeApiDetail(api: ApiDetail, t: CatalogTranslate): ApiDetail {
  const productKey = getProductMessageKey(api.slug);
  const item = localizeCatalogItem(api, t);

  return {
    ...api,
    ...item,
    heroDescription: catalogMessage(t, `products.${productKey}.heroDescription`, api.heroDescription),
    intro: catalogMessage(t, `products.${productKey}.intro`, api.intro),
    quickFacts: api.quickFacts.map((fact, index) => ({
      label: catalogMessage(t, `products.${productKey}.quickFacts.${index}.label`, fact.label),
      value: catalogMessage(t, `products.${productKey}.quickFacts.${index}.value`, fact.value),
    })),
    coverage: {
      value: catalogMessage(t, `products.${productKey}.coverage.value`, api.coverage.value),
      detail: api.coverage.detail,
    },
    idealFor: catalogMessage(t, `products.${productKey}.idealFor`, api.idealFor),
    benefits: api.benefits.map((benefit, index) => catalogMessage(t, `products.${productKey}.benefits.${index}`, benefit)),
    useCases: api.useCases.map((useCase, index) => catalogMessage(t, `products.${productKey}.useCases.${index}`, useCase)),
    requirements: api.requirements.map((requirement, index) =>
      catalogMessage(t, `products.${productKey}.requirements.${index}`, requirement),
    ),
    authentication: {
      ...api.authentication,
      title: catalogMessage(t, `products.${productKey}.authentication.title`, api.authentication.title),
      description: catalogMessage(t, `products.${productKey}.authentication.description`, api.authentication.description),
    },
    environments: api.environments.map((environment, index) =>
      catalogMessage(t, `products.${productKey}.environments.${index}`, environment),
    ),
    journeySteps: (api.journeySteps ?? []).map((step, index) =>
      catalogMessage(t, `products.${productKey}.journeySteps.${index}`, step),
    ),
    endpoints: api.endpoints.map((endpoint) => localizeEndpoint(endpoint, productKey, t)),
    errors: api.errors.map((error) => ({
      ...error,
      title: catalogMessage(t, `products.${productKey}.errors.${error.code}.title`, error.title),
      description: catalogMessage(t, `products.${productKey}.errors.${error.code}.description`, error.description),
    })),
    supportNote: catalogMessage(t, `products.${productKey}.supportNote`, api.supportNote),
  };
}

function localizeEndpoint(endpoint: ApiEndpoint, productKey: string, t: CatalogTranslate): ApiEndpoint {
  const endpointKey = endpointMessageKeys[endpoint.path] ?? endpoint.path;

  return {
    ...endpoint,
    description: catalogMessage(
      t,
      `products.${productKey}.endpoints.${endpointKey}.description`,
      endpoint.description,
    ),
    playground: {
      ...endpoint.playground,
      parameters: endpoint.playground.parameters.map((parameter) => ({
        ...parameter,
        type: localizeParameterType(parameter.type, t),
        description: catalogMessage(
          t,
          `products.${productKey}.endpoints.${endpointKey}.parameters.${parameter.name.replace(/\./g, "_")}`,
          parameter.description,
        ),
      })),
    },
  };
}

function localizeParameterType(type: string, t: CatalogTranslate) {
  const typeKey = parameterTypeKeys[type as keyof typeof parameterTypeKeys];
  return typeKey ? catalogMessage(t, `types.${typeKey}`, type) : type;
}
