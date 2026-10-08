"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { LockedContentPanel } from "@/components/auth/locked-content-panel";
import { SANDBOX_REQUEST_HREF } from "@/lib/access/sandbox";
import type { CatalogView } from "@/lib/catalog/present";

export function TechnicalAccessGate({ api, children }: { api: CatalogView; children: ReactNode }) {
  const { user, loading, sandboxAccess } = useAuth();
  const t = useTranslations("Catalog.technical");
  const returnTo = `/catalogo-apis/${api.slug}/detalle-tecnico`;

  if (loading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-white" />;
  }

  if (!user) {
    return (
      <LockedContentPanel
        description={t("gateDescription", { name: api.name })}
        returnTo={returnTo}
        titleTag="h2"
        preview="technical"
      />
    );
  }

  if (!sandboxAccess) {
    return (
      <LockedContentPanel
        title={t("sandboxTitle")}
        description={t("sandboxDescription", { name: api.name })}
        returnTo={returnTo}
        titleTag="h2"
        preview="technical"
        actionHref={SANDBOX_REQUEST_HREF}
        actionLabel={t("requestSandbox")}
      />
    );
  }

  return children;
}
