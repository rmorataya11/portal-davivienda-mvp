import Link from "next/link";

import { ContractingRequestLink } from "@/components/contracting/contracting-request-link";
import { SectionContainer } from "@/components/ui/layout";

import type { ApiDetail } from "../content/apis";

export function DetailFinalCta({ api }: { api: ApiDetail }) {
  return (
    <section id="next-steps" className="pb-16">
      <SectionContainer>
        <div className="overflow-hidden rounded-[32px] border border-[#E7EAEE] bg-white px-5 py-6 shadow-[0_18px_50px_rgba(20,31,37,0.06)] sm:px-8 sm:py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#8E8E8E]">Siguiente paso</p>
              <h2 className="mt-4 max-w-[720px] text-[26px] font-bold leading-[1.12] tracking-[0.3px] text-[#141F25] sm:text-[34px] lg:text-[40px]">
                Revise el detalle técnico de esta API
              </h2>
              <div className="mt-4 h-1.5 w-14 rounded-full bg-[#E1251B]" />
              <p className="mt-5 max-w-[780px] text-[16px] leading-7 tracking-[0.24px] text-[#6A7178] sm:text-[18px] sm:leading-8">
                Acceda a la consola visual, explore endpoints, request/response y prepare una validación técnica más
                completa para {api.name}.
              </p>
            </div>

            <div className="rounded-[26px] border border-[#E7EAEE] bg-[#F8F9FB] p-5">
              <div className="flex flex-col gap-3">
                <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Detalle técnico</p>
                <p className="text-[15px] leading-7 text-[#6A7178]">
                  Abra una vista más enfocada en integración, pruebas visuales y referencia operativa.
                </p>
                <Link
                  href={`/catalogo-apis/${api.slug}/detalle-tecnico`}
                  className="inline-flex h-12 w-full items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[15px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C]"
                >
                  Ver detalle técnico
                </Link>
                <ContractingRequestLink
                  href={`/solicitud-contratacion?producto=${api.slug}`}
                  className="inline-flex h-12 w-full items-center justify-center rounded-[30px] border border-[#E1251B] bg-white px-6 text-[15px] font-medium text-[#E1251B] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#FFF8F8]"
                >
                  Solicitar contratación
                </ContractingRequestLink>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
