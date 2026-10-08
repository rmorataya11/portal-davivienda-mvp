"use client";

import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { mockCalls30, mockWeekActivity } from "@/components/mock/mockAppActivity";
import { Reveal } from "@/components/ui/reveal";
import { PRODUCTION_REQUEST_HREF, SANDBOX_REQUEST_HREF } from "@/lib/access/sandbox";
import {
  displayAppName,
  hasProductionApps,
  isProductionApp,
  isSandboxGroupApp,
} from "@/lib/developer-apps/labels";
import type { DeveloperApp } from "@/lib/developer-apps/types";

import { AppCard } from "./app-card";
import { useDeveloperApps } from "./apps-provider";
import { WeekActivityChart } from "./week-activity-chart";

const createAppButtonClassName =
  "inline-flex h-[46px] items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)]";

export function DashboardHome() {
  const { apps, ready, loadError } = useDeveloperApps();
  const { sandboxAccess } = useAuth();
  const t = useTranslations("Dashboard.home");
  const errorsT = useTranslations("Dashboard.errors");
  const locale = useLocale();
  const numberLocale = locale === "en" ? "en-US" : "es";
  const [appFilter, setAppFilter] = useState("all");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!ready) {
    return <div className="h-[320px] animate-pulse rounded-2xl bg-white md:h-[370px]" />;
  }

  const productionApps = apps.filter(isProductionApp);
  const sandboxGroupApps = apps.filter(isSandboxGroupApp);
  const showBillingSummary = hasProductionApps(apps);
  const clock = new Date(now);
  const weekActivity = mockWeekActivity(apps, appFilter, clock);
  const calls30 = mockCalls30(apps, appFilter, clock);
  const sandboxCount = apps.filter((app) => app.environment === "sandbox").length;

  return (
    <div>
      <div>
        <h1 className="text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#404040] sm:text-[36px]">
          {t("title")}
        </h1>
        <p className="mt-4 text-[16px] leading-7 tracking-[0.24px] text-[#5A5A5A]">
          {t("description")}
        </p>
      </div>

      <section
        className={`relative mt-9 flex flex-col overflow-visible rounded-2xl bg-white px-4 py-5 sm:px-8 sm:py-6 ${
          showBillingSummary ? "min-h-[320px] md:min-h-[370px]" : "min-h-[320px] md:h-[370px]"
        }`}
      >
        {showBillingSummary ? (
          <div className="mb-5">
            <p className="text-[13px] font-medium text-[#8E8E8E]">{t("consumption30")}</p>
            <p className="mt-2 max-w-[420px] text-[15px] leading-6 text-[#707070]">{t("emptyConsumption")}</p>
          </div>
        ) : null}
        <div className="min-h-0 flex-1">
          <WeekActivityChart
            values={weekActivity}
            filterKey={appFilter}
            filter={
              apps.length > 0 ? (
                <ChartAppFilter apps={apps} value={appFilter} onChange={setAppFilter} />
              ) : null
            }
          />
        </div>
      </section>

      {loadError ? <p className="mt-5 text-[14px] leading-6 text-[#E1251B]">{errorsT("loadFailed")}</p> : null}

      <div className="relative mt-12 flex items-center py-6 before:pointer-events-none before:absolute before:inset-y-0 before:left-1/2 before:w-screen before:-translate-x-1/2 before:bg-[#404040] md:mt-[84px] md:h-[201px] md:py-0">
        <div className="relative grid w-full grid-cols-1 items-center gap-4 md:grid-cols-3">
          <Reveal delay={0}>
            <MiniStat label={t("applications")} value={String(apps.length)} />
          </Reveal>
          <Reveal delay={80}>
            <MiniStat label={t("inSandbox")} value={String(sandboxCount)} />
          </Reveal>
          <Reveal delay={160}>
            <MiniStat label={t("calls30")} value={calls30.toLocaleString(numberLocale)} />
          </Reveal>
        </div>
      </div>

      <div className="mt-12 md:mt-[80px]">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <h2 className="text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#404040] sm:text-[36px] lg:text-[40px] lg:leading-[44px] lg:tracking-[0.8px]">
            {t("yourApps")}
          </h2>
          {apps.length > 0 && sandboxAccess ? (
            <Link href="/dashboard/apps/nueva" className={`${createAppButtonClassName} w-full sm:w-auto`}>
              {t("createApp")}
            </Link>
          ) : null}
        </div>
        {apps.length === 0 ? (
          <div className="flex w-full flex-col items-center rounded-2xl bg-white px-5 py-16 sm:px-8 sm:pt-20 sm:pb-5 md:min-h-[545px]">
            <img src="/miss_apps/mis_apps.svg" alt="" className="h-[178px] w-[160px]" />
            <h3 className="mt-2 text-center text-[22px] font-bold leading-7 tracking-[0.48px] text-[#404040] sm:text-[24px]">
              {sandboxAccess ? t("emptyTitle") : t("emptyPendingTitle")}
            </h3>
            <p className="mt-3 w-full max-w-[620px] text-center text-[15px] font-normal leading-6 tracking-[0.32px] text-[#8E8E8E] sm:text-left sm:text-[16px]">
              {sandboxAccess ? t("emptyDescription") : t("emptyPendingDescription")}
            </p>
            <Link
              href={sandboxAccess ? "/dashboard/apps/nueva" : SANDBOX_REQUEST_HREF}
              className="mt-8 inline-flex h-[46px] w-full max-w-[280px] items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)]"
            >
              {sandboxAccess ? t("createApp") : t("requestSandbox")}
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <EnvironmentSection
              title={t("sandboxSection", { count: sandboxGroupApps.length })}
              dotClassName="bg-[#F59E0B]"
            >
              {sandboxCount > 0 ? (
                <p className="mb-4 text-[13px] leading-6 text-[#8E8E8E]">{t("sandboxBillingNote")}</p>
              ) : null}
              {sandboxGroupApps.length > 0 ? (
                <AppGrid apps={sandboxGroupApps} />
              ) : (
                <p className="rounded-[16px] border border-[#E7EAEE] bg-white px-5 py-8 text-[15px] leading-7 text-[#6A7178]">
                  {t("emptySandbox")}
                </p>
              )}
            </EnvironmentSection>

            <EnvironmentSection
              title={t("productionSection", { count: productionApps.length })}
              dotClassName="bg-[#55B685]"
            >
              {productionApps.length > 0 ? (
                <AppGrid apps={productionApps} />
              ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[16px] border border-dashed border-[#D5DAE0] bg-white px-8 py-12 text-center">
                  <img src="/miss_apps/apps_prod.svg" alt="" className="h-[160px] w-[160px] object-contain" />
                  <p className="mt-5 max-w-[420px] text-[15px] leading-7 text-[#6A7178]">{t("emptyProduction")}</p>
                  <Link
                    href={sandboxAccess ? PRODUCTION_REQUEST_HREF : SANDBOX_REQUEST_HREF}
                    className="mt-6 inline-flex h-[46px] items-center justify-center rounded-[30px] border border-[#E1251B] bg-transparent px-6 text-[14px] font-semibold text-[#E1251B] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#FFF8F8]"
                  >
                    {sandboxAccess ? t("requestContracting") : t("requestSandbox")}
                  </Link>
                </div>
              )}
            </EnvironmentSection>
          </div>
        )}
      </div>
    </div>
  );
}

