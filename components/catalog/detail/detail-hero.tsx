"use client";

import { useState } from "react";

import type { ApiDetail } from "../content/apis";

export function DetailHero({ api }: { api: ApiDetail }) {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const primaryEndpoint = api.endpoints[0];
  const summaryItems = [
    {
      label: "Acceso",
      value: "Bearer + API key",
      detail: "Token, client id y trazabilidad por request.",
    },
    {
      label: "Cobertura",
      value: api.coverage.value,
      detail: api.coverage.detail,
    },
    {
      label: "Primer consumo",
      value: primaryEndpoint ? `${primaryEndpoint.method} ${primaryEndpoint.path}` : "GET /balances",
      detail: primaryEndpoint?.description ?? "Use Sandbox para validar el flujo base antes de ampliar la integración.",
    },
    {
      label: "Ambientes",
      value: "Sandbox y Producción",
      detail: "Del descubrimiento funcional al consumo autorizado.",
    },
  ];

  const quickFacts = api.quickFacts;

  return (
    <section
      id="overview"
      className="relative mt-6 overflow-hidden rounded-[32px] border border-[#E7EAEE] bg-white px-4 py-4 shadow-[0_18px_50px_rgba(20,31,37,0.06)] sm:px-7 sm:py-7"
    >
      <div className="relative grid items-start gap-5">
        <div className="rounded-[30px] border border-[#E7EAEE] bg-[#F8F9FB] p-1">
          <div className="grid gap-8 rounded-[26px] border border-[#E7EAEE] bg-white px-5 pb-5 pt-8 sm:px-7 sm:pb-7 sm:pt-9 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-4">
                {api.heroImageSrc ? (
                  <div className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-[10px] border border-[#E7EAEE] bg-[#F8F9FB]">
                    <img src={api.heroImageSrc} alt="" className="h-6 w-6 object-contain" />
                  </div>
                ) : null}
                <span className="inline-flex items-center gap-2 rounded-full bg-[#EFFCF5] px-5 py-2 text-[14px] font-medium text-[#347659]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#55B685]" />
                  {api.status}
                </span>
                <span className="inline-flex items-center rounded-full bg-[#F3F5F7] px-5 py-2 text-[14px] font-medium text-[#404040]">
                  {api.category}
                </span>
              </div>

              <h1 className="mt-8 max-w-[700px] text-[30px] font-bold leading-[1.12] tracking-[0.4px] text-[#141F25] sm:text-[44px] sm:leading-[48px] sm:tracking-[0.9px] lg:text-[54px] lg:leading-[58px]">
                {api.name}
              </h1>
              <div className="mt-4 h-1.5 w-14 rounded-full bg-[#E1251B]" />
              <p className="mt-6 max-w-[720px] text-[17px] leading-7 tracking-[0.22px] text-[#404040] sm:text-[21px] sm:leading-9 lg:text-[23px]">
                {api.heroDescription}
              </p>
              <p className="mt-7 max-w-[660px] text-[15px] leading-7 tracking-[0.24px] text-[#6A7178] sm:text-[18px] sm:leading-8">
                {api.intro}
              </p>
            </div>

            <div className="hidden xl:block">
              <div className="rounded-[28px] border border-[#E7EAEE] bg-[#F8F9FB] p-4">
                <div className="flex h-[312px] w-full items-center justify-center rounded-[22px] border border-dashed border-[#D5DAE0] bg-white px-8 text-center">
                  <p className="max-w-[240px] text-[16px] font-medium leading-7 tracking-[0.24px] text-[#8A9096]">
                    (poner algun tipo de imagen con relacion a la API)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside>
          <div className="rounded-[28px] border border-[#E7EAEE] bg-[#F8F9FB] px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.24em] text-[#8E8E8E]">Resumen ejecutivo</p>
                <h2 className="mt-2 text-[22px] font-bold tracking-[0.4px] text-[#141F25] sm:text-[26px]">Lo esencial para evaluar esta API</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsSummaryOpen((current) => !current)}
                className="inline-flex h-11 w-11 shrink-0 self-center items-center justify-center rounded-full border border-[#E7EAEE] bg-white text-[#141F25] transition-all duration-300 hover:border-[#E1251B]/30 hover:text-[#E1251B]"
                aria-expanded={isSummaryOpen}
                aria-label={isSummaryOpen ? "Ocultar resumen ejecutivo" : "Mostrar resumen ejecutivo"}
              >
                <svg
                  className={`h-4 w-4 transition-transform duration-300 ${isSummaryOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M4 6.5L8 10.5L12 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div
              className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
                isSummaryOpen ? "mt-6 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[420px] text-[14px] leading-6 text-[#6A7178]">
                  Contexto rápido para equipos que necesitan validar alcance, acceso y preparación técnica.
                </p>

                <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {summaryItems.map((item) => (
                    <div key={item.label} className="rounded-[22px] border border-[#E7EAEE] bg-white px-5 py-5">
                      <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">{item.label}</p>
                      <p className="mt-3 text-[22px] font-bold leading-8 tracking-[0.24px] text-[#141F25]">{item.value}</p>
                      <p className="mt-3 text-[13px] leading-6 text-[#6A7178]">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickFacts.map((item) => (
            <div
              key={item.label}
              className="rounded-[24px] border border-[#E7EAEE] bg-white px-5 py-4 text-[#404040] shadow-[0_10px_28px_rgba(20,31,37,0.04)]"
            >
              <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">{item.label}</p>
              <p className="mt-2 text-[20px] font-bold leading-7 tracking-[0.2px] text-[#202A31] sm:text-[22px] sm:leading-8">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
