import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ApiDetailPage } from "@/components/catalog/api-detail-page";
import { presentCatalogApi } from "@/lib/catalog/present";
import { getCatalogApiBySlug, getEndpointsForApi } from "@/lib/catalog/queries";

export async function generateMetadata({ params }: PageProps<"/catalogo-apis/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const api = await getCatalogApiBySlug(slug);
  const t = await getTranslations("Catalog");

  if (!api) {
    return {
      title: t("metadata.notFoundTitle"),
    };
  }

  const localized = presentCatalogApi(api, await getLocale(), await getEndpointsForApi(api.id));

  return {
    title: t("metadata.detailTitle", { name: localized.name }),
    description: localized.description.replace(/\n/g, " "),
  };
}

export default async function ApiDetailRoute({ params }: PageProps<"/catalogo-apis/[slug]">) {
  const { slug } = await params;
  const api = await getCatalogApiBySlug(slug);

  if (!api) {
    notFound();
  }

  return <ApiDetailPage api={presentCatalogApi(api, await getLocale(), await getEndpointsForApi(api.id))} />;
}
