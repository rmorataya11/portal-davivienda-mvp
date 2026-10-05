import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SupportPage } from "@/components/support/support-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Support.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SupportRoute() {
  return <SupportPage />;
}
