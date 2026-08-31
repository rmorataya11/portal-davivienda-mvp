import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { FullBleedContainer, PageContainer } from "@/components/ui/layout";

import { CatalogBrowser } from "./catalog-browser";
import { CatalogSignupCta } from "./catalog-signup-cta";

export function CatalogPage() {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/catalogo-apis" />

      <section className="pt-4 pb-10">
        <PageContainer className="pb-10 lg:px-[58px] lg:pb-[52px]">
          <h1 className="max-w-[1254px] text-[30px] font-bold leading-[1.1] tracking-[0.8px] text-[#404040] sm:text-[40px] sm:leading-[44px]">
            Encuentre el producto ideal para su negocio
          </h1>
          <p className="mt-6 max-w-[1254px] text-[17px] leading-7 tracking-[0.02em] text-[#404040] sm:mt-[32px] sm:text-[20px] sm:leading-6">
            Explore nuestras APIs y descubra la que mejor se ajusta a lo que quiere lograr. Cuando encuentre la
            indicada, cuéntenos y le acompañamos para empezar.
          </p>
        </PageContainer>
      </section>

      <section className="pb-16">
        <FullBleedContainer className="bg-white">
          <div className="px-4 py-4 sm:px-6 lg:px-[56px]">
            <CatalogBrowser />
          </div>
        </FullBleedContainer>
      </section>

      <CatalogSignupCta />

      <MarketplaceFooter />
    </main>
  );
}
