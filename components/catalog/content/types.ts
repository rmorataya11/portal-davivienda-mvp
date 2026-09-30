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
