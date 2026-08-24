import type { AppStatus } from "./types";

export const appStatusCopy: Record<
  AppStatus,
  { label: string; className: string }
> = {
  sandbox: {
    label: "Sandbox",
    className: "bg-[#EFFCF5] text-[#347659]",
  },
  contracting: {
    label: "En contratación",
    className: "bg-[#FFF6E8] text-[#A15C12]",
  },
  production: {
    label: "Producción",
    className: "bg-[#EEF3FF] text-[#2F4EA1]",
  },
};

export function formatAppDate(value: string | null) {
  if (!value) {
    return "Sin actividad";
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function formatAppDateTime(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
