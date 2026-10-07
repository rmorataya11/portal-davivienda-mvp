// MOCK: reemplazar cuando se integre analítica real (Apigee)

import type { DeveloperApp } from "@/lib/developer-apps/types";

const WEEKDAY_WEIGHT = [1.15, 1.4, 1.2, 1.05, 0.85, 0.35, 0.25];

function hashSeed(value: string) {
  let hash = 0;

  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }

  return Math.abs(hash);
}

function weekdayIndex(now: Date) {
  const day = now.getDay();
  return day === 0 ? 6 : day - 1;
}

function dayProgress(now: Date) {
  return (now.getHours() * 60 + now.getMinutes()) / (24 * 60);
}

function clampDay(now: Date, day: number, closed: number) {
  const today = weekdayIndex(now);

  if (day > today) {
    return 0;
  }

  if (day < today) {
    return closed;
  }

  return Math.max(1, Math.round(closed * Math.min(1, dayProgress(now))));
}

function weekActivityForApp(app: DeveloperApp, now: Date) {
  const seed = hashSeed(app.id);
  const base = app.environment === "production" ? 22 : 8;
  const multiplier = 1 + (seed % 4);

  return WEEKDAY_WEIGHT.map((weight, day) => {
    const wobble = 1 + (((seed + day * 13) % 5) - 2) / 10;
    return clampDay(now, day, Math.round(base * multiplier * weight * wobble));
  });
}

function workspaceActivity(now: Date) {
  return WEEKDAY_WEIGHT.map((weight, day) => clampDay(now, day, Math.round(10 * weight)));
}

function selectedApps(apps: DeveloperApp[], appId: string) {
  if (appId === "all") {
    return apps;
  }

  return apps.filter((app) => app.id === appId);
}

function sumWeeks(weeks: number[][]) {
  return weeks.reduce((totals, week) => week.map((value, index) => (totals[index] ?? 0) + value), [0, 0, 0, 0, 0, 0, 0]);
}

export function mockWeekActivity(apps: DeveloperApp[], appId: string, now = new Date()) {
  const weeks = selectedApps(apps, appId).map((app) => weekActivityForApp(app, now));

  if (appId === "all" && apps.length > 0) {
    weeks.push(workspaceActivity(now));
  }

  return sumWeeks(weeks);
}

export function mockCalls30(apps: DeveloperApp[], appId: string, now = new Date()) {
  return mockWeekActivity(apps, appId, now).reduce((sum, value) => sum + value, 0) * 4;
}
