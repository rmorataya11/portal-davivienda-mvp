import { catalogSamples } from '@/lib/catalog/samples';
import type { CatalogApi } from '@/lib/catalog/queries';
import type { ApiEndpoint, ApiError } from '@/components/catalog/content/types';

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

export function presentCatalogApi(api: CatalogApi, locale: string): CatalogView {
  const language = locale === 'en' ? 'en' : 'es';
  const content = language === 'en' ? api.contentEn : api.contentEs;
  const shared = sharedCopy[language];
  const samples = catalogSamples(api.slug, language);

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
    coverage: samples.coverage,
    quickFacts: samples.quickFacts,
    endpoints: samples.endpoints,
    errors: samples.errors,
  };
}
