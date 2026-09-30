import { apiDetails } from "@/components/catalog/content/apis";
import { productMessageKeys } from "@/components/catalog/content/localize-api";
import type { ApiEndpoint, ApiError } from "@/components/catalog/content/types";
import enMessages from "@/messages/en.json";

const endpointKeys: Record<string, string> = {
  "/conciliacion/bancaempresa/movimientos/": "movimientos",
  "/pagos/estatus/busqueda/": "busqueda",
  "/pagos/estatus/bloqueo/": "bloqueo",
  "/pagos/pay/cobro/": "cobro",
  "/pagos/pay/reembolso/": "reembolso",
  "/cuentas/validacion/": "validacion",
};

type EnglishProduct = {
  quickFacts?: Record<string, { label: string; value: string }>;
  coverage?: { value?: string };
  endpoints?: Record<string, { description?: string; parameters?: Record<string, string> }>;
  errors?: Record<string, { title?: string; description?: string }>;
};

const englishProducts = enMessages.Catalog.products as Record<string, EnglishProduct>;

export type CatalogSamples = {
  coverage: { value: string; detail: string };
  quickFacts: Array<{ label: string; value: string }>;
  endpoints: ApiEndpoint[];
  errors: ApiError[];
};

const emptySamples: CatalogSamples = {
  coverage: { value: "", detail: "" },
  quickFacts: [],
  endpoints: [],
  errors: [],
};

function localizeEndpoint(endpoint: ApiEndpoint, copy: EnglishProduct | undefined): ApiEndpoint {
  const endpointCopy = copy?.endpoints?.[endpointKeys[endpoint.path] ?? endpoint.path];

  return {
    ...endpoint,
    description: endpointCopy?.description ?? endpoint.description,
    playground: {
      ...endpoint.playground,
      parameters: endpoint.playground.parameters.map((parameter) => ({
        ...parameter,
        description: endpointCopy?.parameters?.[parameter.name.replace(/\./g, "_")] ?? parameter.description,
      })),
    },
  };
}

export function catalogSamples(slug: string, locale: string): CatalogSamples {
  const source = apiDetails.find((api) => api.slug === slug);

  if (!source) {
    return emptySamples;
  }

  if (locale !== "en") {
    return {
      coverage: source.coverage,
      quickFacts: source.quickFacts,
      endpoints: source.endpoints,
      errors: source.errors,
    };
  }

  const copy = englishProducts[productMessageKeys[slug as keyof typeof productMessageKeys]];

  return {
    coverage: {
      value: copy?.coverage?.value ?? source.coverage.value,
      detail: source.coverage.detail,
    },
    quickFacts: source.quickFacts.map((fact, index) => copy?.quickFacts?.[String(index)] ?? fact),
    endpoints: source.endpoints.map((endpoint) => localizeEndpoint(endpoint, copy)),
    errors: source.errors.map((error) => ({
      ...error,
      title: copy?.errors?.[error.code]?.title ?? error.title,
      description: copy?.errors?.[error.code]?.description ?? error.description,
    })),
  };
}
