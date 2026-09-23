import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ApiDetailPage } from "@/components/catalog/api-detail-page";
import { apiDetails, getApiDetailBySlug } from "@/components/catalog/content/apis";
import { localizeApiDetail } from "@/components/catalog/content/localize-api";

export function generateStaticParams() {
  return apiDetails.map((api) => ({ slug: api.slug }));
}

export async function generateMetadata({ params }: PageProps<"/catalogo-apis/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const api = getApiDetailBySlug(slug);
  const t = await getTranslations("Catalog");

  if (!api) {
    return {
      title: t("metadata.notFoundTitle"),
    };
  }

  const localized = localizeApiDetail(api, t);

  return {
    title: t("metadata.detailTitle", { name: localized.name }),
    description: localized.description.replace(/\n/g, " "),
  };
}

export default async function ApiDetailRoute({ params }: PageProps<"/catalogo-apis/[slug]">) {
  const { slug } = await params;
  const api = getApiDetailBySlug(slug);

  if (!api) {
    notFound();
  }

  return <ApiDetailPage api={api} />;
}
