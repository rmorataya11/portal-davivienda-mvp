import Link from "next/link";

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

      <section className="pt-[104px] sm:pt-[120px] lg:pt-[132px]">
        <SectionContainer>
          <Link
            href="/catalogo-apis"
            className="inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.28px] text-[#707070] transition-colors duration-300 hover:text-[#E1251B]"
          >
            Volver al catálogo
          </Link>
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
