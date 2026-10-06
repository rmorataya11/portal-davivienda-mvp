"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { AuthReturnLink } from "@/components/auth/auth-return-link";
import { useAuth } from "@/components/auth/auth-provider";
import { getLoginHref, getSignupHref } from "@/lib/navigation/safe-path";

export function DashboardAccessGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const t = useTranslations("Dashboard.gate");
  const pathname = usePathname();
  const returnTo = pathname || "/dashboard";

  if (loading) {
    return <div className="h-64 animate-pulse rounded-[24px] bg-white" />;
  }

  if (!user) {
    return (
      <div className="rounded-[32px] border border-[#E7EAEE] bg-white px-6 py-8 shadow-[0_18px_50px_rgba(20,31,37,0.06)] sm:px-8 sm:py-10">
        <h1 className="text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]">
          {t("title")}
        </h1>
        <div className="mt-4 h-1.5 w-14 rounded-full bg-[#E1251B]" />
        <p className="mt-5 max-w-[640px] text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">{t("description")}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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

  return children;
}