function ChartAppFilter({
  apps,
  value,
  onChange,
}: {
  apps: DeveloperApp[];
  value: string;
  onChange: (next: string) => void;
}) {
  const chartT = useTranslations("Dashboard.chart");
  const statusT = useTranslations("Dashboard.status");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const options = [
    { id: "all", label: chartT("filterAll"), detail: "" },
    ...apps.map((app) => ({
      id: app.id,
      label: displayAppName(app.name),
      detail: statusT(app.environment),
    })),
  ];
  const current = options.find((option) => option.id === value) ?? options[0];

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative w-full sm:w-auto">
      <button
        type="button"
        aria-label={chartT("filterLabel")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-full border border-[#D5DAE0] bg-white px-4 text-left text-[13px] font-medium text-[#404040] sm:w-[240px]"
      >
        <span className="min-w-0 truncate">{current.label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#8E8E8E] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div
          id={menuId}
          role="listbox"
          className="absolute top-full right-0 left-0 z-30 mt-2 overflow-hidden rounded-[12px] border border-[#E7EAEE] bg-white py-1 shadow-[0_16px_40px_rgba(20,31,37,0.16)] sm:left-auto sm:w-[260px]"
        >
          {options.map((option) => {
            const selected = option.id === value;

            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors ${
                  selected ? "bg-[#FFF1F0] text-[#E1251B]" : "text-[#404040] hover:bg-[#F8F9FB]"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium">{option.label}</span>
                  {option.detail ? (
                    <span className={`mt-0.5 block truncate text-[12px] ${selected ? "text-[#E1251B]/70" : "text-[#8E8E8E]"}`}>
                      {option.detail}
                    </span>
                  ) : null}
                </span>
                {selected ? <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[100px] flex-col rounded-2xl bg-[#5A5A5A] px-6 py-6 md:h-[137px] md:pt-8 md:pr-6 md:pb-[47px] md:pl-8">
      <p className="text-[14px] leading-none text-white">{label}</p>
      <p className="mt-1 text-[28px] font-bold leading-none text-white">{value}</p>
    </div>
  );
}

function EnvironmentSection({
  title,
  dotClassName,
  children,
}: {
  title: string;
  dotClassName: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-4 flex items-center gap-2 text-[16px] font-semibold tracking-[0.2px] text-[#141F25]">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClassName}`} aria-hidden="true" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function AppGrid({ apps }: { apps: DeveloperApp[] }) {
  return (
    <div className="grid gap-[15px] md:grid-cols-2 xl:grid-cols-3">
      {apps.map((app, index) => (
        <Reveal key={app.id} delay={(index % 3) * 80} className="h-full">
          <AppCard app={app} />
        </Reveal>
      ))}
    </div>
  );
}
