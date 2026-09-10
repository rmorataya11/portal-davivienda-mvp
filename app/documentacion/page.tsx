import type { Metadata } from "next";
import { Suspense } from "react";

import { DocsPage } from "@/components/docs/docs-page";

export const metadata: Metadata = {
  title: "Documentación técnica | Davivienda API Marketplace",
  description:
    "Consulte endpoints, parámetros y ejemplos de las APIs de Tesorería, Pay Davivienda y Validación de Cuenta.",
};

export default function DocumentationRoute() {
  return (
    <Suspense>
      <DocsPage />
    </Suspense>
  );
}
