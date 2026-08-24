"use client";

import Link from "next/link";

import { useAuth } from "@/components/auth/auth-provider";
import { FullBleedContainer } from "@/components/ui/layout";

export function CatalogSignupCta() {
  const { user, loading } = useAuth();

  if (loading || user) {
    return null;
  }

  return (
    <section className="px-0 pb-16 pt-4">
      <FullBleedContainer className="bg-[linear-gradient(89deg,#404040_0%,#0D0D0D_100%)] px-6 py-10 sm:px-10 lg:h-[287px] lg:px-0 lg:py-0">
        <div className="flex flex-col gap-8 lg:relative lg:h-full">
          <h2 className="max-w-[596px] text-[26px] font-bold leading-[1.12] tracking-[0.8px] text-white sm:text-[36px] lg:absolute lg:left-14 lg:top-[84px] lg:text-[40px]">
            ¿Listo para su primera llamada?
          </h2>
          <p className="max-w-[691px] text-[16px] leading-7 tracking-[0.02em] text-white sm:text-[18px] lg:absolute lg:left-14 lg:top-[157px] lg:text-[20px]">
            Cree su cuenta de desarrollador, genere credenciales de Sandbox y reciba su primer 200 OK en cuestión de
            minutos.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row lg:absolute lg:left-[796px] lg:top-[90px] lg:gap-8">
            <Link
              href="/crear-cuenta"
              className="inline-flex h-12 w-full items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[15px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)] sm:w-[204px]"
            >
              Crear cuenta
            </Link>
            <Link
              href="/iniciar-sesion"
              className="inline-flex h-12 w-full items-center justify-center rounded-[30px] border border-[#2C2C2C] bg-white px-6 text-[15px] font-medium text-[#404040] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#404040] hover:bg-[#F6F6F6] hover:shadow-[0_14px_28px_rgba(20,31,37,0.12)] sm:w-[209px]"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </FullBleedContainer>
    </section>
  );
}
