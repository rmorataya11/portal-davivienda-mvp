export const productMessageKeys = {
  "api-tesoreria": "tesoreria",
  "api-estatus-pagos": "estatusPagos",
  "api-pay-davivienda": "payDavivienda",
  "api-validacion-cuenta": "validacionCuenta",
} as const;

export const categoryMessageKeys = {
  Cuentas: "accounts",
  Pagos: "payments",
  Tarjetas: "cards",
  "Pagos / Tarjetas": "paymentsCards",
} as const;

export const statusMessageKeys = {
  Producción: "production",
} as const;

export type CatalogTranslate = ((key: string) => string) & {
  has?: (key: string) => boolean;
};

function catalogMessage(t: CatalogTranslate, key: string, fallback: string) {
  if (t.has && !t.has(key)) {
    return fallback;
  }

  try {
    return t(key);
  } catch {
    return fallback;
  }
}

export function getProductMessageKey(slug: string) {
  return slug in productMessageKeys ? productMessageKeys[slug as keyof typeof productMessageKeys] : slug;
}

export function getCategoryMessageKey(category: string) {
  return category in categoryMessageKeys
    ? categoryMessageKeys[category as keyof typeof categoryMessageKeys]
    : category;
}

export function getCategoryTags(category: string) {
  return category
    .split("/")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function getStatusMessageKey(status: string) {
  return status in statusMessageKeys ? statusMessageKeys[status as keyof typeof statusMessageKeys] : status;
}

export function getCatalogFilterKeys(categories: string[]) {
  return ["all", ...Array.from(new Set(categories.flatMap(getCategoryTags).map(getCategoryMessageKey)))];
}

export function catalogItemMatchesFilter(category: string, filterKey: string) {
  if (filterKey === "all") {
    return true;
  }

  return getCategoryTags(category).some((tag) => getCategoryMessageKey(tag) === filterKey);
}

const filterChipFallbacks: Record<string, string> = {
  all: "Todas",
  accounts: "Cuentas",
  payments: "Pagos",
  cards: "Tarjetas",
  paymentsCards: "Pagos / Tarjetas",
};

export function getFilterChipLabel(t: CatalogTranslate, filterKey: string) {
  if (filterKey === "all") {
    return catalogMessage(t, "filters.all", filterChipFallbacks.all);
  }

  return catalogMessage(t, `categories.${filterKey}`, filterChipFallbacks[filterKey] ?? filterKey);
}

export function catalogCategoryLabel(category: string, t: CatalogTranslate) {
  return catalogMessage(t, `categories.${getCategoryMessageKey(category)}`, category);
}

export function catalogStatusLabel(status: string, t: CatalogTranslate) {
  return catalogMessage(t, `status.${getStatusMessageKey(status)}`, status);
}
