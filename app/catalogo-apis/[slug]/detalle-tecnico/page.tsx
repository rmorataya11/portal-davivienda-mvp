import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ApiTechnicalPage } from "@/components/catalog/api-technical-page";
import { apiDetails, getApiDetailBySlug } from "@/components/catalog/content/apis";
import { localizeApiDetail } from "@/components/catalog/content/localize-api";

export function generateStaticParams() {
  return apiDetails.map((api) => ({ slug: api.slug }));
}

export async function generateMetadata({ params }: PageProps<"/catalogo-apis/[slug]/detalle-tecnico">): Promise<Metadata> {
  const { slug } = await params;
  const api = getApiDetailBySlug(slug);
  const t = await getTranslations("Catalog");

  if (!api) {
    return {
      title: t("metadata.technicalNotFoundTitle"),
    };
  }

  const localized = localizeApiDetail(api, t);

  return {
    title: t("metadata.technicalTitle", { name: localized.name }),
    description: t("metadata.technicalDescription", { name: localized.name }),
  };
}

export default async function ApiTechnicalRoute({ params }: PageProps<"/catalogo-apis/[slug]/detalle-tecnico">) {
  const { slug } = await params;
  const api = getApiDetailBySlug(slug);

  if (!api) {
    notFound();
  }

  return <ApiTechnicalPage api={api} />;
}
