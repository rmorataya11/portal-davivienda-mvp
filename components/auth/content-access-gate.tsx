"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { AuthReturnLink } from "@/components/auth/auth-return-link";
import { useAuth } from "@/components/auth/auth-provider";
import { SectionContainer } from "@/components/ui/layout";
import { getLoginHref, getSignupHref } from "@/lib/navigation/safe-path";

type ContentAccessGateProps = {
  children: ReactNode;
  description: string;
  fallbackPath: string;
  embedded?: boolean;
  titleId?: string;
};

export function ContentAccessGate({
  children,
  description,
  fallbackPath,
  embedded = false,
  titleId,
}: ContentAccessGateProps) {
  const { user, loading } = useAuth();
  const t = useTranslations("Auth.gate");
  const pathname = usePathname();
  const returnTo = pathname || fallbackPath;

  if (loading) {
    if (embedded) {
      return <div className="h-48 animate-pulse rounded-[18px] bg-[#F2F3F5]" />;
    }

    return (
      <section className="pt-4 pb-16">
        <SectionContainer>
          <div className="h-64 animate-pulse rounded-[24px] bg-white" />
        </SectionContainer>
      </section>
    );
  }

  if (!user) {
    const content = (
      <div
        className={
          embedded
            ? ""
            : "rounded-[32px] border border-[#E7EAEE] bg-white px-6 py-8 shadow-[0_18px_50px_rgba(20,31,37,0.06)] sm:px-8 sm:py-10"
        }
      >
        <h1
          id={titleId}
          className="text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]"
        >
          {t("title")}
        </h1>
        <div className="mt-4 h-1.5 w-14 rounded-full bg-[#E1251B]" />
        <p className="mt-5 max-w-[640px] text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">{description}</p>
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

    if (embedded) {
      return content;
    }

    return (
      <section className="pt-4 pb-16">
        <SectionContainer>{content}</SectionContainer>
      </section>
    );
  }

  return children;
}
