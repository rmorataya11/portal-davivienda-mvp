import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { localizeGuide } from "@/components/guides/localize-guide";
import { GuideDetailPage } from "@/components/guides/guide-detail-page";
import { getGuideBySlug, guides } from "@/lib/guides/guides-content";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps<"/soporte/guias/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  const t = await getTranslations("Support");

  if (!guide) {
    return {
      title: t("metadata.guideNotFoundTitle"),
    };
  }

  const localized = localizeGuide(guide, t);

  return {
    title: t("metadata.guideTitle", { title: localized.title }),
    description: localized.description,
  };
}

export default async function GuideDetailRoute({ params }: PageProps<"/soporte/guias/[slug]">) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return <GuideDetailPage guide={guide} />;
}
