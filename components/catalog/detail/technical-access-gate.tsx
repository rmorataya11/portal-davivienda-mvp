"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { LockedContentPanel } from "@/components/auth/locked-content-panel";
import type { CatalogView } from "@/lib/catalog/present";

export function TechnicalAccessGate({ api, children }: { api: CatalogView; children: ReactNode }) {
  const { user, loading } = useAuth();
  const t = useTranslations("Catalog.technical");

  if (loading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-white" />;
  }

  if (!user) {
    return (
      <LockedContentPanel
        description={t("gateDescription", { name: api.name })}
        returnTo={`/catalogo-apis/${api.slug}/detalle-tecnico`}
        titleTag="h2"
        preview="technical"
      />
    );
  }

  return children;
}
