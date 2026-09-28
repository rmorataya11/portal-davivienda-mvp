import type { CreateAppInput, DeveloperApp } from "./types";

function randomToken(length = 18) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(length);

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export const DEMO_PRODUCTION_APP_ID = "app_demo_production";

export function createDemoProductionApp(): DeveloperApp {
  const createdAt = new Date("2026-08-12T15:00:00.000Z");
  const expires = new Date(createdAt.getTime() + 365 * 24 * 60 * 60 * 1000);

  return {
    id: DEMO_PRODUCTION_APP_ID,
    name: "Tesorería corporativa",
    description: "Integración de conciliación de movimientos en ambiente de producción.",
    productSlugs: ["api-tesoreria"],
    status: "production",
    consumerKey: "dvn_pk_live_tesoreria_corporativa",
    consumerSecret: "dvn_sk_live_tesoreria_corporativa_demo",
    baseUrl: "https://demo.nip.io/v1",
    expiresAt: expires.toISOString(),
    createdAt: createdAt.toISOString(),
    lastUsedAt: new Date().toISOString(),
  };
}

export function createDeveloperAppRecord(input: CreateAppInput): DeveloperApp {
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    id: `app_${now.getTime().toString(36)}_${randomToken(6)}`,
    name: input.name,
    description: input.description,
    productSlugs: input.productSlugs,
    status: "sandbox",
    consumerKey: `dvn_pk_sandbox_${randomToken(20)}`,
    consumerSecret: `dvn_sk_sandbox_${randomToken(28)}`,
    baseUrl: "https://demo.nip.io/v1",
    expiresAt: expires.toISOString(),
    createdAt: now.toISOString(),
    lastUsedAt: now.toISOString(),
  };
}

export function appUsageStats(app: DeveloperApp) {
  let hash = 0;
  for (const character of app.id) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  const callsLast30Days = 180 + (hash % 4820);
  const weeklyTotal = Math.max(48, Math.round(callsLast30Days / 4.3));
  const weekdayShare = [0.15, 0.16, 0.15, 0.17, 0.14, 0.12, 0.11];

  return {
    callsLast30Days,
    errorRate: ((hash % 28) + 4) / 10,
    avgLatencyMs: 120 + (hash % 260),
    consumedUsd: Number((callsLast30Days * 0.01).toFixed(2)),
    budgetUsd: 600,
    weekActivity: weekdayShare.map((share, index) => {
      const variance = 0.82 + (((hash + index * 19) % 36) / 100);
      return Math.max(8, Math.round(weeklyTotal * share * variance));
    }),
  };
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
