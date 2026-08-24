import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { FullBleedContainer, PageContainer } from "@/components/ui/layout";

import { ApiCard } from "./api-card";
import { CatalogSignupCta } from "./catalog-signup-cta";
import { apiCatalogItems, apiCategories } from "./content/apis";

export function CatalogPage() {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/catalogo-apis" />

      <section className="pt-[104px] sm:pt-[120px] lg:pt-[140px]">
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
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 text-[16px] leading-7 font-medium tracking-[0.32px] text-[#404040]">
                <span>Catálogo de APIs</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-10 w-full items-center rounded-full border border-[#8E8E8E] bg-white px-4 text-[#8E8E8E] transition-colors duration-300 hover:border-[#404040] hover:text-[#404040] sm:w-[408px]">
                  <span className="text-sm">Filtra por nombre, etiqueta o endpoint...</span>
                </div>
                <button
                  type="button"
                  className="inline-flex h-[22px] w-6 items-center justify-center text-[#8E8E8E] transition-colors duration-300 hover:text-[#404040]"
                >
                  ⌘
                </button>
                {apiCategories.map((category, index) => (
                  <button
                    key={category}
                    type="button"
                    className={`inline-flex h-10 items-center justify-center rounded-[32px] border px-5 text-sm font-medium transition-all duration-300 ease-out ${
                      index === 0
                        ? "w-[93px] border-[#404040] bg-white text-[#404040] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(20,31,37,0.08)]"
                        : "border-[#404040] bg-white text-[#404040] hover:-translate-y-0.5 hover:border-[#2C2C2C] hover:bg-[#404040] hover:text-white hover:shadow-[0_12px_24px_rgba(20,31,37,0.08)]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="grid gap-[15px] md:grid-cols-2 xl:grid-cols-3">
                {apiCatalogItems.map((api) => (
                  <ApiCard key={api.name} api={api} />
                ))}
              </div>
            </div>
          </div>
        </FullBleedContainer>
      </section>

      <CatalogSignupCta />

      <MarketplaceFooter />
    </main>
  );
}
