import { useTranslations } from "next-intl";

import { ContractingRequestLink } from "@/components/contracting/contracting-request-link";
import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { SectionContainer, SurfaceCard } from "@/components/ui/layout";

import type { CatalogView } from "@/lib/catalog/present";

import { TechnicalAccessGate } from "./detail/technical-access-gate";
import { TechnicalTabs } from "./detail/technical-tabs";

export function ApiTechnicalPage({ api }: { api: CatalogView }) {
  const t = useTranslations("Catalog");

  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/catalogo-apis" />

      <section className="pt-4 pb-8">
        <SectionContainer>
          <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-6 py-5 sm:px-8 sm:py-6">
            <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
              <div className="min-w-0">
                <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#8E8E8E]">{t("technical.eyebrow")}</p>
                <h1 className="mt-3 text-[24px] font-bold tracking-[0.36px] text-[#141F25] sm:text-[32px]">
                  {t("technical.title", { name: api.name })}
                </h1>
                <p className="mt-3 max-w-[720px] text-[15px] leading-7 tracking-[0.24px] text-[#6A7178]">
                  {t("technical.description")}
                </p>
              </div>
              <ContractingRequestLink
                href={`/solicitud-contratacion?producto=${api.slug}`}
                className="inline-flex h-[46px] w-full shrink-0 items-center justify-center rounded-[30px] bg-[#E1251B] text-[14px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)] sm:w-[246px]"
              >
                {t("technical.requestContracting")}
              </ContractingRequestLink>
            </div>
          </div>
        </SectionContainer>
      </section>

      <section className="pb-16">
        <SectionContainer>
          <TechnicalAccessGate api={api}>
            <SurfaceCard className="px-6 py-6 sm:px-8 sm:py-8">
              <TechnicalTabs
                description={api.description}
                headers={api.authentication.headers}
                endpoints={api.endpoints}
                errors={api.errors}
                slug={api.slug}
                apiName={api.name}
              />
            </SurfaceCard>
          </TechnicalAccessGate>
        </SectionContainer>
      </section>

      <MarketplaceFooter />
    </main>
  );
}
