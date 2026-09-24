"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { ContentAccessGate } from "@/components/auth/content-access-gate";

export function DocsAccessGate({ children }: { children: ReactNode }) {
  const t = useTranslations("Documentacion.gate");

  return (
    <ContentAccessGate eyebrow={t("eyebrow")} fallbackPath="/documentacion" description={t("description")}>
      {children}
    </ContentAccessGate>
  );
}
