import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApiDetailPage } from "@/components/catalog/api-detail-page";
import { apiDetails, getApiDetailBySlug } from "@/components/catalog/content/apis";

export function generateStaticParams() {
  return apiDetails.map((api) => ({ slug: api.slug }));
}

export async function generateMetadata({ params }: PageProps<"/catalogo-apis/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const api = getApiDetailBySlug(slug);

  if (!api) {
    return {
      title: "API no encontrada | Davivienda API Marketplace",
    };
  }

  return {
    title: `${api.name} | Davivienda API Marketplace`,
    description: api.description,
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
