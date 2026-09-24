import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { apiCatalogItems } from "@/components/catalog/content/apis";
import { ContractingRequestPage } from "@/components/contracting/contracting-request-page";

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
  const matchedProduct = apiCatalogItems.find(
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
