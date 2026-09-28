import { parseCalendarDate } from "@/lib/format/date";

import type { AppStatus } from "./types";

export const appStatusStyles: Record<AppStatus, string> = {
  sandbox: "bg-[#FEF3C7] text-[#B45309]",
  contracting: "bg-[#FFF6E8] text-[#A15C12]",
  production: "bg-[#EEF3FF] text-[#2F4EA1]",
};

export function isProductionApp(app: { status: AppStatus }) {
  return app.status === "production";
}

export function hasProductionApps(apps: Array<{ status: AppStatus }>) {
  return apps.some(isProductionApp);
}

function dateLocale(locale?: string) {
  return locale === "en" ? "en-US" : "es";
}

export function formatAppDate(value: string | null, locale?: string) {
  if (!value) {
    return "";
  }

  const date = parseCalendarDate(value);
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(dateLocale(locale), {
    dateStyle: "medium",
  }).format(date);
}

export function formatAppDateTime(value: string, locale?: string) {
  const date = parseCalendarDate(value);
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(dateLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
