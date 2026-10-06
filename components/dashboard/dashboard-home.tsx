"use client";

import { AppWindow, Rocket } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

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
  const errorsT = useTranslations("Dashboard.errors");
  const locale = useLocale();
  const numberLocale = locale === "en" ? "en-US" : "es";

  if (!ready) {
    return <div className="h-64 animate-pulse rounded-[24px] bg-white" />;
  }

  const productionApps = apps.filter(isProductionApp);
  const sandboxGroupApps = apps.filter(isSandboxGroupApp);
  const showBillingSummary = hasProductionApps(apps);
  const weekActivity = [0, 0, 0, 0, 0, 0, 0];
  const sandboxCount = apps.filter((app) => app.environment === "sandbox").length;

  return (
    <div>
      <div>
        <h1 className="text-[30px] font-bold leading-[1.1] tracking-[0.8px] text-[#404040] sm:text-[40px] sm:leading-[44px]">
          {t("title")}
        </h1>
        <p className="mt-6 text-[17px] leading-7 tracking-[0.02em] text-[#404040] sm:mt-[32px] sm:text-[20px] sm:leading-6">
          {t("description")}
        </p>
      </div>

      <section className="mt-8 overflow-hidden rounded-[32px] border border-[#E7EAEE] bg-white shadow-[0_18px_50px_rgba(20,31,37,0.06)]">
        <div className={showBillingSummary ? "grid xl:grid-cols-[1.15fr_0.85fr]" : undefined}>
          {showBillingSummary ? (
            <div className="px-6 py-7 sm:px-8 sm:py-8">
              <p className="text-[13px] font-medium text-[#8E8E8E]">{t("consumption30")}</p>
              <p className="mt-3 max-w-[420px] text-[16px] leading-7 text-[#6A7178]">{t("emptyConsumption")}</p>
            </div>
          ) : null}

          <div
            className={
              showBillingSummary
                ? "border-t border-[#E7EAEE] bg-[#F8F9FB] px-6 py-7 sm:px-8 xl:border-t-0 xl:border-l"
                : "bg-[#F8F9FB] px-6 py-7 sm:px-8"
            }
          >
            <WeekActivityChart values={weekActivity} />
          </div>
        </div>
      </section>

      {loadError ? <p className="mt-5 text-[14px] leading-6 text-[#E1251B]">{errorsT("loadFailed")}</p> : null}

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <MiniStat label={t("applications")} value={String(apps.length)} />
        <MiniStat label={t("inSandbox")} value={String(sandboxCount)} />
        <MiniStat label={t("calls30")} value={(0).toLocaleString(numberLocale)} />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[22px] font-bold text-[#141F25]">{t("yourApps")}</h2>
          {apps.length > 0 ? (
            <Link href="/dashboard/apps/nueva" className={createAppButtonClassName}>
              {t("createApp")}
            </Link>
          ) : null}
        </div>
        {apps.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[16px] border border-[#E7EAEE] bg-white px-8 py-16 text-center sm:min-h-[360px] sm:px-12 sm:py-20">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F6F8]">
              <AppWindow className="h-10 w-10 text-[#8E8E8E]" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h3 className="mt-6 text-[22px] font-bold tracking-[0.2px] text-[#141F25] sm:text-[24px]">{t("emptyTitle")}</h3>
            <p className="mt-3 max-w-[440px] text-[15px] leading-7 text-[#6A7178]">{t("emptyDescription")}</p>
            <Link href="/dashboard/apps/nueva" className={`mt-8 ${createAppButtonClassName}`}>
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
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F6F8]">
                    <Rocket className="h-8 w-8 text-[#8E8E8E]" strokeWidth={1.5} aria-hidden="true" />
                  </div>
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
    <div className="rounded-[20px] border border-[#E7EAEE] bg-white px-5 py-4">
      <p className="text-[13px] text-[#8E8E8E]">{label}</p>
      <p className="mt-1 text-[22px] font-bold text-[#141F25]">{value}</p>
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
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
