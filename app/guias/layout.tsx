import type { ReactNode } from "react";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";

export default function GuidesLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-white">
      <MarketplaceHeader activeHref="/guias" />
      {children}
      <MarketplaceFooter />
    </main>
  );
}
