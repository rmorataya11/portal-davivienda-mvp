import type { ReactNode } from "react";

import { DocsAccessGate } from "@/components/docs/docs-access-gate";
import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";

export default function DocumentationLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/documentacion" />
      <DocsAccessGate>{children}</DocsAccessGate>
      <MarketplaceFooter />
    </main>
  );
}
