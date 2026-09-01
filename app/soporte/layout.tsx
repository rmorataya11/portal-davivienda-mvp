import type { ReactNode } from "react";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";

export default function SupportLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-white">
      <MarketplaceHeader activeHref="/soporte" />
      {children}
      <MarketplaceFooter />
    </main>
  );
}
