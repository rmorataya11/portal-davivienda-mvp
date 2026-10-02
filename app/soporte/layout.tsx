import type { ReactNode } from "react";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";

export default function FaqLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/soporte" />
      {children}
      <MarketplaceFooter />
    </main>
  );
}
