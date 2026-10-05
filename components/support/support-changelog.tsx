"use client";

import { useLocale, useTranslations } from "next-intl";

import { SectionContainer } from "@/components/ui/layout";
import { parseCalendarDate } from "@/lib/format/date";
import { changelogEntries, type ChangelogType } from "@/lib/support/changelog";

const typeClass: Record<ChangelogType, string> = {
  nuevo: "bg-[#EFFCF5] text-[#347659]",
  cambio: "bg-[#FFF8EC] text-[#C47B17]",
  deprecacion: "bg-[#FFE9E9] text-[#A11B1B]",
};

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
        <h2 className="mb-4 text-[22px] font-bold tracking-[0.2px] text-[#404040]">{t("title")}</h2>
        <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-5 py-6 sm:px-8 sm:py-7">
          <p className="text-[15px] leading-7 text-[#707070]">{t("description")}</p>

          <ol className="mt-6 divide-y divide-[#E7EAEE] border-t border-[#E7EAEE]">
            {entries.map((entry) => (
              <li key={entry.id} className="py-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <time dateTime={entry.date} className="font-mono text-[12px] text-[#8E8E8E]">
                    {formatDate(entry.date, locale)}
                  </time>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-medium ${typeClass[entry.type]}`}
                  >
                    {t(`types.${entry.type}`)}
                  </span>
                  {entry.apiAffected ? (
                    <span className="font-mono text-[12px] text-[#707070]">{entry.apiAffected}</span>
                  ) : null}
                </div>
                <h3 className="mt-2 text-[16px] font-semibold tracking-[0.2px] text-[#404040]">
                  {t(`entries.${entry.id}.title`)}
                </h3>
                <p className="mt-2 text-[15px] leading-7 text-[#707070]">{t(`entries.${entry.id}.description`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </SectionContainer>
    </section>
  );
}
