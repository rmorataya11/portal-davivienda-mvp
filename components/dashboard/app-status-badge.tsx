"use client";

import { useTranslations } from "next-intl";

import { appStatusStyles } from "@/lib/developer-apps/labels";
import type { AppEnvironment } from "@/lib/developer-apps/types";

export function AppStatusBadge({ environment }: { environment: AppEnvironment }) {
  const t = useTranslations("Dashboard.status");

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ${appStatusStyles[environment]}`}>
      {t(environment)}
    </span>
  );
}
