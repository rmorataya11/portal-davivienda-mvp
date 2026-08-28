"use client";

import Link from "next/link";
import { useState } from "react";

import type { ApiDetail } from "../content/apis";

function ApiGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 text-[#404040]" fill="none" aria-hidden="true">
      <path
        d="M14 28c0-5 4-9 10-9s10 4 10 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 30.5h8.5c.8 0 1.5.7 1.5 1.5v5c0 .8-.7 1.5-1.5 1.5H12c-1.1 0-2-.9-2-2v-4.5c0-.8.7-1.5 1.5-1.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect x="20" y="18" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="28" cy="23" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function CategoryGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 text-[#8E8E8E]" fill="none" aria-hidden="true">
      <circle cx="4.5" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11.5" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="11.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.7 6.2 7 10.2M10.3 6.2 9 10.2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function DescriptionText({ text }: { text: string }) {
  const marker = "posición ";
  const index = text.indexOf(marker);

  if (index === -1) {
    return text;
  }

  const splitAt = index + marker.length;

  return (
    <>
      {text.slice(0, splitAt).trimEnd()}
      <br className="hidden md:block" /> {text.slice(splitAt)}
    </>
  );
}

export function DetailHero({ api }: { api: ApiDetail }) {
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const primaryEndpoint = api.endpoints[0];
  const iconSrc = api.heroImageSrc ?? api.imageSrc;
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

  return (
    <div className="mt-4 grid gap-4">
      <section
        id="overview"
        className="flex min-h-[200px] items-center rounded-2xl bg-white px-5 py-6 sm:px-8 sm:py-8 lg:h-[278px] lg:px-10"
      >
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="flex min-w-0 items-start gap-5">
            <div className="inline-flex h-[60px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F2F3F5] sm:h-[98px] sm:w-[98px]">
              {iconSrc ? <img src={iconSrc} alt="" className="h-10 w-10 object-contain" /> : <ApiGlyph />}
            </div>

            <div className="min-w-0 pt-1">
              <h1 className="text-[28px] font-bold leading-[1.15] tracking-[0.4px] text-[#404040] sm:text-[36px] sm:leading-[42px]">
                {api.name}
              </h1>
              <p className="mt-3 max-w-[720px] text-[15px] font-normal leading-6 tracking-[0.2px] text-[#8E8E8E] sm:text-[16px] sm:leading-[22px]">
                <DescriptionText text={api.description} />
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 text-[14px] font-normal text-[#8E8E8E]">
                  <CategoryGlyph />
                  {api.category}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#EFFCF5] px-3 py-1 text-[13px] font-medium text-[#347659]">
                  <span className="h-2 w-2 rounded-full bg-[#55B685]" />
                  {api.status}
                </span>
              </div>
            </div>
          </div>

          <Link
            href={`/solicitud-contratacion?producto=${api.slug}`}
            className="inline-flex h-[46px] w-full shrink-0 items-center justify-center rounded-[30px] bg-[#E1251B] text-[14px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)] sm:w-[166px]"
          >
            Solicitar
          </Link>
        </div>
      </section>

      <aside className="rounded-2xl bg-white px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium text-[#E1251B]">Resumen Ejecutivo</p>
            <h2 className="mt-2 text-[22px] font-bold tracking-[0.3px] text-[#404040] sm:text-[26px]">
              Lo esencial para evaluar esta API
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsSummaryOpen((current) => !current)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E7EAEE] bg-white text-[#404040] transition-all duration-300 hover:border-[#E1251B]/30 hover:text-[#E1251B]"
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
            isSummaryOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="max-w-[640px] text-[14px] font-normal leading-6 text-[#8E8E8E] sm:text-[15px]">
              Contexto rápido para equipos que necesitan validar alcance, acceso y preparación técnica.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {summaryItems.map((item) => (
                <div key={item.label} className="rounded-[16px] border border-[#E7EAEE] px-5 py-5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8E8E8E]">{item.label}</p>
                  <p className="mt-3 text-[18px] font-bold leading-7 tracking-[0.2px] text-[#404040] sm:text-[20px]">
                    {item.value}
                  </p>
                  <p className="mt-2 text-[13px] font-normal leading-6 text-[#8E8E8E]">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
