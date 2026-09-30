"use client";

import { useLocale } from "next-intl";
import { createContext, useContext, useMemo, type ReactNode } from "react";

import { presentCatalogApi, type CatalogView } from "@/lib/catalog/present";
import type { CatalogApi, CatalogEndpoint } from "@/lib/catalog/queries";

export type CatalogRecord = {
  api: CatalogApi;
  endpoints: CatalogEndpoint[];
};

const CatalogContext = createContext<CatalogRecord[]>([]);

export function CatalogProvider({ records, children }: { records: CatalogRecord[]; children: ReactNode }) {
  return <CatalogContext.Provider value={records}>{children}</CatalogContext.Provider>;
}

export function useCatalogViews(): CatalogView[] {
  const records = useContext(CatalogContext);
  const locale = useLocale();

  return useMemo(
    () => records.map((record) => presentCatalogApi(record.api, locale, record.endpoints)),
    [records, locale],
  );
}

export function useCatalogView(slug: string) {
  return useCatalogViews().find((api) => api.slug === slug);
}
