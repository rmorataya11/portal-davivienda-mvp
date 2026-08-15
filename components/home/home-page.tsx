import { CtaBanner } from "./cta-banner";
import { HeroSection } from "./hero-section";
import { MarketplaceFooter } from "./marketplace-footer";
import { MarketplaceHeader } from "./marketplace-header";
import { PartnerStrip } from "./partner-strip";
import { StepsSection } from "./steps-section";
import { UseCasesSection } from "./use-cases-section";
import { ValuePropositionSection } from "./value-proposition-section";

export function HomePage() {
  return (
    <main className="marketplace-shell min-h-screen">
      <MarketplaceHeader />
      <HeroSection />
      <PartnerStrip />
      <ValuePropositionSection />
      <UseCasesSection />
      <CtaBanner />
      <StepsSection />
      <MarketplaceFooter />
    </main>
  );
}
