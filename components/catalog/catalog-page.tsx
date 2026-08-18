import Link from "next/link";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { FullBleedContainer, PageContainer } from "@/components/ui/layout";

import { ApiCard } from "./api-card";
import { apiCatalogItems, apiCategories } from "./content/apis";

export function CatalogPage() {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/catalogo-apis" />

      <section className="pt-[152px]">
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

      <section className="px-0 pb-16 pt-4">
        <FullBleedContainer className="bg-[linear-gradient(89deg,#404040_0%,#0D0D0D_100%)] px-6 py-10 sm:px-10 lg:h-[287px] lg:px-0 lg:py-0">
          <div className="flex flex-col gap-8 lg:relative lg:h-full">
            <h2 className="max-w-[596px] text-[30px] font-bold leading-[1.1] tracking-[0.8px] text-white sm:text-[40px] sm:leading-6 lg:absolute lg:left-14 lg:top-[84px]">
              ¿Listo para su primera llamada?
            </h2>
            <p className="max-w-[691px] text-[17px] leading-7 tracking-[0.02em] text-white sm:text-[20px] sm:leading-6 lg:absolute lg:left-14 lg:top-[157px]">
              Cree su cuenta de desarrollador, genere credenciales de Sandbox y reciba su primer 200 OK en cuestión
              de minutos.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row lg:absolute lg:left-[796px] lg:top-[90px] lg:gap-8">
              <Link
                href="#crear-cuenta"
                className="inline-flex h-12 w-full items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[15px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)] sm:w-[204px]"
              >
                Crear cuenta
              </Link>
              <Link
                href="#iniciar-sesion"
                className="inline-flex h-12 w-full items-center justify-center rounded-[30px] border border-[#2C2C2C] bg-white px-6 text-[15px] font-medium text-[#404040] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#404040] hover:bg-[#F6F6F6] hover:shadow-[0_14px_28px_rgba(20,31,37,0.12)] sm:w-[209px]"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </FullBleedContainer>
      </section>

      <MarketplaceFooter />
    </main>
  );
}
