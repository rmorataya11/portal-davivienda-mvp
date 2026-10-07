// MOCK: cargos de demostración hasta que Facturación se conecte al core.

export type MockInvoiceStatus = "debitada" | "programada" | "sin_fondos";

export const mockChargeAccount = {
  type: "corriente" as const,
  last4: "7821",
  bank: "Davivienda",
  currency: "USD",
};

export const mockPeriodUsage = {
  calls: 12840,
  monthKey: "2026-09",
};

export const mockInvoices: Array<{
  id: string;
  period: string;
  date: string;
  amountUsd: number;
  status: MockInvoiceStatus;
}> = [
  { id: "FAC-2026-004", period: "2026-09", date: "2026-09-30", amountUsd: 248, status: "programada" },
  { id: "FAC-2026-003", period: "2026-08", date: "2026-08-29", amountUsd: 300, status: "debitada" },
  { id: "FAC-2026-002", period: "2026-07", date: "2026-07-31", amountUsd: 300, status: "debitada" },
  { id: "FAC-2026-001", period: "2026-06", date: "2026-06-30", amountUsd: 187, status: "sin_fondos" },
];
