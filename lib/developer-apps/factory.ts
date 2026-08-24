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
    consumedCop: Math.round(callsLast30Days * 42),
    budgetCop: 2_500_000,
    weekActivity: weekdayShare.map((share, index) => {
      const variance = 0.82 + (((hash + index * 19) % 36) / 100);
      return Math.max(8, Math.round(weeklyTotal * share * variance));
    }),
  };
}

export function formatMoneyCop(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
