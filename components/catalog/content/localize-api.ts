import type { ApiCatalogItem, ApiDetail, ApiEndpoint } from "./apis";

export const productMessageKeys = {
  "api-tesoreria": "tesoreria",
} as const;

export const categoryMessageKeys = {
  Cuentas: "accounts",
} as const;

export const statusMessageKeys = {
  Producción: "production",
} as const;

const parameterTypeKeys = {
  "array de objetos": "objectArray",
} as const;

const endpointMessageKeys: Record<string, string> = {
  "/conciliacion/bancaempresa/movimientos/": "movimientos",
};

export type CatalogTranslate = (key: string) => string;

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
    name: t(`products.${productKey}.name`),
    description: t(`products.${productKey}.description`),
    category: t(`categories.${getCategoryMessageKey(item.category)}`),
    status: t(`status.${getStatusMessageKey(item.status)}`) as ApiCatalogItem["status"],
  };
}

export function localizeApiDetail(api: ApiDetail, t: CatalogTranslate): ApiDetail {
  const productKey = getProductMessageKey(api.slug);
  const item = localizeCatalogItem(api, t);

  return {
    ...api,
    ...item,
    heroDescription: t(`products.${productKey}.heroDescription`),
    intro: t(`products.${productKey}.intro`),
    quickFacts: api.quickFacts.map((fact, index) => ({
      label: t(`products.${productKey}.quickFacts.${index}.label`),
      value: t(`products.${productKey}.quickFacts.${index}.value`),
    })),
    coverage: {
      value: t(`products.${productKey}.coverage.value`),
      detail: api.coverage.detail,
    },
    idealFor: t(`products.${productKey}.idealFor`),
    benefits: api.benefits.map((_, index) => t(`products.${productKey}.benefits.${index}`)),
    useCases: api.useCases.map((_, index) => t(`products.${productKey}.useCases.${index}`)),
    requirements: api.requirements.map((_, index) => t(`products.${productKey}.requirements.${index}`)),
    authentication: {
      ...api.authentication,
      title: t(`products.${productKey}.authentication.title`),
      description: t(`products.${productKey}.authentication.description`),
    },
    environments: api.environments.map((_, index) => t(`products.${productKey}.environments.${index}`)),
    endpoints: api.endpoints.map((endpoint) => localizeEndpoint(endpoint, productKey, t)),
    errors: api.errors.map((error) => ({
      ...error,
      title: t(`products.${productKey}.errors.${error.code}.title`),
      description: t(`products.${productKey}.errors.${error.code}.description`),
    })),
    supportNote: t(`products.${productKey}.supportNote`),
  };
}

function localizeEndpoint(endpoint: ApiEndpoint, productKey: string, t: CatalogTranslate): ApiEndpoint {
  const endpointKey = endpointMessageKeys[endpoint.path] ?? endpoint.path;

  return {
    ...endpoint,
    description: t(`products.${productKey}.endpoints.${endpointKey}.description`),
    playground: {
      ...endpoint.playground,
      parameters: endpoint.playground.parameters.map((parameter) => ({
        ...parameter,
        type: localizeParameterType(parameter.type, t),
        description: t(
          `products.${productKey}.endpoints.${endpointKey}.parameters.${parameter.name.replace(/\./g, "_")}`,
        ),
      })),
    },
  };
}

function localizeParameterType(type: string, t: CatalogTranslate) {
  return type in parameterTypeKeys ? t(`types.${parameterTypeKeys[type as keyof typeof parameterTypeKeys]}`) : type;
}
