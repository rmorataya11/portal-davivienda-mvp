import type { AppStatus } from "./types";

export const appStatusStyles: Record<AppStatus, string> = {
  sandbox: "bg-[#EFFCF5] text-[#347659]",
  contracting: "bg-[#FFF6E8] text-[#A15C12]",
  production: "bg-[#EEF3FF] text-[#2F4EA1]",
};

function dateLocale(locale?: string) {
  return locale === "en" ? "en-US" : "es";
}

export function formatAppDate(value: string | null, locale?: string) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(dateLocale(locale), {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function formatAppDateTime(value: string, locale?: string) {
  return new Intl.DateTimeFormat(dateLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
