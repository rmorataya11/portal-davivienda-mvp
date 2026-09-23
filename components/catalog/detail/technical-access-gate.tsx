"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { AuthReturnLink } from "@/components/auth/auth-return-link";
import { useAuth } from "@/components/auth/auth-provider";
import { getLoginHref, getSignupHref } from "@/lib/navigation/safe-path";

import type { ApiDetail } from "../content/apis";
import { DetailSectionCard } from "./detail-primitives";

export function TechnicalAccessGate({ api, children }: { api: ApiDetail; children: ReactNode }) {
  const { user, loading } = useAuth();
  const t = useTranslations("Catalog.technical");

  if (loading) {
    return (
      <DetailSectionCard eyebrow={t("gateLoadingEyebrow")} title={t("gateLoadingTitle")}>
        <div className="h-48 animate-pulse rounded-[18px] bg-[#F2F3F5]" />
      </DetailSectionCard>
    );
  }

  if (!user) {
    const nextPath = `/catalogo-apis/${api.slug}/detalle-tecnico`;

    return (
      <DetailSectionCard eyebrow={t("gateEyebrow")} title={t("gateTitle")}>
        <p className="max-w-[640px] text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">
          {t("gateDescription", { name: api.name })}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <AuthReturnLink
            href={getSignupHref(nextPath)}
            returnTo={nextPath}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
          >
            {t("createAccount")}
          </AuthReturnLink>
          <AuthReturnLink
            href={getLoginHref(nextPath)}
            returnTo={nextPath}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#E1251B] bg-white px-7 text-[15px] font-semibold text-[#E1251B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFF8F8]"
          >
            {t("signIn")}
          </AuthReturnLink>
        </div>
      </DetailSectionCard>
    );
  }

  return children;
}
