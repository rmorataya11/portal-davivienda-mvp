"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { LockedContentPanel } from "@/components/auth/locked-content-panel";

export function DashboardAccessGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const t = useTranslations("Dashboard.gate");
  const pathname = usePathname();
  const returnTo = pathname || "/dashboard";

  if (loading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-white" />;
  }

  if (!user) {
    return <LockedContentPanel description={t("description")} returnTo={returnTo} preview="apps" />;
  }

  return children;
}
