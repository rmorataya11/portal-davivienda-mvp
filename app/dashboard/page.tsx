import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { DashboardHome } from "@/components/dashboard/dashboard-home";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Dashboard.metadata");

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
  };
}

export default function DashboardRoute() {
  return <DashboardHome />;
}
