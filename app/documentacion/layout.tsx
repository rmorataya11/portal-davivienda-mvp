import type { ReactNode } from "react";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";

export default function DocumentationLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-white">
      <MarketplaceHeader activeHref="/documentacion" />
      {children}
      <MarketplaceFooter />
    </main>
  );
}
