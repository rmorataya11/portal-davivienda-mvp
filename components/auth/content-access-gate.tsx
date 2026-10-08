"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { AuthReturnLink } from "@/components/auth/auth-return-link";
import { useAuth } from "@/components/auth/auth-provider";
import { LockedContentPanel, type LockedPreviewKind } from "@/components/auth/locked-content-panel";
import { SectionContainer } from "@/components/ui/layout";
import { SANDBOX_REQUEST_HREF } from "@/lib/access/sandbox";
import { getLoginHref } from "@/lib/navigation/safe-path";

type ContentAccessGateProps = {
  children: ReactNode;
  description: string;
  fallbackPath: string;
  embedded?: boolean;
  titleId?: string;
  preview?: LockedPreviewKind;
  /** When true, logged-in users still need approved sandbox access. */
  requireSandboxAccess?: boolean;
  sandboxTitle?: string;
  sandboxDescription?: string;
  sandboxActionLabel?: string;
};

export function ContentAccessGate({
  children,
  description,
  fallbackPath,
  embedded = false,
  titleId,
  preview = "docs",
  requireSandboxAccess = false,
  sandboxTitle,
  sandboxDescription,
  sandboxActionLabel,
}: ContentAccessGateProps) {
  const { user, loading, sandboxAccess } = useAuth();
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
          <div className="h-64 animate-pulse rounded-2xl bg-white" />
        </SectionContainer>
      </section>
    );
  }

  if (!user) {
    if (embedded) {
      return (
        <div className="max-w-[420px]">
          <h2 id={titleId} className="text-[22px] font-bold tracking-[0.2px] text-[#404040]">
            {t("lockedTitle")}
          </h2>
          <p className="mt-2 text-[15px] leading-6 text-[#8E8E8E]">{description}</p>
          <AuthReturnLink
            href={getLoginHref(returnTo)}
            returnTo={returnTo}
            className="mt-5 inline-flex h-[46px] items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#C01F16]"
          >
            {t("signIn")}
          </AuthReturnLink>
        </div>
      );
    }

    return (
      <section className="pt-4 pb-16">
        <SectionContainer>
          <LockedContentPanel
            description={description}
            returnTo={returnTo}
            titleId={titleId}
            preview={preview}
          />
        </SectionContainer>
      </section>
    );
  }

  if (requireSandboxAccess && !sandboxAccess) {
    const pendingTitle = sandboxTitle ?? t("sandboxLockedTitle");
    const pendingDescription = sandboxDescription ?? t("sandboxLockedDescription");
    const pendingAction = sandboxActionLabel ?? t("requestSandbox");

    if (embedded) {
      return (
        <div className="max-w-[420px]">
          <h2 id={titleId} className="text-[22px] font-bold tracking-[0.2px] text-[#404040]">
            {pendingTitle}
          </h2>
          <p className="mt-2 text-[15px] leading-6 text-[#8E8E8E]">{pendingDescription}</p>
          <Link
            href={SANDBOX_REQUEST_HREF}
            className="mt-5 inline-flex h-[46px] items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#C01F16]"
          >
            {pendingAction}
          </Link>
        </div>
      );
    }

    return (
      <section className="pt-4 pb-16">
        <SectionContainer>
          <LockedContentPanel
            title={pendingTitle}
            description={pendingDescription}
            returnTo={returnTo}
            titleId={titleId}
            preview={preview}
            actionHref={SANDBOX_REQUEST_HREF}
            actionLabel={pendingAction}
          />
        </SectionContainer>
      </section>
    );
  }

  return children;
}
