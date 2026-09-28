"use client";

import { AppWindow } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { useAuth } from "@/components/auth/auth-provider";
import { appUsageStats, formatMoney } from "@/lib/developer-apps/factory";
import { hasProductionApps, isProductionApp } from "@/lib/developer-apps/labels";

import { AppCard } from "./app-card";
import { useDeveloperApps } from "./apps-provider";
import { WeekActivityChart } from "./week-activity-chart";

const createAppButtonClassName =
  "inline-flex h-[46px] items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)]";

export function DashboardHome() {
  const { user } = useAuth();
  const { apps, ready } = useDeveloperApps();
  const t = useTranslations("Dashboard.home");
  const locale = useLocale();
  const numberLocale = locale === "en" ? "en-US" : "es";

  if (!ready) {
    return <div className="h-64 animate-pulse rounded-[24px] bg-white" />;
  }

  const greetingName = displayNameFromEmail(user?.email);
  const stats = apps.map((app) => appUsageStats(app));
  const productionApps = apps.filter(isProductionApp);
  const productionStats = productionApps.map((app) => appUsageStats(app));
  const showBillingSummary = hasProductionApps(apps);
  const totalCalls = stats.reduce((sum, item) => sum + item.callsLast30Days, 0);
  const consumedUsd = productionStats.reduce((sum, item) => sum + item.consumedUsd, 0);
  const budgetUsd = productionStats.length > 0 ? Math.max(...productionStats.map((item) => item.budgetUsd)) : 600;
  const consumedRatio = Math.min(consumedUsd / budgetUsd, 1);
  const weekActivity =
    stats.length > 0
      ? [0, 1, 2, 3, 4, 5, 6].map((index) => stats.reduce((sum, item) => sum + item.weekActivity[index], 0))
      : [0, 0, 0, 0, 0, 0, 0];
  const sandboxCount = apps.filter((app) => app.status === "sandbox").length;

  return (
    <div>
      <div>
        <p className="text-[15px] text-[#6A7178]">
          {greetingName ? t("greetingNamed", { name: greetingName }) : t("greeting")}
        </p>
        <h1 className="mt-1 text-[28px] font-bold tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-[560px] text-[16px] leading-7 text-[#6A7178]">{t("description")}</p>
      </div>

      <section className="mt-8 overflow-hidden rounded-[32px] border border-[#E7EAEE] bg-white shadow-[0_18px_50px_rgba(20,31,37,0.06)]">
        <div className={showBillingSummary ? "grid xl:grid-cols-[1.15fr_0.85fr]" : undefined}>
          {showBillingSummary ? (
            <div className="px-6 py-7 sm:px-8 sm:py-8">
              <p className="text-[13px] font-medium text-[#8E8E8E]">{t("consumption30")}</p>
              <p className="mt-3 text-[34px] font-bold leading-none tracking-[0.2px] text-[#141F25] sm:text-[42px] lg:text-[48px]">
                {formatMoney(consumedUsd)}
              </p>
              <p className="mt-3 text-[15px] text-[#6A7178]">{t("ofEstimate", { amount: formatMoney(budgetUsd) })}</p>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#F2F3F5]">
                <div
                  className="h-full rounded-full bg-[#E1251B] transition-[width] duration-500"
                  style={{ width: `${Math.max(consumedRatio * 100, 4)}%` }}
                />
              </div>
              <p className="mt-2 text-[13px] text-[#8E8E8E]">
                {t("consumedRatio", { percent: Math.round(consumedRatio * 100) })}
              </p>
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

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <MiniStat label={t("applications")} value={String(apps.length)} />
        <MiniStat label={t("inSandbox")} value={String(sandboxCount)} />
        <MiniStat label={t("calls30")} value={totalCalls.toLocaleString(numberLocale)} />
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
          <>
            {sandboxCount > 0 ? (
              <p className="mb-4 text-[13px] leading-6 text-[#8E8E8E]">{t("sandboxBillingNote")}</p>
            ) : null}
            <div className="grid gap-[15px] md:grid-cols-2 xl:grid-cols-3">
              {apps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </>
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

function displayNameFromEmail(email: string | null | undefined) {
  if (!email) {
    return "";
  }

  const local = email.split("@")[0] ?? "";
  const first = local.split(/[._-]/)[0] ?? "";
  if (!first) {
    return "";
  }

  return first.charAt(0).toUpperCase() + first.slice(1);
}
