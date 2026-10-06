"use client";

import { useLocale, useTranslations } from "next-intl";

const WEEK_DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const EMPTY_BAR_HEIGHT = 6;

export function WeekActivityChart({ values }: { values: number[] }) {
  const t = useTranslations("Dashboard.chart");
  const locale = useLocale();
  const numberLocale = locale === "en" ? "en-US" : "es";
  const dataMax = Math.max(...values, 0);
  const maxValue = Math.max(dataMax, 2);
  const midValue = Math.round(maxValue / 2);
  const total = values.reduce((sum, value) => sum + value, 0);
  const peakIndex = values.reduce((best, value, index, list) => (value > list[best] ? index : best), 0);
  const todayIndex = (() => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
  })();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-medium text-[#8E8E8E]">{t("title")}</p>
          <p className="mt-1 text-[15px] font-semibold text-[#404040]">
            {t("calls", { count: total.toLocaleString(numberLocale) })}
          </p>
        </div>
        <p className="max-w-[148px] text-right text-[12px] leading-5 text-[#8E8E8E]">
          {total === 0 ? t("noTraffic") : t("peak", { day: t(`days.${WEEK_DAY_KEYS[peakIndex]}`) })}
        </p>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 gap-3">
        <div className="flex w-6 shrink-0 flex-col justify-between pb-7 text-right text-[10px] text-[#8E8E8E]">
          <span>{maxValue}</span>
          <span>{midValue}</span>
          <span>0</span>
        </div>

        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-7">
            <div className="absolute inset-x-0 top-0 h-px bg-[#F2F3F5]" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#F2F3F5]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-[#F2F3F5]" />
          </div>

          <div className="flex h-[calc(100%-28px)] items-end">
            {WEEK_DAY_KEYS.map((day, index) => {
              const value = values[index] ?? 0;
              const height = value === 0 ? EMPTY_BAR_HEIGHT : Math.max((value / maxValue) * 100, EMPTY_BAR_HEIGHT);
              const isToday = index === todayIndex && value > 0;

              return (
                <div key={day} className="group relative flex h-full flex-1 items-end justify-center">
                  <div className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded-md bg-[#2C2C2C] px-2 py-1 text-[11px] font-medium whitespace-nowrap text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                    {t("calls", { count: value.toLocaleString(numberLocale) })}
                  </div>
                  <div
                    className={`w-[70px] max-w-full rounded-[4px] transition-colors ${
                      isToday ? "bg-[#E1251B]" : "bg-[#8E8E8E]"
                    }`}
                    style={{ height: value === 0 ? `${EMPTY_BAR_HEIGHT}px` : `${height}%` }}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex">
            {WEEK_DAY_KEYS.map((day) => (
              <span key={day} className="flex-1 text-center text-[11px] text-[#8E8E8E]">
                {t(`days.${day}`)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
