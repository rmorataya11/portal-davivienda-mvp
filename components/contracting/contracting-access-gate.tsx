"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { LockedContentPanel } from "@/components/auth/locked-content-panel";

export function ContractingAccessGate({
  children,
  returnTo,
}: {
  children: ReactNode;
  returnTo: string;
}) {
  const t = useTranslations("Contratacion.gate");
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-64 animate-pulse rounded-[18px] bg-[#F2F3F5]" />;
  }

  if (!user) {
    return (
      <LockedContentPanel
        description={t("description")}
        returnTo={returnTo}
        preview="form"
        className="min-h-[420px] border-0 lg:min-h-[480px]"
      />
    );
  }

  return children;
}
