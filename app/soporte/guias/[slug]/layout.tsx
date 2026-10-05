import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { ContentAccessGate } from "@/components/auth/content-access-gate";

export default async function GuideDetailLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations("Support.gate");

  return (
    <ContentAccessGate
      eyebrow={t("eyebrow")}
      fallbackPath="/soporte#guias-integracion"
      description={t("description")}
    >
      {children}
    </ContentAccessGate>
  );
}
