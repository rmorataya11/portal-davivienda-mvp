"use client";

import { useTranslations } from "next-intl";

import { appStatusStyles } from "@/lib/developer-apps/labels";
import type { AppStatus } from "@/lib/developer-apps/types";

export function AppStatusBadge({ status }: { status: AppStatus }) {
  const t = useTranslations("Dashboard.status");

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ${appStatusStyles[status]}`}>
      {t(status)}
    </span>
  );
}
