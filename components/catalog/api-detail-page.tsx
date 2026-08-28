import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { SectionContainer } from "@/components/ui/layout";

import type { ApiDetail } from "./content/apis";
import { DetailFinalCta } from "./detail/detail-final-cta";
import { DetailInsightsTabs } from "./detail/detail-insights-tabs";
import { DetailHero } from "./detail/detail-hero";
import { ApiAppsSection } from "./detail/api-apps-section";

export function ApiDetailPage({ api }: { api: ApiDetail }) {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/catalogo-apis" />

      <section className="pt-4">
        <SectionContainer>
          <DetailHero api={api} />
        </SectionContainer>
      </section>

      <ApiAppsSection slug={api.slug} apiName={api.name} />

      <DetailInsightsTabs api={api} />

      <DetailFinalCta api={api} />

      <MarketplaceFooter />
    </main>
  );
}
