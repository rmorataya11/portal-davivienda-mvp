"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { BreakablePath } from "@/components/ui/breakable-path";
import type { CatalogView } from "@/lib/catalog/present";

import { CatalogGlyph } from "../catalog-glyph";
import { catalogCategoryLabel, catalogStatusLabel } from "../content/localize-api";

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

function DescriptionText({ text }: { text: string }) {
  const [firstLine, secondLine] = text.split("\n");

  if (!secondLine) {
    return text;
  }

  return (
    <>
      {firstLine}
      <br className="hidden md:block" /> {secondLine}
    </>
  );
}

export function DetailHero({ api }: { api: CatalogView }) {
  const t = useTranslations("Catalog.detail");
  const catalogT = useTranslations("Catalog");
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const iconSrc = api.icon;
  const primaryEndpoint = api.endpoints[0];
  const summaryItems: Array<{ label: string; value: string; path?: string; detail?: string }> = [
    {
      label: t("facts.access"),
      value: t("facts.accessValue"),
    },
    {
      label: t("facts.coverage"),
      value: api.coverage.value,
      detail: api.coverage.detail,
    },
    {
      label: t("facts.firstCall"),
      value: primaryEndpoint?.method ?? "GET",
      path: primaryEndpoint?.path,
      detail: primaryEndpoint?.description ?? t("facts.firstCallFallback"),
    },
    {
      label: t("facts.environments"),
      value: t("facts.environmentsValue"),
      detail: t("facts.environmentsDetail"),
    },
  ];

  return (
    <div className="mt-4 grid gap-4">
      <section
        id="overview"
        className="scroll-anchor flex min-h-[200px] items-center rounded-2xl bg-white px-5 py-6 sm:px-8 sm:py-8 lg:min-h-[278px] lg:px-10"
      >
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="flex min-w-0 items-start gap-5">
            <div className="inline-flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-[#F2F3F5] sm:h-[98px] sm:w-[98px]">
              {iconSrc ? <img src={iconSrc} alt="" className="h-12 w-12 object-contain sm:h-16 sm:w-16" /> : <ApiGlyph />}
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
                  <CatalogGlyph src="/catag/main/filter.svg" className="h-6 w-6" />
                  {catalogCategoryLabel(api.category, catalogT)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#EFFCF5] px-3 py-1 text-[13px] font-medium text-[#347659]">
                  <span className="h-2 w-2 rounded-full bg-[#55B685]" />
                  {catalogStatusLabel(api.status, catalogT)}
                </span>
              </div>
            </div>
          </div>

          <Link
            href={`/solicitud-contratacion?producto=${api.slug}`}
            className="inline-flex h-[46px] w-full shrink-0 items-center justify-center rounded-[30px] bg-[#E1251B] text-[14px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)] sm:w-[246px]"
          >
            {t("requestAccess")}
          </Link>
        </div>
      </section>

      <aside className="rounded-2xl border border-[#E7EAEE] bg-white px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-[#E1251B]">{t("summaryEyebrow")}</p>
            <h2 className="mt-2 text-[22px] font-bold tracking-[0.3px] text-[#404040] sm:text-[26px]">
              {t("summaryTitle")}
            </h2>
            <p className="mt-2 max-w-[640px] text-[14px] font-normal leading-6 text-[#8E8E8E] sm:text-[15px]">
              {t("summaryDescription")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsSummaryOpen((current) => !current)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E7EAEE] bg-white text-[#404040] transition-all duration-300 hover:border-[#E1251B]/30 hover:text-[#E1251B]"
            aria-expanded={isSummaryOpen}
            aria-label={isSummaryOpen ? t("hideSummary") : t("showSummary")}
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
          <div className="min-w-0 overflow-hidden">
            <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {summaryItems.map((item) => (
                <div
                  key={item.label}
                  className="flex min-h-[132px] min-w-0 flex-col rounded-[16px] border border-[#E7EAEE] px-5 py-5"
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8E8E8E]">{item.label}</p>
                  <p className="mt-3 min-w-0 text-[18px] font-bold leading-7 tracking-[0.2px] text-[#404040] sm:text-[20px]">
                    {item.value}
                  </p>
                  {item.path ? (
                    <p className="mt-1 min-w-0 w-full font-mono text-[12px] leading-5 text-[#404040] sm:text-[13px]">
                      <BreakablePath value={item.path} />
                    </p>
                  ) : null}
                  {item.detail ? (
                    <p className="mt-auto min-w-0 w-full pt-3 text-[13px] font-normal leading-5 text-[#8E8E8E]">
                      {item.detail.includes("/") ? <BreakablePath value={item.detail} /> : item.detail}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="my-6 h-px bg-[#E7EAEE]" />

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {api.quickFacts.map((item) => (
                <div key={item.label} className="min-w-0 rounded-[16px] bg-[#F5F6F8] px-5 py-4">
                  <p className="text-[13px] font-normal text-[#8E8E8E]">{item.label}</p>
                  <p className="mt-2 text-[16px] font-bold tracking-[0.2px] text-[#404040] sm:text-[18px]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
