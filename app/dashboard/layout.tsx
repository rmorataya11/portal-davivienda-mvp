import type { ReactNode } from "react";

import { DashboardAccessGate } from "@/components/dashboard/dashboard-access-gate";
import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { SectionContainer } from "@/components/ui/layout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/dashboard" />
      <section className="pt-[104px] pb-16 sm:pt-[120px] lg:pt-[132px]">
        <SectionContainer>
          <DashboardAccessGate>{children}</DashboardAccessGate>
        </SectionContainer>
      </section>
      <MarketplaceFooter />
    </main>
  );
}
