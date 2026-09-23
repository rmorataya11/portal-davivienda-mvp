import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CatalogPage } from "@/components/catalog/catalog-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Catalog.metadata");

  return {
    title: t("listingTitle"),
    description: t("listingDescription"),
  };
}

export default function CatalogApisPage() {
  return <CatalogPage />;
}
