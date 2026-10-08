import { parseCalendarDate } from "@/lib/format/date";

import type { AppEnvironment } from "./types";

export const appStatusStyles: Record<AppEnvironment, string> = {
  sandbox: "bg-[#FEF3C7] text-[#B45309]",
  contracting: "bg-[#FFF6E8] text-[#A15C12]",
  production: "bg-[#EFFCF5] text-[#347659]",
};

const ENVIRONMENT_NAME_SUFFIX =
  /\s*[·•|-]\s*(Sandbox|Producción|Production|Contratación|Contracting)\s*$/i;

/** Title without the environment suffix when a badge already shows it. */
export function displayAppName(name: string) {
  return name.replace(ENVIRONMENT_NAME_SUFFIX, "").trim() || name.trim();
}

export function isProductionApp(app: { environment: AppEnvironment }) {
  return app.environment === "production";
}

export function isSandboxGroupApp(app: { environment: AppEnvironment }) {
  return app.environment === "sandbox" || app.environment === "contracting";
}

export function hasProductionApps(apps: Array<{ environment: AppEnvironment }>) {
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

export function formatAppDateTime(value: string | null, locale?: string) {
  if (!value) {
    return "";
  }

  const date = parseCalendarDate(value);
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(dateLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
