import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { DocsPage } from "@/components/docs/docs-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Documentacion.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function DocumentationRoute() {
  return (
    <Suspense>
      <DocsPage />
    </Suspense>
  );
}
