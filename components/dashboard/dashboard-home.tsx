"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, type ReactNode } from "react";

import { mockCalls30, mockWeekActivity } from "@/components/mock/mockAppActivity";
import { Reveal } from "@/components/ui/reveal";
import { hasProductionApps, isProductionApp, isSandboxGroupApp } from "@/lib/developer-apps/labels";
import type { DeveloperApp } from "@/lib/developer-apps/types";

import { AppCard } from "./app-card";
import { useDeveloperApps } from "./apps-provider";
import { WeekActivityChart } from "./week-activity-chart";

const createAppButtonClassName =
  "inline-flex h-[46px] items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)]";

export function DashboardHome() {
  const { apps, ready, loadError } = useDeveloperApps();
  const t = useTranslations("Dashboard.home");
  const chartT = useTranslations("Dashboard.chart");
  const statusT = useTranslations("Dashboard.status");
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
    return <div className="h-[370px] animate-pulse rounded-2xl bg-white" />;
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
        className={`mt-9 flex flex-col rounded-2xl bg-white px-6 py-6 sm:px-8 ${
          showBillingSummary ? "min-h-[370px]" : "h-[370px]"
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
                <>
                  <label className="sr-only" htmlFor="dashboard-app-filter">
                    {chartT("filterLabel")}
                  </label>
                  <select
                    id="dashboard-app-filter"
                    value={appFilter}
                    onChange={(event) => setAppFilter(event.target.value)}
                    className="h-10 max-w-[240px] truncate rounded-full border border-[#D5DAE0] bg-white px-4 text-[13px] font-medium text-[#404040]"
                  >
                    <option value="all">{chartT("filterAll")}</option>
                    {apps.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.name} · {statusT(app.environment)}
                      </option>
                    ))}
                  </select>
                </>
              ) : null
            }
          />
        </div>
      </section>

      {loadError ? <p className="mt-5 text-[14px] leading-6 text-[#E1251B]">{errorsT("loadFailed")}</p> : null}

      <div className="relative mt-[84px] py-8 before:absolute before:inset-y-0 before:left-1/2 before:w-screen before:max-w-[100vw] before:-translate-x-1/2 before:bg-[#404040] md:h-[201px] md:py-0">
        <div className="relative grid h-full grid-cols-1 items-center gap-4 md:grid-cols-3">
          <Reveal delay={0} className="h-full">
            <MiniStat label={t("applications")} value={String(apps.length)} />
          </Reveal>
          <Reveal delay={80} className="h-full">
            <MiniStat label={t("inSandbox")} value={String(sandboxCount)} />
          </Reveal>
          <Reveal delay={160} className="h-full">
            <MiniStat label={t("calls30")} value={calls30.toLocaleString(numberLocale)} />
          </Reveal>
        </div>
      </div>

      <div className="mt-[80px]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[40px] font-bold leading-[44px] tracking-[0.8px] text-[#404040]">{t("yourApps")}</h2>
          {apps.length > 0 ? (
            <Link href="/dashboard/apps/nueva" className={createAppButtonClassName}>
              {t("createApp")}
            </Link>
          ) : null}
        </div>
        {apps.length === 0 ? (
          <div className="flex h-[545px] w-full flex-col items-center rounded-2xl bg-white px-8 pt-20 pb-5">
            <img src="/miss_apps/mis_apps.svg" alt="" className="h-[178px] w-[160px]" />
            <h3 className="mt-2 text-center text-[24px] font-bold leading-7 tracking-[0.48px] text-[#404040]">
              {t("emptyTitle")}
            </h3>
            <p className="mt-3 w-full max-w-[620px] text-left text-[16px] font-normal leading-6 tracking-[0.32px] text-[#8E8E8E]">
              {t("emptyDescription")}
            </p>
            <Link
              href="/dashboard/apps/nueva"
              className="mt-8 inline-flex h-[46px] w-[233px] items-center justify-center rounded-[30px] bg-[#E1251B] text-[14px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)]"
            >
              {t("createApp")}
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
                    href="/solicitud-contratacion"
                    className="mt-6 inline-flex h-[46px] items-center justify-center rounded-[30px] border border-[#E1251B] bg-transparent px-6 text-[14px] font-semibold text-[#E1251B] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#FFF8F8]"
                  >
                    {t("requestContracting")}
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

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-[137px] flex-col rounded-2xl bg-[#5A5A5A] pt-8 pr-6 pb-[47px] pl-8">
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
