import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SupportPage } from "@/components/support/support-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Faq.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function FaqRoute() {
  return <SupportPage />;
}
