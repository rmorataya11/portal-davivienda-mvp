import type { Metadata } from "next";

import { CreateAccountPage } from "@/components/auth/create-account-page";
import { apiCatalogItems } from "@/components/catalog/content/apis";
import { getSafeInternalPath } from "@/lib/navigation/safe-path";

export const metadata: Metadata = {
  title: "Crear cuenta | Davivienda API Marketplace",
  description: "Regístrese para solicitar acceso a las APIs de Davivienda y comenzar su integración.",
};

export default async function CrearCuentaRoute({
  searchParams,
}: {
  searchParams: Promise<{ producto?: string | string[]; next?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedProduct = Array.isArray(params.producto) ? params.producto[0] : params.producto;
  const requestedNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const matchedProduct = apiCatalogItems.find(
    (item) => item.name === requestedProduct || item.slug === requestedProduct,
  );

  return <CreateAccountPage initialProduct={matchedProduct?.name ?? ""} nextPath={getSafeInternalPath(requestedNext)} />;
}
