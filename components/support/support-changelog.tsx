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
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export function SupportChangelog() {
  const t = useTranslations("Support.changelog");
  const locale = useLocale();
  const entries = [...changelogEntries].sort((left, right) => right.date.localeCompare(left.date));

  return (
    <section id="novedades" className="scroll-anchor pb-16 sm:pb-20">
      <SectionContainer>
        <Reveal>
          <div className="relative min-h-[310px] overflow-hidden rounded-2xl bg-white">
            <div
              className="pointer-events-none absolute right-0 bottom-0 hidden h-[82%] w-[40%] rounded-tl-[999px] bg-[#FFE8E7] sm:block"
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-[590px] px-6 py-8 sm:px-8">
              <h2 className="text-[24px] font-bold leading-8 tracking-[0.2px] text-[#404040] sm:text-[30px] sm:leading-9">{t("title")}</h2>
              <p className="mt-4 text-[15px] leading-6 text-[#8E8E8E]">{t("description")}</p>

              <ol className="mt-4 divide-y divide-[#D0D4D8] border-t border-[#D0D4D8]">
                {entries.map((entry) => (
                  <li key={entry.id} className="pt-4">
                    <div className="flex flex-wrap items-center gap-x-2 text-[13px] text-[#8E8E8E]">
                      <time dateTime={entry.date}>{formatDate(entry.date, locale)}</time>
                      {entry.apiAffected ? <span>{entry.apiAffected}</span> : null}
                    </div>
                    <h3 className="mt-3 text-[15px] font-semibold tracking-[0.2px] text-[#404040]">
                      {t(`entries.${entry.id}.title`)}
                    </h3>
                    <p className="mt-2 text-[15px] leading-6 text-[#8E8E8E]">{t(`entries.${entry.id}.description`)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </SectionContainer>
    </section>
  );
}
