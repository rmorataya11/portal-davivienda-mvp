import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { CreateAccountPage } from "@/components/auth/create-account-page";
import { presentCatalogApi } from "@/lib/catalog/present";
import { getCatalogApis } from "@/lib/catalog/queries";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth.metadata");

  return {
    title: t("signupTitle"),
    description: t("signupDescription"),
  };
}

export default async function CrearCuentaRoute({
  searchParams,
}: {
  searchParams: Promise<{ producto?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedProduct = Array.isArray(params.producto) ? params.producto[0] : params.producto;
  const locale = await getLocale();
  const products = (await getCatalogApis()).map((api) => presentCatalogApi(api, locale));
  const matchedProduct = products.find(
    (item) => item.name === requestedProduct || item.slug === requestedProduct,
  );

  return <CreateAccountPage initialProduct={matchedProduct?.name ?? ""} />;
}
