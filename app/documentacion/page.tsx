import type { Metadata } from "next";
import { Suspense } from "react";

import { DocsPage } from "@/components/docs/docs-page";

export const metadata: Metadata = {
  title: "Documentación técnica | Davivienda API Marketplace",
  description:
    "Consulte el endpoint, parámetros y ejemplos de API Tesorería.",
};

export default function DocumentationRoute() {
  return (
    <Suspense>
      <DocsPage />
    </Suspense>
  );
}
