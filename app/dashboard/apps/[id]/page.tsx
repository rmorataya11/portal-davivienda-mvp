import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AppDetailPage } from "@/components/dashboard/app-detail-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Dashboard.metadata");

  return {
    title: t("detailTitle"),
    description: t("detailDescription"),
  };
}

export default async function AppDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <AppDetailPage appId={id} />;
}
