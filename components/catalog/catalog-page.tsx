import Link from "next/link";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";

import { ApiCard } from "./api-card";
import { apiCatalogItems, apiCategories } from "./content/apis";

export function CatalogPage() {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/catalogo-apis" />

      <section className="pt-[126px]">
        <div className="mx-auto max-w-[1366px] px-10 py-10">
          <h1 className="max-w-[980px] text-[56px] font-bold leading-[1.08] tracking-[-0.03em] text-[#404040]">
            Encuentre el producto ideal para su negocio
          </h1>
          <p className="mt-8 max-w-[1040px] text-[24px] leading-9 text-[#404040]">
            Explore nuestras APIs y descubra la que mejor se ajusta a lo que quiere lograr. Cuando encuentre la
            indicada, cuéntenos y le acompañamos para empezar.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-[1366px] bg-white">
          <div className="px-6 py-6">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 text-[16px] font-medium text-[#2C2C2C]">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] border border-[#2C2C2C] text-xs">
                  ≡
                </span>
                <span>Catálogo de APIs</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-11 min-w-[420px] items-center rounded-full border border-[#C9CDD2] bg-white px-4 text-[#8E8E8E]">
                  <span className="mr-3 text-lg">⌕</span>
                  <span className="text-sm">Filtra por nombre, etiqueta o endpoint...</span>
                </div>
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#C9CDD2] text-[#707070]"
                >
                  ⌘
                </button>
                {apiCategories.map((category, index) => (
                  <button
                    key={category}
                    type="button"
                    className={`inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-medium transition-colors ${
                      index === 0
                        ? "border-[#2C2C2C] bg-white text-[#2C2C2C]"
                        : "border-[#C9CDD2] bg-white text-[#707070] hover:border-[#2C2C2C] hover:text-[#2C2C2C]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
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
