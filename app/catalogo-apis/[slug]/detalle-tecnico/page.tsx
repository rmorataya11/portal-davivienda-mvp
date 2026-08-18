import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApiTechnicalPage } from "@/components/catalog/api-technical-page";
import { apiDetails, getApiDetailBySlug } from "@/components/catalog/content/apis";

export function generateStaticParams() {
  return apiDetails.map((api) => ({ slug: api.slug }));
}

export async function generateMetadata({ params }: PageProps<"/catalogo-apis/[slug]/detalle-tecnico">): Promise<Metadata> {
  const { slug } = await params;
  const api = getApiDetailBySlug(slug);

  if (!api) {
    return {
      title: "Detalle técnico no encontrado | Davivienda API Marketplace",
    };
  }

  return {
    title: `Detalle técnico de ${api.name} | Davivienda API Marketplace`,
    description: `Información técnica, endpoints y ejemplos de integración para ${api.name}.`,
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
