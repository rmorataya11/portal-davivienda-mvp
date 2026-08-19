import Link from "next/link";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { PageContainer, SectionContainer } from "@/components/ui/layout";

import type { ApiDetail } from "./content/apis";
import { DetailSectionCard } from "./detail/detail-primitives";
import { TechnicalAccessGate } from "./detail/technical-access-gate";
import { TechnicalTabs } from "./detail/technical-tabs";

export function ApiTechnicalPage({ api }: { api: ApiDetail }) {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/catalogo-apis" />

      <section className="pt-[132px] pb-8">
        <PageContainer>
          <Link
            href={`/catalogo-apis/${api.slug}`}
            className="inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.28px] text-[#707070] transition-colors duration-300 hover:text-[#E1251B]"
          >
            Volver al detalle de la API
          </Link>
        </PageContainer>

        <SectionContainer className="mt-6">
          <div className="rounded-[32px] bg-[linear-gradient(120deg,#1C252C_0%,#10161A_56%,#7F1120_100%)] px-6 py-7 text-white shadow-[0_24px_70px_rgba(20,31,37,0.14)] sm:px-8 sm:py-8">
            <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-white/58">Detalle técnico</p>
            <h1 className="mt-4 text-[36px] font-bold tracking-[0.36px] sm:text-[44px]">Explore la integración de {api.name}</h1>
            <p className="mt-4 max-w-[820px] text-[18px] leading-8 tracking-[0.24px] text-white/76">
              Acceda a la consola visual de endpoints, ejemplos de request/response y criterios técnicos para avanzar
              hacia una integración más realista.
            </p>
          </div>
        </SectionContainer>
      </section>

      <section className="pb-16">
        <SectionContainer>
          <TechnicalAccessGate api={api}>
            <DetailSectionCard eyebrow="Técnico" title="Detalle técnico de esta API">
              <TechnicalTabs
                authentication={api.authentication}
                requirements={api.requirements}
                endpoints={api.endpoints}
                sampleRequest={api.sampleRequest}
                sampleResponse={api.sampleResponse}
                errors={api.errors}
              />
            </DetailSectionCard>
          </TechnicalAccessGate>
        </SectionContainer>
      </section>

      <MarketplaceFooter />
    </main>
  );
}
