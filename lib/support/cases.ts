export type SupportCaseSeverity = "bloqueante" | "importante" | "consulta";

export type SupportCase = {
  id: string;
  title: string;
  description: string;
  severity: SupportCaseSeverity;
  apiSlug: string | null;
  createdAt: string;
};

const STORAGE_PREFIX = "support-cases:";

export function saveSupportCase(input: Omit<SupportCase, "id" | "createdAt">): SupportCase {
  const record: SupportCase = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  if (typeof window === "undefined") {
    return record;
  }

  // TODO: conectar a backend real de tickets de soporte cuando exista.
  // Por ahora el caso solo se guarda en localStorage y no llega a ningún sistema de soporte real.
  window.localStorage.setItem(`${STORAGE_PREFIX}${record.id}`, JSON.stringify(record));
  return record;
}
