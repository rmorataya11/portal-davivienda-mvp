import type { ReactNode } from "react";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { ProfileAccessGate } from "@/components/profile/profile-access-gate";
import { SectionContainer } from "@/components/ui/layout";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/perfil" />
      <section className="pt-4 pb-16">
        <SectionContainer>
          <ProfileAccessGate>{children}</ProfileAccessGate>
        </SectionContainer>
      </section>
      <MarketplaceFooter />
    </main>
  );
}
