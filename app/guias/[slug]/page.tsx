import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuideDetailPage } from "@/components/guides/guide-detail-page";
import { getGuideBySlug, guides } from "@/lib/guides/guides-content";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guias/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: "Guía no encontrada | Davivienda API Marketplace",
    };
  }

  return {
    title: `${guide.title} | Guías de Uso | Davivienda API Marketplace`,
    description: guide.description,
  };
}

export default async function GuideDetailRoute({ params }: PageProps<"/guias/[slug]">) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return <GuideDetailPage guide={guide} />;
}
