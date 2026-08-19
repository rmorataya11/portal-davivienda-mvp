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
      className="relative mt-6 overflow-hidden rounded-[32px] bg-[linear-gradient(125deg,rgba(20,31,37,0.96)_0%,rgba(40,50,56,0.93)_48%,rgba(127,17,32,0.82)_100%)] px-4 py-4 text-white shadow-[0_28px_80px_rgba(20,31,37,0.18)] sm:px-7 sm:py-7"
    >
      <div className="absolute -right-20 top-[-40px] h-[240px] w-[240px] rounded-full border border-white/10" />
      <div className="absolute right-16 top-16 h-[110px] w-[110px] rounded-full bg-[#E1251B]/14 blur-3xl" />
      <div className="absolute inset-x-10 bottom-0 h-24 bg-[radial-gradient(circle_at_center,rgba(225,37,27,0.14),transparent_72%)]" />

      <div className="relative grid items-start gap-5">
        <div className="rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-1">
          <div className="grid gap-8 rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(18,25,30,0.4),rgba(18,25,30,0.14))] px-5 pb-5 pt-8 sm:px-7 sm:pb-7 sm:pt-9 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
            <div>
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

              <h1 className="mt-8 max-w-[700px] text-[40px] font-bold leading-[44px] tracking-[0.6px] text-white sm:text-[54px] sm:leading-[58px] sm:tracking-[0.9px]">
                {api.name}
              </h1>
              <p className="mt-6 max-w-[720px] text-[19px] leading-8 tracking-[0.22px] text-white/92 sm:text-[23px] sm:leading-9">
                {api.heroDescription}
              </p>
              <p className="mt-7 max-w-[660px] text-[16px] leading-8 tracking-[0.24px] text-white/70 sm:text-[18px]">
                {api.intro}
              </p>

            </div>

            <div className="hidden xl:block">
              <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[0_22px_52px_rgba(0,0,0,0.14)]">
                <div className="flex h-[312px] w-full items-center justify-center rounded-[22px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-8 text-center">
                  <p className="max-w-[240px] text-[18px] font-medium leading-8 tracking-[0.24px] text-white/72">
                    (poner algun tipo de imagen con relacion a la API)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside>
          <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] px-5 py-5 backdrop-blur-[2px] sm:px-6 sm:py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.24em] text-white/58">Resumen ejecutivo</p>
                <h2 className="mt-2 text-[26px] font-bold tracking-[0.4px] text-white">Lo esencial para evaluar esta API</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsSummaryOpen((current) => !current)}
                className="inline-flex h-11 w-11 shrink-0 self-center items-center justify-center rounded-full border border-white/10 bg-white/8 text-white transition-all duration-300 hover:bg-white/12"
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
                <p className="max-w-[340px] text-[14px] leading-6 text-white/62">
                  Contexto rápido para equipos que necesitan validar alcance, acceso y preparación técnica.
                </p>

                <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {summaryItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] px-5 py-5"
                    >
                      <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-white/56">{item.label}</p>
                      <p className="mt-3 text-[22px] font-bold leading-8 tracking-[0.24px] text-white">{item.value}</p>
                      <p className="mt-3 text-[13px] leading-6 text-white/66">{item.detail}</p>
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
              className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(248,249,251,0.78))] px-5 py-4 text-[#404040] shadow-[0_18px_44px_rgba(20,31,37,0.08)] backdrop-blur-[2px]"
            >
              <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">{item.label}</p>
              <p className="mt-2 max-w-[176px] text-[22px] font-bold leading-8 tracking-[0.2px] text-[#202A31]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
