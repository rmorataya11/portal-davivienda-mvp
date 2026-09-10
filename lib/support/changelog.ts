export type ChangelogType = "nuevo" | "cambio" | "deprecacion";

export type ChangelogEntry = {
  date: string;
  type: ChangelogType;
  title: string;
  description: string;
  apiAffected?: string;
};

export const changelogEntries: ChangelogEntry[] = [
  {
    date: "2026-09-01",
    type: "nuevo",
    title: "Consulta de movimientos con rango de fechas en Sandbox",
    description:
      "API Tesorería ya permite filtrar movimientos por fechaInicial y fechaFinal en Sandbox. Sirve para probar conciliación sin pedir el histórico completo.",
    apiAffected: "API Tesorería",
  },
];
