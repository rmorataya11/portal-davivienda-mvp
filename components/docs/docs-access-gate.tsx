"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { ContentAccessGate } from "@/components/auth/content-access-gate";

export function DocsAccessGate({ children }: { children: ReactNode }) {
  const t = useTranslations("Documentacion.gate");

  return (
    <ContentAccessGate fallbackPath="/documentacion" description={t("description")} preview="docs">
      {children}
    </ContentAccessGate>
  );
}
