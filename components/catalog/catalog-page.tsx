import Link from "next/link";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";

import { ApiCard } from "./api-card";
import { apiCatalogItems, apiCategories } from "./content/apis";

export function CatalogPage() {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/catalogo-apis" />

      <section className="pt-[152px]">
        <div className="mx-auto max-w-[1366px] px-[58px] pb-[52px]">
          <h1 className="w-[1254px] text-[40px] font-bold leading-[44px] tracking-[0.8px] text-[#404040]">
            Encuentre el producto ideal para su negocio
          </h1>
          <p className="mt-[32px] w-[1254px] text-[20px] leading-6 tracking-[0.4px] text-[#404040]">
            Explore nuestras APIs y descubra la que mejor se ajusta a lo que quiere lograr. Cuando encuentre la
            indicada, cuéntenos y le acompañamos para empezar.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-[1366px] bg-white">
          <div className="px-[56px] py-4">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 text-[16px] leading-7 font-medium tracking-[0.32px] text-[#404040]">
                <span className="inline-flex h-[30px] w-8 items-center justify-center text-xs text-[#404040]">
                  ≡
                </span>
                <span>Catálogo de APIs</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-10 w-[408px] items-center rounded-full border border-[#8E8E8E] bg-white px-4 text-[#8E8E8E]">
                  <span className="mr-3 text-lg">⌕</span>
                  <span className="text-sm">Filtra por nombre, etiqueta o endpoint...</span>
                </div>
                <button
                  type="button"
                  className="inline-flex h-[22px] w-6 items-center justify-center text-[#8E8E8E]"
                >
                  ⌘
                </button>
                {apiCategories.map((category, index) => (
                  <button
                    key={category}
                    type="button"
                    className={`inline-flex h-10 items-center justify-center rounded-[32px] border px-5 text-sm font-medium transition-colors ${
                      index === 0
                        ? "w-[93px] border-[#404040] bg-white text-[#404040]"
                        : "border-[#404040] bg-white text-[#404040] hover:border-[#2C2C2C] hover:text-[#2C2C2C]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="grid gap-[15px] lg:grid-cols-[repeat(3,408px)]">
                {apiCatalogItems.map((api) => (
                  <ApiCard key={api.name} api={api} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-0 pb-16 pt-4">
        <div className="mx-auto max-w-[1366px] bg-[linear-gradient(90deg,#4B4B4B_0%,#2A2A2A_62%,#121212_100%)] px-10 py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[760px]">
              <h2 className="text-[54px] font-bold leading-[1.08] tracking-[-0.03em] text-white">
                ¿Listo para su primera llamada?
              </h2>
              <p className="mt-6 max-w-[720px] text-[24px] leading-9 text-white/86">
                Cree su cuenta de desarrollador, genere credenciales de Sandbox y reciba su primer 200 OK en cuestión
                de minutos.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="#crear-cuenta"
                className="inline-flex h-12 min-w-[210px] items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white"
              >
                Crear cuenta
              </Link>
              <Link
                href="#iniciar-sesion"
                className="inline-flex h-12 min-w-[210px] items-center justify-center rounded-full bg-white px-7 text-[15px] font-semibold text-[#404040]"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketplaceFooter />
    </main>
  );
}
