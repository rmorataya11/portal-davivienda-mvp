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
      "API Tesorería ya permite filtrar movimientos por fromDate y toDate en Sandbox. Sirve para probar conciliación sin pedir el histórico completo.",
    apiAffected: "API Tesorería",
  },
  {
    date: "2026-08-20",
    type: "cambio",
    title: "El identificador de cobro pasa a ser obligatorio al reversar",
    description:
      "En API Pay Davivienda, las reversas deben enviar chargeId. Las llamadas que solo mandaban el monto dejan de ser válidas en Sandbox.",
    apiAffected: "API Pay Davivienda",
  },
  {
    date: "2026-08-05",
    type: "deprecacion",
    title: "Se retira el campo accountAlias en validación de cuenta",
    description:
      "API Validación de Cuenta deja de aceptar accountAlias. Use accountNumber. El campo alias se elimina en la siguiente ventana de mantenimiento.",
    apiAffected: "API Validación de Cuenta",
  },
  {
    date: "2026-07-15",
    type: "nuevo",
    title: "Ambiente Sandbox disponible para Validación de Cuenta",
    description:
      "Ya puede probar la verificación de titularidad en Sandbox con credenciales de consola, sin pasar por una solicitud de contratación.",
    apiAffected: "API Validación de Cuenta",
  },
];
