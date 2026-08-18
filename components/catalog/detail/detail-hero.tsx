import Link from "next/link";

import type { ApiDetail } from "../content/apis";
import { QuickMetric } from "./detail-primitives";

export function DetailHero({ api }: { api: ApiDetail }) {
  return (
    <section
      id="overview"
      className="relative mt-6 overflow-hidden rounded-[32px] bg-[linear-gradient(125deg,#141F25_0%,#2A3239_52%,#870412_100%)] px-4 py-4 text-white shadow-[0_24px_70px_rgba(20,31,37,0.14)] sm:px-8 sm:py-8"
    >
      <div className="absolute -right-20 top-[-40px] h-[240px] w-[240px] rounded-full border border-white/10" />
      <div className="absolute right-16 top-16 h-[110px] w-[110px] rounded-full bg-[#E1251B]/14 blur-3xl" />

      <div className="relative grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="h-full rounded-[28px] border border-white/10 bg-white/3 px-1 py-1">
          <div className="flex h-full flex-col rounded-[24px] px-4 pb-4 pt-7 sm:px-5 sm:pb-5 sm:pt-8">
            <div className="flex flex-wrap items-center gap-4">
              {api.heroImageSrc ? (
                <div className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-[10px] border border-white/14 bg-white/10">
                  <img src={api.heroImageSrc} alt="" className="h-6 w-6 object-contain" />
                </div>
              ) : null}
              <span className="inline-flex items-center gap-2 rounded-full bg-[#EFFCF5] px-5 py-2 text-[14px] font-medium text-[#347659]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#55B685]" />
                {api.status}
              </span>
              <span className="inline-flex items-center rounded-full bg-white/10 px-5 py-2 text-[14px] font-medium text-white">
                {api.category}
              </span>
            </div>

            <h1 className="mt-7 max-w-[760px] text-[40px] font-bold leading-[44px] tracking-[0.8px] text-white sm:mt-8 sm:text-[52px] sm:leading-[56px] sm:tracking-[1.04px]">
              {api.name}
            </h1>
            <p className="mt-5 max-w-[760px] text-[18px] leading-7 tracking-[0.36px] text-white/90 sm:mt-6 sm:text-[22px] sm:leading-8 sm:tracking-[0.44px]">
              {api.heroDescription}
            </p>
            <p className="mt-6 max-w-[760px] text-[16px] leading-7 tracking-[0.32px] text-white/72 sm:mt-8 sm:text-[18px] sm:leading-8 sm:tracking-[0.36px]">
              {api.intro}
            </p>

            <div className="mt-auto flex flex-wrap gap-3 pt-8 sm:gap-4 sm:pt-10">
              <Link
                href="#technical"
                className="inline-flex h-11 min-w-[190px] items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_38px_rgba(225,37,27,0.24)] sm:h-12 sm:min-w-[226px] sm:px-7 sm:text-[15px]"
              >
                Ver ejemplo técnico
              </Link>
              <Link
                href="#next-steps"
                className="inline-flex h-11 min-w-[170px] items-center justify-center rounded-[30px] border border-white/24 bg-white/6 px-6 text-[14px] font-medium text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/10 sm:h-12 sm:min-w-[210px] sm:px-7 sm:text-[15px]"
              >
                Solicitar acceso
              </Link>
            </div>
          </div>
        </div>

        <aside>
          <div className="rounded-[28px] border border-white/12 bg-white/8 px-7 py-7 backdrop-blur-[2px]">
            <p className="text-[14px] font-medium uppercase tracking-[0.26em] text-white/64">Resumen rápido</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <QuickMetric label="Auth" value="Segura" tone="dark" />
              <QuickMetric label="Endpoints" value={String(api.endpoints.length)} tone="dark" />
              <div className="sm:col-span-2">
                <QuickMetric label="Primera llamada" value="Rápida" tone="dark" />
              </div>
            </div>
            <div className="mt-3 rounded-[20px] border border-white/12 bg-white/6 px-5 py-5">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-white/62">Ambientes</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {api.environments.map((environment) => (
                  <span
                    key={environment}
                    className="inline-flex items-center rounded-full border border-white/12 bg-white/10 px-3 py-2 text-[13px] font-medium text-white"
                  >
                    {environment.replace(" para pruebas funcionales", "").replace(" para operaciones autorizadas", "")}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-6 text-[16px] leading-7 tracking-[0.32px] text-white/74">
              Diseñada para equipos de tesorería, finanzas corporativas y plataformas que integran banca empresarial.
            </p>
          </div>
        </aside>

        <div className="grid gap-4 sm:grid-cols-2 xl:col-span-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_1.75fr]">
          <QuickMetric label="Producto" value="Tesorería" />
          <QuickMetric label="Uso ideal" value="B2B" />
          <QuickMetric label="Cobertura" value="Saldos + movimientos" />
          <QuickMetric label="Valor" value="Liquidez en tiempo real" />
          <div className="rounded-[24px] bg-white px-6 py-5 text-[#404040] shadow-[0_18px_50px_rgba(20,31,37,0.08)]">
            <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-[#8E8E8E]">Qué encontrará aquí</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#F2F3F5] px-3 py-2 text-[13px] font-medium text-[#404040]">Casos de uso reales</span>
              <span className="rounded-full bg-[#F2F3F5] px-3 py-2 text-[13px] font-medium text-[#404040]">Requisitos de integración</span>
              <span className="rounded-full bg-[#F2F3F5] px-3 py-2 text-[13px] font-medium text-[#404040]">Request y response</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
