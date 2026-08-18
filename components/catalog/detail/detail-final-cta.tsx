import Link from "next/link";

import type { ApiDetail } from "../content/apis";

export function DetailFinalCta({ api }: { api: ApiDetail }) {
  return (
    <section id="next-steps" className="pb-16">
      <div className="mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-[56px]">
        <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(110deg,#1C252C_0%,#10161A_52%,#7F1120_100%)] px-5 py-6 text-white shadow-[0_24px_70px_rgba(20,31,37,0.12)] sm:px-8 sm:py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-white/58">Siguiente paso</p>
              <h2 className="mt-4 max-w-[720px] text-[34px] font-bold leading-[1.12] tracking-[0.3px] sm:text-[40px]">
                Lleve esta API de evaluación a integración real
              </h2>
              <p className="mt-5 max-w-[780px] text-[18px] leading-8 tracking-[0.24px] text-white/76">{api.supportNote}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/14 bg-white/6 px-4 py-2 text-[14px] font-medium text-white/88">
                  Sandbox guiado
                </span>
                <span className="rounded-full border border-white/14 bg-white/6 px-4 py-2 text-[14px] font-medium text-white/88">
                  Soporte de integración
                </span>
                <span className="rounded-full border border-white/14 bg-white/6 px-4 py-2 text-[14px] font-medium text-white/88">
                  Paso a producción
                </span>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-5 backdrop-blur-[2px]">
              <div className="flex flex-col gap-3">
                <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-white/60">Comience hoy</p>
                <p className="text-[15px] leading-7 text-white/72">
                  Active un entorno inicial y valide el primer consumo con acompañamiento.
                </p>
                <Link
                  href="#"
                  className="inline-flex h-12 min-w-[220px] items-center justify-center rounded-[30px] bg-white px-6 text-[15px] font-semibold text-[#141F25] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#F2F3F5]"
                >
                  Acceder a sandbox
                </Link>
                <Link
                  href="#"
                  className="inline-flex h-12 min-w-[220px] items-center justify-center rounded-[30px] border border-white/30 px-6 text-[15px] font-medium text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white hover:bg-white/6"
                >
                  Hablar con un experto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
