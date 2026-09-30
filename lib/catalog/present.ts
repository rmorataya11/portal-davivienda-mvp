import type { ApiEndpoint, ApiError } from '@/components/catalog/content/types';
import type { CatalogApi, CatalogEndpoint } from '@/lib/catalog/queries';

export type CatalogView = {
  slug: string;
  name: string;
  description: string;
  subtitle: string;
  category: string;
  status: string;
  icon: string;
  valor: string[];
  casosDeUso: string[];
  authentication: {
    title: string;
    description: string;
    headers: string[];
  };
  requirements: string[];
  journeySteps: string[];
  environments: string[];
  coverage: { value: string; detail: string };
  quickFacts: Array<{ label: string; value: string }>;
  endpoints: ApiEndpoint[];
  errors: ApiError[];
};

const sharedCopy = {
  es: {
    authenticationTitle: 'Credenciales de cliente y cabeceras seguras',
    environments: ['Sandbox para pruebas funcionales', 'Producción para operaciones autorizadas'],
  },
  en: {
    authenticationTitle: 'Client credentials and secure headers',
    environments: ['Sandbox for functional testing', 'Production for authorized operations'],
  },
} as const;

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'] as const;

function asMethod(value: string): ApiEndpoint['method'] {
  if ((httpMethods as readonly string[]).includes(value)) {
    return value as ApiEndpoint['method'];
  }

  throw new Error(`Método HTTP no soportado: ${value}`);
}

export function presentCatalogEndpoint(endpoint: CatalogEndpoint, locale: string): ApiEndpoint {
  const content = locale === 'en' ? endpoint.contentEn : endpoint.contentEs;

  return {
    method: asMethod(endpoint.method),
    path: endpoint.path,
    httpUrl: endpoint.httpUrl,
    description: content.description,
    contentType: 'application/json',
    credentialsLabel: content.credentialsLabel,
    parameters: content.parameters,
    requestBody: content.requestBody,
    responseStatus: content.responseStatus,
    responseBody: content.responseBody,
  };
}

function presentErrors(endpoints: CatalogEndpoint[], locale: string): ApiError[] {
  const seen = new Set<string>();
  const errors: ApiError[] = [];

  for (const endpoint of endpoints) {
    const content = locale === 'en' ? endpoint.contentEn : endpoint.contentEs;

    for (const error of content.errors) {
      if (seen.has(error.code)) {
        continue;
      }

      seen.add(error.code);
      errors.push(error);
    }
  }

  return errors;
}

export function presentCatalogApi(api: CatalogApi, locale: string, endpoints: CatalogEndpoint[]): CatalogView {
  const language = locale === 'en' ? 'en' : 'es';
  const content = language === 'en' ? api.contentEn : api.contentEs;
  const shared = sharedCopy[language];

  return {
    slug: api.slug,
    name: content.title,
    description: content.description,
    subtitle: content.subtitle,
    category: api.category,
    status: api.status,
    icon: api.icon,
    valor: content.valor,
    casosDeUso: content.casosDeUso,
    authentication: {
      title: shared.authenticationTitle,
      description: content.authentication.mechanism,
      headers: content.authentication.headers,
    },
    requirements: content.requirements,
    journeySteps: content.journeySteps,
    environments: [...shared.environments],
    coverage: content.coverage,
    quickFacts: content.quickFacts,
    endpoints: endpoints.map((endpoint) => presentCatalogEndpoint(endpoint, language)),
    errors: presentErrors(endpoints, language),
  };
}
