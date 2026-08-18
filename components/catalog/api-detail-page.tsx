import Link from "next/link";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { PageContainer } from "@/components/ui/layout";

import type { ApiDetail } from "./content/apis";
import { DetailFinalCta } from "./detail/detail-final-cta";
import { DetailInsightsTabs } from "./detail/detail-insights-tabs";
import { DetailNav } from "./detail/detail-nav";
import { DetailHero } from "./detail/detail-hero";
import { DetailSectionCard } from "./detail/detail-primitives";
import { TechnicalTabs } from "./detail/technical-tabs";

const detailSections = [
  { id: "overview", label: "Resumen" },
  { id: "value", label: "Insights" },
  { id: "technical", label: "Técnico" },
  { id: "next-steps", label: "Siguiente paso" },
];

export function ApiDetailPage({ api }: { api: ApiDetail }) {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/catalogo-apis" />

      <section className="pt-[152px]">
        <PageContainer>
          <Link
            href="/catalogo-apis"
            className="inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.28px] text-[#707070] transition-colors duration-300 hover:text-[#E1251B]"
          >
            Volver al catálogo
          </Link>

          <DetailHero api={api} />
        </PageContainer>
      </section>

      <section className="py-8">
        <PageContainer>
          <DetailNav sections={detailSections} />
        </PageContainer>
      </section>

      <DetailInsightsTabs api={api} />

      <section id="technical" className="pb-16">
        <PageContainer>
          <DetailSectionCard eyebrow="Técnico" title="Explore la integración">
            <TechnicalTabs
              authentication={api.authentication}
              requirements={api.requirements}
              endpoints={api.endpoints}
              sampleRequest={api.sampleRequest}
              sampleResponse={api.sampleResponse}
              errors={api.errors}
            />
          </DetailSectionCard>
        </PageContainer>
      </section>

      <DetailFinalCta api={api} />

      <MarketplaceFooter />
    </main>
  );
}
