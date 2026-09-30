"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { AuthReturnLink } from "@/components/auth/auth-return-link";
import { useAuth } from "@/components/auth/auth-provider";
import { AppStatusBadge } from "@/components/dashboard/app-status-badge";
import { useDeveloperApps } from "@/components/dashboard/apps-provider";
import { formatAppDate } from "@/lib/developer-apps/labels";
import { getLoginHref, getSignupHref } from "@/lib/navigation/safe-path";
import type { DeveloperApp } from "@/lib/developer-apps/types";

export function ApiLinkedApps({
  slug,
  apiName,
  returnTo,
}: {
  slug: string;
  apiName: string;
  returnTo: string;
}) {
  const t = useTranslations("Catalog.apps");
  const { user, loading } = useAuth();
  const { apps, ready } = useDeveloperApps();

  if (loading || !ready) {
    return <div className="h-40 animate-pulse rounded-[24px] bg-white" />;
  }

  if (!user) {
    return (
      <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-6 py-7">
        <p className="max-w-[560px] text-[16px] leading-7 text-[#6A7178]">
          {t("signedOut", { name: apiName })}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <AuthReturnLink
            href={getSignupHref(returnTo)}
            returnTo={returnTo}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
          >
            {t("createAccount")}
          </AuthReturnLink>
          <AuthReturnLink
            href={getLoginHref(returnTo)}
            returnTo={returnTo}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#E1251B] bg-white px-7 text-[15px] font-semibold text-[#E1251B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFF8F8]"
          >
            {t("signIn")}
          </AuthReturnLink>
        </div>
      </div>
    );
  }

  const linkedApps = apps.filter((app) => app.apiProduct === slug);

  if (linkedApps.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-[#D5DAE0] bg-white px-6 py-8">
        <p className="max-w-[640px] text-[16px] leading-7 text-[#6A7178]">
          {t("empty", { name: apiName })}
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex text-[14px] font-medium text-[#E1251B] transition-colors hover:text-[#C01F16]"
        >
          {t("goToDashboard")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {linkedApps.map((app) => (
        <ApiAppRow key={app.id} app={app} />
      ))}
    </div>
  );
}

function ApiAppRow({ app }: { app: DeveloperApp }) {
  const t = useTranslations("Catalog.apps");
  const locale = useLocale();
  const created = formatAppDate(app.createdAt, locale);

  return (
    <div className="rounded-[22px] border border-[#E7EAEE] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[18px] font-bold text-[#141F25]">{app.name}</h3>
        <AppStatusBadge environment={app.environment} />
      </div>
      {created ? <p className="mt-3 text-[13px] text-[#8E8E8E]">{t("created", { date: created })}</p> : null}
    </div>
  );
}
