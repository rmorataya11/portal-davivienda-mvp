"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import { localizeGuides } from "@/components/guides/localize-guide";
import { GuideIcon } from "@/components/guides/guide-icons";
import { guides } from "@/lib/guides/guides-content";

export function GuideList() {
  const t = useTranslations("Faq");
  const localizedGuides = localizeGuides(guides, t);

  return (
    <div className="divide-y divide-[#E7EAEE] overflow-hidden rounded-[24px] border border-[#E7EAEE] bg-white">
      {localizedGuides.map((guide) => (
        <article key={guide.id} id={`guia-${guide.slug}`} className="scroll-anchor">
          <Link
            href={`/soporte/guias/${guide.slug}`}
            className="group flex w-full items-center gap-4 px-5 py-5 transition-colors hover:bg-[#F8F9FB] sm:px-7"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#FFF1F0] text-[#E1251B]">
              <GuideIcon id={guide.icon} className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#E1251B]">
                  {guide.category} · {guide.number}
                </span>
                {!guide.article ? (
                  <span className="rounded-full bg-[#F2F3F5] px-2.5 py-1 text-[11px] font-medium text-[#707070]">
                    {t("guides.comingSoon")}
                  </span>
                ) : null}
              </span>
              <span className="mt-1 block text-[17px] font-bold leading-6 text-[#404040] sm:text-[18px]">
                {guide.title}
              </span>
              <span className="mt-1 block text-[13px] leading-5 text-[#8E8E8E]">
                {t("guides.levelMeta", {
                  level: t(`guides.levels.${guide.level}`),
                  minutes: guide.minutes,
                })}
              </span>
            </span>
            <ArrowIcon />
          </Link>
        </article>
      ))}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-5 w-5 shrink-0 text-[#8E8E8E] transition-transform group-hover:translate-x-0.5 group-hover:text-[#404040]"
      fill="none"
      aria-hidden="true"
    >
      <path d="M4.5 10h11M11 5.5l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
