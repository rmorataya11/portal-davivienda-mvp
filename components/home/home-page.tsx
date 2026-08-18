import { CtaBanner } from "./sections/cta-banner";
import { HeroSection } from "./sections/hero-section";
import { MarketplaceFooter } from "./sections/marketplace-footer";
import { MarketplaceHeader } from "./sections/marketplace-header";
import { StepsSection } from "./sections/steps-section";
import { UseCasesSection } from "./sections/use-cases-section";
import { ValuePropositionSection } from "./sections/value-proposition-section";

export function HomePage() {
  return (
    <main className="marketplace-shell min-h-screen">
      <MarketplaceHeader activeHref="/" />
      <HeroSection />
      <ValuePropositionSection />
      <UseCasesSection />
      <CtaBanner />
      <StepsSection />
      <MarketplaceFooter />
    </main>
  );
}
