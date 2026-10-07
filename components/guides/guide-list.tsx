"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import { localizeGuides } from "@/components/guides/localize-guide";
import { Reveal } from "@/components/ui/reveal";
import { guides, type GuideIconId } from "@/lib/guides/guides-content";

const guideIconPaths: Partial<Record<GuideIconId, string>> = {
  shield: "/soporte/icons_soporte/seguridad.svg",
  retry: "/soporte/icons_soporte/operacion1.svg",
  cloud: "/soporte/icons_soporte/produccion.svg",
  alert: "/soporte/icons_soporte/operacion2.svg",
};

export function GuideList() {
  const t = useTranslations("Support");
  const localizedGuides = localizeGuides(guides, t);

  return (
    <div className="relative overflow-x-clip py-7 before:absolute before:inset-y-0 before:left-1/2 before:w-screen before:max-w-[100vw] before:-translate-x-1/2 before:bg-white">
      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
        {localizedGuides.map((guide, index) => (
          <Reveal key={guide.id} delay={(index % 2) * 80}>
            <Link
              href={`/soporte/guias/${guide.slug}`}
              id={`guia-${guide.slug}`}
              className="group scroll-anchor flex h-[118px] items-center gap-4 rounded-2xl border border-[#8E8E8E] bg-white p-5 transition-colors hover:bg-[#F8F9FB]"
            >
              <img
                src={guideIconPaths[guide.icon] ?? "/soporte/icons_soporte/guias.svg"}
                alt=""
                className="h-[46px] w-[46px] shrink-0"
              />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#8E8E8E]">
                    {guide.category} {guide.number}
                  </span>
                  {!guide.article ? (
                    <span className="rounded-full bg-[#F2F3F5] px-2.5 py-1 text-[11px] font-medium text-[#8E8E8E]">
                      {t("guides.comingSoon")}
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 block text-[14px] font-semibold leading-5 text-[#404040]">
                  {guide.title}
                </span>
                <span className="mt-0.5 block text-[11px] leading-4 text-[#8E8E8E]">
                  {t("guides.levelMeta", {
                    level: t(`guides.levels.${guide.level}`),
                    minutes: guide.minutes,
                  })}
                </span>
              </span>
              <ArrowIcon />
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 shrink-0 text-[#8E8E8E] transition-colors group-hover:text-[#404040]"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path d="m10.5 8.8 3.2 3.2-3.2 3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
