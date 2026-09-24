import { apiCatalogItems } from "@/components/catalog/content/apis";
import { localizeCatalogItem, type CatalogTranslate } from "@/components/catalog/content/localize-api";
import type { DocsApi, DocsEndpoint, DocsParameter } from "@/lib/mock/mockDocs";

export type DocsTranslate = (key: string) => string;

const parameterTypeKeys = {
  "array de objetos": "objectArray",
} as const;

function toContentKey(endpointId: string) {
  return endpointId.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function toParameterKey(name: string) {
  return name.replace(/\./g, "_");
}

function localizeParameterType(type: string, catalogT: CatalogTranslate) {
  return type in parameterTypeKeys ? catalogT(`types.${parameterTypeKeys[type as keyof typeof parameterTypeKeys]}`) : type;
}

function localizeParameter(parameter: DocsParameter, endpointKey: string, docsT: DocsTranslate, catalogT: CatalogTranslate): DocsParameter {
  return {
    ...parameter,
    type: localizeParameterType(parameter.type, catalogT),
    description: docsT(`contenido.${endpointKey}.parametros.${toParameterKey(parameter.name)}.descripcion`),
  };
}

function localizeEndpoint(endpoint: DocsEndpoint, docsT: DocsTranslate, catalogT: CatalogTranslate): DocsEndpoint {
  const endpointKey = toContentKey(endpoint.id);

  return {
    ...endpoint,
    description: docsT(`contenido.${endpointKey}.descripcion`),
    parameters: endpoint.parameters.map((parameter) => localizeParameter(parameter, endpointKey, docsT, catalogT)),
  };
}

export function localizeDocsApi(api: DocsApi, docsT: DocsTranslate, catalogT: CatalogTranslate): DocsApi {
  const catalogItem = apiCatalogItems.find((item) => item.slug === api.apiId);

  return {
    ...api,
    apiName: catalogItem ? localizeCatalogItem(catalogItem, catalogT).name : api.apiName,
    endpoints: api.endpoints.map((endpoint) => localizeEndpoint(endpoint, docsT, catalogT)),
  };
}

export function localizeDocsApis(apis: DocsApi[], docsT: DocsTranslate, catalogT: CatalogTranslate) {
  return apis.map((api) => localizeDocsApi(api, docsT, catalogT));
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
