import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { ContractingRequestPage } from "@/components/contracting/contracting-request-page";
import { presentCatalogApi } from "@/lib/catalog/present";
import { getCatalogApis } from "@/lib/catalog/queries";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Contratacion.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SolicitudContratacionRoute({
  searchParams,
}: {
  searchParams: Promise<{ producto?: string | string[]; app?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedProduct = Array.isArray(params.producto) ? params.producto[0] : params.producto;
  const requestedApp = Array.isArray(params.app) ? params.app[0] : params.app;
  const locale = await getLocale();
  const products = (await getCatalogApis()).map((api) => presentCatalogApi(api, locale));
  const matchedProduct = products.find(
    (item) => item.name === requestedProduct || item.slug === requestedProduct,
  );

  return (
    <ContractingRequestPage
      productName={matchedProduct?.name ?? ""}
      productSlug={matchedProduct?.slug ?? ""}
      appId={requestedApp ?? ""}
    />
  );
}
