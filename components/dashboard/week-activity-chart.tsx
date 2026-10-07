"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, type ReactNode } from "react";

const WEEK_DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const EMPTY_BAR_SCALE = 0.03;

export function WeekActivityChart({
  values,
  filter,
  filterKey,
}: {
  values: number[];
  filter?: ReactNode;
  filterKey?: string;
}) {
  const t = useTranslations("Dashboard.chart");
  const locale = useLocale();
  const numberLocale = locale === "en" ? "en-US" : "es";
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    setGrown(false);
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setGrown(true));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [filterKey]);
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[#8E8E8E]">{t("title")}</p>
          <p className="mt-1 text-[15px] font-semibold text-[#404040]">
            {t("calls", { count: total.toLocaleString(numberLocale) })}
          </p>
        </div>
        <div className="flex min-w-0 flex-col gap-2 sm:items-end">
          {filter ? <div className="w-full min-w-0 sm:w-auto">{filter}</div> : null}
          <p className="text-[12px] leading-5 text-[#8E8E8E] sm:max-w-[220px] sm:text-right">
            {total === 0 ? t("noTraffic") : t("peak", { day: t(`days.${WEEK_DAY_KEYS[peakIndex]}`) })}
          </p>
        </div>
      </div>

      <div className="mt-5 flex min-h-[200px] flex-1 gap-2 sm:mt-6 sm:min-h-[220px] sm:gap-3">
        <div className="flex w-7 shrink-0 flex-col justify-between pb-6 text-right text-[10px] tabular-nums text-[#8E8E8E] sm:w-8 sm:pb-7">
          <span>{maxValue}</span>
          <span>{midValue}</span>
          <span>0</span>
        </div>

        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-6 sm:bottom-7">
            <div className="absolute inset-x-0 top-0 h-px bg-[#F2F3F5]" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#F2F3F5]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-[#F2F3F5]" />
          </div>

          <div className="flex h-[calc(100%-24px)] min-h-[160px] items-end sm:h-[calc(100%-28px)]">
            {WEEK_DAY_KEYS.map((day, index) => {
              const value = values[index] ?? 0;
              const target = value === 0 ? EMPTY_BAR_SCALE : Math.max(value / maxValue, EMPTY_BAR_SCALE);
              const scale = grown ? target : 0;
              const isToday = index === todayIndex;
              const tooltipAlign =
                index === 0 ? "left-0" : index === WEEK_DAY_KEYS.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2";

              return (
                <div key={day} className="group relative flex h-full min-w-0 flex-1 items-end justify-center px-px sm:px-0.5">
                  <div
                    className={`pointer-events-none absolute -top-8 z-10 rounded-md bg-[#2C2C2C] px-2 py-1 text-[11px] font-medium whitespace-nowrap text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 ${tooltipAlign}`}
                  >
                    {t("calls", { count: value.toLocaleString(numberLocale) })}
                  </div>
                  <div className="relative h-full w-full max-w-[28px] sm:max-w-[40px] md:max-w-[56px] lg:max-w-[70px]">
                    <div
                      className={`absolute inset-x-0 bottom-0 h-full origin-bottom rounded-[4px] transition-transform duration-700 ease-out ${
                        isToday ? "bg-[#E1251B]" : "bg-[#8E8E8E]"
                      }`}
                      style={{ transform: `scaleY(${scale})` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex">
            {WEEK_DAY_KEYS.map((day) => (
              <span key={day} className="min-w-0 flex-1 truncate text-center text-[10px] text-[#8E8E8E] sm:text-[11px]">
                {t(`days.${day}`)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
