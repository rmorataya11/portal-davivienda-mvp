"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { AuthReturnLink } from "@/components/auth/auth-return-link";
import { useAuth } from "@/components/auth/auth-provider";
import { AppStatusBadge } from "@/components/dashboard/app-status-badge";
import { useDeveloperApps } from "@/components/dashboard/apps-provider";
import { CredentialField } from "@/components/ui/credential-field";
import { formatAppDateTime } from "@/lib/developer-apps/labels";
import { getLoginHref, getSignupHref } from "@/lib/navigation/safe-path";

const SANDBOX_BASE_URL = "https://demo.nip.io/v1";

export function CredentialsPanel({ slug, apiName }: { slug: string; apiName: string }) {
  const t = useTranslations("Catalog.credentials");
  const dashboardT = useTranslations("Dashboard");
  const locale = useLocale();
  const returnTo = `/catalogo-apis/${slug}/detalle-tecnico`;
  const { user, loading } = useAuth();
  const { apps, ready } = useDeveloperApps();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (loading || !ready) {
    return <div className="h-64 animate-pulse rounded-[24px] bg-[#F7F8FA]" />;
  }

  if (!user) {
    return (
      <EmptyPanel>
        <h3 className="text-[20px] font-bold tracking-[0.2px] text-[#30383F]">{t("signInTitle")}</h3>
        <p className="mt-2 max-w-[480px] text-[15px] leading-7 text-[#6A7178]">
          {t("signInDescription", { name: apiName })}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <AuthReturnLink
            href={getSignupHref(returnTo)}
            returnTo={returnTo}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
          >
            {t("createAccount")}
          </AuthReturnLink>
          <AuthReturnLink
            href={getLoginHref(returnTo)}
            returnTo={returnTo}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#D5DAE0] bg-white px-6 text-[14px] font-semibold text-[#404040] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E1251B] hover:text-[#E1251B]"
          >
            {t("signIn")}
          </AuthReturnLink>
        </div>
      </EmptyPanel>
    );
  }

  const linkedApps = apps.filter((app) => app.apiProduct === slug);
  const selected = linkedApps.find((app) => app.id === selectedId) ?? linkedApps[0];
  const showAppRail = linkedApps.length > 1;

  if (!selected) {
    return (
      <EmptyPanel>
        <h3 className="text-[20px] font-bold tracking-[0.2px] text-[#30383F]">{t("emptyTitle")}</h3>
        <p className="mt-2 max-w-[480px] text-[15px] leading-7 text-[#6A7178]">
          {t("emptyDescription", { name: apiName })}
        </p>
        <Link
          href={`/dashboard/apps/nueva?producto=${slug}`}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
        >
          {t("createApp")}
        </Link>
      </EmptyPanel>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E3E7EC]">
      <div className={`grid ${showAppRail ? "xl:grid-cols-[220px_minmax(0,1fr)]" : ""}`}>
        {showAppRail ? (
          <aside className="border-b border-[#E7EAEE] bg-[#FAFBFC] xl:border-b-0 xl:border-r">
            <div className="px-4 py-4">
              <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#6A7178]">{t("apps")}</p>
              <div className="mt-3 space-y-2">
                {linkedApps.map((app) => {
                  const isActive = app.id === selected.id;

                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedId(app.id)}
                      className={`flex w-full items-center rounded-[14px] px-3 py-2.5 text-left text-[13px] font-medium transition-colors duration-300 ${
                        isActive ? "bg-[#202A31] text-white" : "bg-transparent text-[#30383F] hover:bg-[#F1F4F7]"
                      }`}
                    >
                      <span className="min-w-0 truncate">{app.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        ) : null}

        <div className="min-w-0 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF1F4] px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">{t("credentials")}</p>
              <h3 className="mt-1 truncate text-[18px] font-bold tracking-[0.2px] text-[#30383F] sm:text-[20px]">
                {selected.name}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <AppStatusBadge environment={selected.environment} />
              <Link
                href={`/dashboard/apps/${selected.id}`}
                className="inline-flex h-9 items-center justify-center rounded-full border border-[#D5DAE0] px-4 text-[13px] font-medium text-[#404040] transition-all duration-300 hover:border-[#E1251B] hover:text-[#E1251B]"
              >
                {t("openApp")}
              </Link>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-3 px-5 py-5 sm:px-6 sm:py-6">
              {selected.consumerKey ? (
                <CredentialField label={dashboardT("detail.consumerKey")} value={selected.consumerKey} secret />
              ) : null}
              <CredentialField label={t("baseUrl")} value={SANDBOX_BASE_URL} />
              <CredentialField
                label={dashboardT("detail.expires")}
                value={formatAppDateTime(selected.expiresAt, locale) || dashboardT("dates.noActivity")}
              />
              <Link
                href={`/documentacion?api=${slug}`}
                className="inline-flex text-[13px] font-semibold text-[#E1251B] transition-colors hover:text-[#C01F16]"
              >
                {t("viewTechnicalDocs")}
              </Link>
            </div>

            <aside className="border-t border-[#EEF1F4] bg-[#FAFBFC] px-5 py-5 lg:border-l lg:border-t-0 sm:px-6 sm:py-6">
              <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">{t("howToUse")}</p>
              <ol className="mt-4 space-y-4">
                <UsageStep index="1" text={t("step1")} />
                <UsageStep index="2" text={t("step2")} />
                <UsageStep index="3" text={t("step3")} />
              </ol>
            </aside>
          </div>
        </div>
      </div>

    </div>
  );
}

function UsageStep({ index, text }: { index: string; text: string }) {
  return (
    <li className="flex gap-3 text-[14px] leading-6 text-[#3C444B]">
      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#202A31] text-[10px] font-bold text-white">
        {index}
      </span>
      <span>{text}</span>
    </li>
  );
}

function EmptyPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[24px] border border-[#E3E7EC] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FB_100%)] px-6 py-8 sm:px-8">
      {children}
    </div>
  );
}

