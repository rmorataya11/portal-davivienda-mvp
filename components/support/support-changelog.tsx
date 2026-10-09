"use client";

import { useLocale, useTranslations } from "next-intl";

import { SectionContainer } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { parseCalendarDate } from "@/lib/format/date";
import { changelogEntries } from "@/lib/support/changelog";

function formatDate(value: string, locale: string) {
  const parsed = parseCalendarDate(value);
  if (!parsed) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(parsed)
    .replace(/\./g, "");
}

export function SupportChangelog() {
  const t = useTranslations("Support.changelog");
  const locale = useLocale();
  const entries = [...changelogEntries].sort((left, right) => right.date.localeCompare(left.date));

  return (
    <section id="novedades" className="scroll-anchor pt-[125px] pb-16 sm:pb-20">
      <SectionContainer>
        <Reveal className="overflow-visible">
          {/*
            pt-[125px] de la section = espacio desde guías hasta la card.
            La cabeza asoma dentro de esos 125px (sin sumar otro padding).
          */}
          <div className="relative overflow-visible">
            <div className="relative min-h-[310px] overflow-hidden rounded-2xl bg-white sm:min-h-[340px]">
              <div className="relative z-10 w-full max-w-[640px] px-6 py-8 sm:px-8">
                <h2 className="text-[24px] font-bold leading-8 tracking-[0.2px] text-[#404040] sm:text-[30px] sm:leading-9">
                  {t("title")}
                </h2>
                <p className="mt-4 whitespace-pre-line text-[15px] leading-6 text-[#8E8E8E]">
                  {t("description")}
                </p>

                <div className="mt-4 h-px w-[min(100%,528px)] bg-[#D0D4D8]" aria-hidden="true" />

                <ol className="mt-4 divide-y divide-[#D0D4D8]">
                  {entries.map((entry) => (
                    <li key={entry.id} className="pt-4 first:pt-0">
                      <p className="text-[13px] text-[#8E8E8E]">
                        <time dateTime={entry.date}>{formatDate(entry.date, locale)}</time>
                        {entry.apiAffected ? ` ${entry.apiAffected}` : null}
                      </p>
                      <h3 className="mt-3 text-[15px] font-semibold tracking-[0.2px] text-[#404040]">
                        {t(`entries.${entry.id}.title`)}
                      </h3>
                      <p className="mt-2 whitespace-pre-line text-[15px] leading-6 text-[#8E8E8E]">
                        {t(`entries.${entry.id}.description`)}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="pointer-events-none absolute right-0 bottom-0 z-20 hidden h-[calc(100%+2.5rem)] w-[min(52%,560px)] overflow-x-clip sm:block">
              <img
                src="/home/images/modelo_mujer.png?v=2"
                alt=""
                aria-hidden="true"
                className="absolute right-0 bottom-0 h-full w-auto max-w-none"
              />
            </div>
          </div>
        </Reveal>
      </SectionContainer>
    </section>
  );
}
