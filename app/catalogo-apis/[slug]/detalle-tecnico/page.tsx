import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ApiTechnicalPage } from "@/components/catalog/api-technical-page";
import { presentCatalogApi } from "@/lib/catalog/present";
import { getCatalogApiBySlug } from "@/lib/catalog/queries";

export async function generateMetadata({ params }: PageProps<"/catalogo-apis/[slug]/detalle-tecnico">): Promise<Metadata> {
  const { slug } = await params;
  const api = await getCatalogApiBySlug(slug);
  const t = await getTranslations("Catalog");

  if (!api) {
    return {
      title: t("metadata.technicalNotFoundTitle"),
    };
  }

  const localized = presentCatalogApi(api, await getLocale());

  return {
    title: t("metadata.technicalTitle", { name: localized.name }),
    description: t("metadata.technicalDescription", { name: localized.name }),
  };
}

export default async function ApiTechnicalRoute({ params }: PageProps<"/catalogo-apis/[slug]/detalle-tecnico">) {
  const { slug } = await params;
  const api = await getCatalogApiBySlug(slug);

  if (!api) {
    notFound();
  }

  return <ApiTechnicalPage api={presentCatalogApi(api, await getLocale())} />;
}
