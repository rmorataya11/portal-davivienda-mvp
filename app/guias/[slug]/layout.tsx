import type { ReactNode } from "react";

import { ContentAccessGate } from "@/components/auth/content-access-gate";

export default function GuideDetailLayout({ children }: { children: ReactNode }) {
  return (
    <ContentAccessGate
      eyebrow="Guías de Uso"
      fallbackPath="/guias"
      description="Esta guía es privada: ahí está el detalle de la integración. Necesita una cuenta de desarrollador para entrar."
    >
      {children}
    </ContentAccessGate>
  );
}
