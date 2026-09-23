"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { apiCatalogItems, getApiDetailBySlug } from "@/components/catalog/content/apis";
import { localizeApiDetail, localizeCatalogItem } from "@/components/catalog/content/localize-api";
import { BreakablePath } from "@/components/ui/breakable-path";
import { CredentialField } from "@/components/ui/credential-field";
import { appUsageStats, formatMoney } from "@/lib/developer-apps/factory";
import { formatAppDate, formatAppDateTime } from "@/lib/developer-apps/labels";

import { AppDeleteControl, AppEditForm } from "./app-edit-form";
import { AppStatusBadge } from "./app-status-badge";
import { useDeveloperApps } from "./apps-provider";

export function AppDetailPage({ appId }: { appId: string }) {
  const { getApp, ready } = useDeveloperApps();
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations("Dashboard");
  const catalogT = useTranslations("Catalog");
  const locale = useLocale();
  const numberLocale = locale === "en" ? "en-US" : "es";

  if (!ready) {
    return <div className="h-64 animate-pulse rounded-[24px] bg-white" />;
  }

  const app = getApp(appId);

  if (!app) {
    return (
      <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-6 py-8">
        <h1 className="text-[26px] font-bold text-[#404040] sm:text-[32px]">{t("detail.notFoundTitle")}</h1>
        <p className="mt-3 text-[16px] leading-7 text-[#707070]">{t("detail.notFoundDescription")}</p>
        <Link
          href="/dashboard"
          className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white"
        >
          {t("detail.back")}
        </Link>
      </div>
    );
  }

  const products = apiCatalogItems
    .filter((item) => app.productSlugs.includes(item.slug))
    .map((item) => localizeCatalogItem(item, catalogT));
  const stats = appUsageStats(app);
  const productionHref = `/solicitud-contratacion?app=${app.id}&producto=${app.productSlugs[0] ?? ""}`;
  const created = formatAppDate(app.createdAt, locale) || t("dates.noActivity");

  return (
    <div>
      <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#707070]">{t("detail.eyebrow")}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-[26px] font-bold tracking-[0.3px] text-[#404040] sm:text-[32px]">{app.name}</h1>
              <AppStatusBadge status={app.status} />
            </div>
          </div>
          {!isEditing ? (
            <div className="flex flex-wrap items-center gap-2">
              {app.status === "sandbox" ? (
                <Link
                  href={productionHref}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#C01F16]"
                >
                  {t("detail.requestProduction")}
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#D5DAE0] bg-white px-5 text-[14px] font-medium text-[#404040] transition-colors hover:border-[#E1251B] hover:text-[#E1251B]"
              >
                {t("detail.edit")}
              </button>
              <AppDeleteControl appId={app.id} appName={app.name} />
            </div>
          ) : null}
        </div>
        {isEditing ? (
          <AppEditForm app={app} onCancel={() => setIsEditing(false)} />
        ) : (
          <p className="mt-3 max-w-[720px] text-[15px] leading-6 text-[#707070]">
            {app.description || t("detail.noDescription")}
          </p>
        )}
        {app.status === "contracting" ? (
          <p className="mt-3 text-[14px] leading-6 text-[#707070]">{t("detail.contractingNote")}</p>
        ) : null}
        {app.status === "production" ? (
          <p className="mt-3 text-[14px] leading-6 text-[#707070]">{t("detail.productionNote")}</p>
        ) : null}
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-[#E7EAEE] bg-white">
        <div className="grid md:grid-cols-3">
          <MetricCard label={t("detail.calls30")} value={stats.callsLast30Days.toLocaleString(numberLocale)} />
          <MetricCard label={t("detail.errorRate")} value={`${stats.errorRate.toFixed(1)}%`} />
          <div className="border-t border-[#E7EAEE] px-5 py-5 md:border-t-0 md:border-l md:px-6">
            <p className="text-[13px] text-[#707070]">{t("detail.monthEstimate")}</p>
            <p className="mt-2 text-[22px] font-bold tracking-[0.2px] text-[#404040] sm:text-[26px]">
              {formatMoney(stats.consumedUsd)}
            </p>
            <p className="mt-2 text-[13px] leading-5 text-[#707070]">
              {t("detail.budgetSandbox", { amount: formatMoney(stats.budgetUsd) })}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] border border-[#E7EAEE] bg-white p-6 sm:p-7">
          <h2 className="text-[22px] font-bold text-[#404040]">{t("detail.credentialsTitle")}</h2>
          <p className="mt-2 text-[14px] leading-6 text-[#707070]">
            {t.rich("detail.credentialsDescription", {
              header: (chunks) => <span className="font-mono text-[#404040]">{chunks}</span>,
            })}
          </p>
          <div className="mt-5 space-y-3">
            <CredentialField label={t("detail.consumerKey")} value={app.consumerKey} secret />
            <CredentialField label={t("detail.consumerSecret")} value={app.consumerSecret} secret />
            <CredentialField label={t("detail.baseUrl")} value={app.baseUrl} />
            <p className="-mt-1 px-1 text-[13px] leading-5 text-[#707070]">{t("detail.baseUrlHint")}</p>
            <CredentialField label={t("detail.expires")} value={formatAppDateTime(app.expiresAt, locale)} />
          </div>
        </div>

        <div className="rounded-[24px] border border-[#E7EAEE] bg-white p-6 sm:p-7">
          <h2 className="text-[22px] font-bold text-[#404040]">{t("detail.linkedApi")}</h2>
          <div className="mt-4 space-y-3">
            {products.map((product) => {
              const detail = getApiDetailBySlug(product.slug);
              const localizedDetail = detail ? localizeApiDetail(detail, catalogT) : undefined;
              const endpoint = localizedDetail?.endpoints[0];

              return (
                <div key={product.slug} className="rounded-[16px] border border-[#E7EAEE] bg-white px-4 py-4">
                  <p className="text-[18px] font-semibold text-[#404040]">{product.name}</p>
                  <p className="mt-1 text-[13px] text-[#707070]">{product.category}</p>
                  {endpoint ? (
                    <div className="mt-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex min-w-14 items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            endpoint.method === "POST" ? "bg-[#E1251B] text-white" : "bg-[#EFFCF5] text-[#347659]"
                          }`}
                        >
                          {endpoint.method}
                        </span>
                        <code className="min-w-0 text-[13px] text-[#404040]">
                          <BreakablePath value={endpoint.path} />
                        </code>
                      </div>
                      <p className="mt-2 text-[13px] leading-5 text-[#707070]">{endpoint.description}</p>
                    </div>
                  ) : null}
                  {localizedDetail?.useCases.length ? (
                    <ul className="mt-4 space-y-2">
                      {localizedDetail.useCases.map((useCase, index) => (
                        <li key={useCase} className="flex gap-3 text-[13px] leading-5 text-[#404040]">
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#202A31] text-[10px] font-bold text-white">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="pt-0.5">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <Link
                      href={`/catalogo-apis/${product.slug}`}
                      className="inline-flex h-10 items-center justify-center rounded-[20px] border border-[#D5DAE0] px-4 text-[13px] font-medium text-[#404040] transition-colors hover:border-[#E1251B] hover:text-[#E1251B]"
                    >
                      {t("detail.viewCard")}
                    </Link>
                    <Link
                      href={`/catalogo-apis/${product.slug}/detalle-tecnico`}
                      className="inline-flex h-10 items-center justify-center rounded-[20px] bg-[#E1251B] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#C01F16]"
                    >
                      {t("detail.technicalConsole")}
                    </Link>
                  </div>
                  <Link
                    href={`/documentacion?api=${product.slug}`}
                    className="mt-4 inline-flex text-[13px] font-semibold text-[#E1251B] transition-colors hover:text-[#C01F16]"
                  >
                    {t("detail.viewDocs")}
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-[13px] text-[#707070]">{t("detail.created", { date: created })}</p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-[#E7EAEE] px-5 py-5 first:border-t-0 md:border-t-0 md:border-l md:first:border-l-0 md:px-6">
      <p className="text-[13px] text-[#707070]">{label}</p>
      <p className="mt-2 text-[24px] font-bold tracking-[0.2px] text-[#404040] sm:text-[28px]">{value}</p>
    </div>
  );
}
