import type { Metadata } from "next";

import { apiCatalogItems } from "@/components/catalog/content/apis";
import { ContractingRequestPage } from "@/components/contracting/contracting-request-page";

export const metadata: Metadata = {
  title: "Solicitud de contratación | Davivienda API Marketplace",
  description: "Solicite el paso a pruebas extendidas o producción de una API ya validada en sandbox.",
};

export default async function SolicitudContratacionRoute({
  searchParams,
}: {
  searchParams: Promise<{ producto?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedProduct = Array.isArray(params.producto) ? params.producto[0] : params.producto;
  const matchedProduct = apiCatalogItems.find(
    (item) => item.name === requestedProduct || item.slug === requestedProduct,
  );

  return (
    <ContractingRequestPage
      productName={matchedProduct?.name ?? ""}
      productSlug={matchedProduct?.slug ?? ""}
    />
  );
}
