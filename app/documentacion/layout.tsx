import type { ReactNode } from "react";

import { ContentAccessGate } from "@/components/auth/content-access-gate";
import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";

export default function DocumentationLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/documentacion" />
      <ContentAccessGate
        eyebrow="Documentación"
        fallbackPath="/documentacion"
        description="La documentación técnica es privada: ahí están los endpoints, parámetros y ejemplos. Necesita una cuenta de desarrollador para entrar."
      >
        {children}
      </ContentAccessGate>
      <MarketplaceFooter />
    </main>
  );
}
