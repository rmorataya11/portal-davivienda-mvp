import Link from "next/link";

import { ContractingRequestLink } from "@/components/contracting/contracting-request-link";
import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { SectionContainer } from "@/components/ui/layout";

import type { ApiDetail } from "./content/apis";
import { DetailSectionCard } from "./detail/detail-primitives";
import { TechnicalAccessGate } from "./detail/technical-access-gate";
import { TechnicalTabs } from "./detail/technical-tabs";

export function ApiTechnicalPage({ api }: { api: ApiDetail }) {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/catalogo-apis" />

      <section className="pt-[132px] pb-8">
        <SectionContainer>
          <Link
            href={`/catalogo-apis/${api.slug}`}
            className="inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.28px] text-[#707070] transition-colors duration-300 hover:text-[#E1251B]"
          >
            Volver al detalle de la API
          </Link>
          <div className="mt-6 rounded-[32px] border border-[#E7EAEE] bg-white px-6 py-7 shadow-[0_18px_50px_rgba(20,31,37,0.06)] sm:px-8 sm:py-8">
            <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#8E8E8E]">Detalle técnico</p>
            <h1 className="mt-4 text-[36px] font-bold tracking-[0.36px] text-[#141F25] sm:text-[44px]">
              Explore la integración de {api.name}
            </h1>
            <div className="mt-4 h-1.5 w-14 rounded-full bg-[#E1251B]" />
            <p className="mt-4 max-w-[820px] text-[18px] leading-8 tracking-[0.24px] text-[#6A7178]">
              Acceda a la consola visual de endpoints, ejemplos de request/response y criterios técnicos para avanzar
              hacia una integración más realista.
            </p>
            <ContractingRequestLink
              href={`/solicitud-contratacion?producto=${api.slug}`}
              className="mt-7 inline-flex h-12 items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[15px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C]"
            >
              Solicitar contratación
            </ContractingRequestLink>
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
                slug={api.slug}
              />
            </DetailSectionCard>
          </TechnicalAccessGate>
        </SectionContainer>
      </section>

      <MarketplaceFooter />
    </main>
  );
}
