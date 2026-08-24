import type { ReactNode } from "react";

import { DashboardAccessGate } from "@/components/dashboard/dashboard-access-gate";
import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { SectionContainer } from "@/components/ui/layout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/dashboard" />
      <section className="pt-[132px] pb-16">
        <SectionContainer>
          <DashboardAccessGate>{children}</DashboardAccessGate>
        </SectionContainer>
      </section>
      <MarketplaceFooter />
    </main>
  );
}
