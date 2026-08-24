import type { DeveloperApp } from "./types";

const STORAGE_PREFIX = "davivienda-developer-apps:v1:";

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

export function loadDeveloperApps(userId: string): DeveloperApp[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as DeveloperApp[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDeveloperApps(userId: string, apps: DeveloperApp[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey(userId), JSON.stringify(apps));
}
