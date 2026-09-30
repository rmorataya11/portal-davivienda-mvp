import { toDocsEndpoint, type CodeSampleMethod, type CodeSampleSource, type GeneratedDocsEndpoint } from "@/lib/catalog/generate-code-samples";
import type { CatalogEndpoint } from "@/lib/catalog/queries";

export type DocsHttpMethod = CodeSampleMethod;
export type DocsEndpoint = GeneratedDocsEndpoint;

export type DocsApi = {
  apiId: string;
  apiName: string;
  endpoints: DocsEndpoint[];
};

const CONTENT_TYPE = "application/json";

function asMethod(value: string): CodeSampleMethod {
  if (value === "GET" || value === "POST" || value === "PUT" || value === "DELETE") {
    return value;
  }

  throw new Error(`Método HTTP no soportado: ${value}`);
}

export function toCodeSampleSource(endpoint: CatalogEndpoint, locale: string): CodeSampleSource {
  const content = locale === "en" ? endpoint.contentEn : endpoint.contentEs;

  return {
    method: asMethod(endpoint.method),
    path: endpoint.path,
    httpUrl: endpoint.httpUrl,
    contentType: CONTENT_TYPE,
    description: content.description,
    requestBody: content.requestBody,
    responseStatus: content.responseStatus,
    responseBody: content.responseBody,
    parameters: content.parameters,
    errors: content.errors,
  };
}

export function localizeDocsEndpoint(endpoint: CatalogEndpoint, locale: string, apiId: string): DocsEndpoint {
  return toDocsEndpoint(apiId, toCodeSampleSource(endpoint, locale));
}

export function findLocalizedDocsEndpoint(apis: DocsApi[], endpointId: string) {
  for (const api of apis) {
    const endpoint = api.endpoints.find((item) => item.id === endpointId);
    if (endpoint) {
      return { api, endpoint };
    }
  }

  return undefined;
}
