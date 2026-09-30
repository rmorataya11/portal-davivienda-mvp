"use client";

import { useLocale } from "next-intl";
import { createContext, useContext, useMemo, type ReactNode } from "react";

import { presentCatalogApi, type CatalogView } from "@/lib/catalog/present";
import type { CatalogApi } from "@/lib/catalog/queries";

const CatalogContext = createContext<CatalogApi[]>([]);

export function CatalogProvider({ apis, children }: { apis: CatalogApi[]; children: ReactNode }) {
  return <CatalogContext.Provider value={apis}>{children}</CatalogContext.Provider>;
}

export function useCatalogViews() {
  const apis = useContext(CatalogContext);
  const locale = useLocale();

  return useMemo(() => apis.map((api) => presentCatalogApi(api, locale)), [apis, locale]);
}

export function useCatalogView(slug: string) {
  return useCatalogViews().find((api) => api.slug === slug);
}
