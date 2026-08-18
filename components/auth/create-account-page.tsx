import Link from "next/link";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { PageContainer, SectionContainer, SurfaceCard } from "@/components/ui/layout";

import { CreateAccountForm } from "./create-account-form";

export function CreateAccountPage({ initialProduct = "" }: { initialProduct?: string }) {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader />

      <section className="pt-[132px] pb-16">
        <PageContainer>
          <nav className="flex items-center gap-2 text-[14px] tracking-[0.2px] text-[#8A9096]">
            <Link href="/" className="transition-colors hover:text-[#E1251B]">
              Inicio
            </Link>
            <span aria-hidden="true">&gt;</span>
            <span className="text-[#404040]">Crear cuenta</span>
          </nav>
        </PageContainer>

        <SectionContainer className="mt-6">
          <SurfaceCard className="px-5 py-7 sm:px-8 sm:py-9 lg:px-12 lg:py-12">
            <div className="border-b border-[#E7EAEE] pb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F8E8EA] px-3 py-1.5 text-[13px] font-medium text-[#C21B22]">
                <TargetIcon />
                Cuéntenos su interés
              </span>
              <h1 className="mt-5 text-[34px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[40px]">
                Regístrese y empecemos
              </h1>
              <p className="mt-4 max-w-[760px] text-[16px] leading-7 tracking-[0.2px] text-[#6A7178]">
                Déjenos sus datos y el producto que le interesa. Le acompañamos en los siguientes pasos. Los campos con
                asterisco (*) son obligatorios.
              </p>
            </div>

            <CreateAccountForm initialProduct={initialProduct} />
          </SurfaceCard>
        </SectionContainer>
      </section>

      <MarketplaceFooter />
    </main>
  );
}

function TargetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.1" stroke="#E1251B" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="3.2" stroke="#E1251B" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="1.15" fill="#E1251B" />
    </svg>
  );
}
