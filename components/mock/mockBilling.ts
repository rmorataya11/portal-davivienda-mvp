// MOCK: reemplazar cuando se integre pasarela de pago real

export const mockCurrentPlan = {
  priceUsd: 300,
};

export type MockInvoiceStatus = "pagada" | "pendiente" | "vencida";

export const mockInvoices: Array<{
  id: string;
  date: string;
  amountUsd: number;
  status: MockInvoiceStatus;
}> = [
  { id: "FAC-2026-004", date: "2026-08-15", amountUsd: 300, status: "pagada" },
  { id: "FAC-2026-003", date: "2026-07-15", amountUsd: 300, status: "pagada" },
  { id: "FAC-2026-002", date: "2026-06-15", amountUsd: 235, status: "pagada" },
  { id: "FAC-2026-001", date: "2026-05-15", amountUsd: 180, status: "vencida" },
];

export const mockPaymentMethod = {
  brand: "Visa",
  last4: "4242",
  holder: "Empresa Demo S.A. de C.V.",
  expires: "08/28",
};

export const mockNextCharge = {
  date: "2026-09-15",
  amountUsd: 300,
};
