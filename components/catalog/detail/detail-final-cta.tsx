import Link from "next/link";

import type { ApiDetail } from "../content/apis";

export function DetailFinalCta({ api }: { api: ApiDetail }) {
  return (
    <section id="next-steps" className="pb-16">
      <div className="mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-[56px]">
        <div className="rounded-[32px] bg-[linear-gradient(90deg,#404040_0%,#0D0D0D_100%)] px-5 py-6 text-white shadow-[0_24px_70px_rgba(20,31,37,0.12)] sm:px-8 sm:py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[14px] font-medium uppercase tracking-[0.26em] text-white/64">Siguiente paso</p>
              <h2 className="mt-4 text-[36px] font-bold tracking-[0.72px]">Empiece su integración con esta API</h2>
              <p className="mt-5 max-w-[860px] text-[18px] leading-8 tracking-[0.36px] text-white/78">{api.supportNote}</p>
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

            <div className="rounded-[24px] border border-white/12 bg-white/6 p-4 backdrop-blur-[2px]">
              <div className="flex flex-col gap-3">
                <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-white/60">Comience hoy</p>
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
