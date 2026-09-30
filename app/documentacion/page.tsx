import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { DocsPage } from "@/components/docs/docs-page";
import { getEndpointBySlug } from "@/lib/catalog/queries";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Documentacion.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function DocumentationRoute() {
  let endpoint = null;

  try {
    endpoint = await getEndpointBySlug("api-tesoreria", "consulta-movimientos");
  } catch (error) {
    console.error("No se pudo cargar consulta-movimientos.", error);
  }

  return (
    <Suspense>
      <DocsPage endpoint={endpoint} />
    </Suspense>
  );
}
