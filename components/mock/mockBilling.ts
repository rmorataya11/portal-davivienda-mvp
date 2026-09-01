// MOCK: reemplazar cuando se integre pasarela de pago real

export const mockCurrentPlan = {
  name: "Plan Profesional",
  priceLabel: "$ 1.250.000",
  period: "mensual",
  description: "Consumo de APIs en producción con soporte prioritario y límite ampliado de llamadas.",
  features: ["Hasta 100.000 llamadas / mes", "SLA de soporte 8x5", "Ambiente de producción incluido"],
};

export type MockInvoiceStatus = "pagada" | "pendiente" | "vencida";

export const mockInvoices: Array<{
  id: string;
  date: string;
  amountCop: number;
  status: MockInvoiceStatus;
}> = [
  { id: "FAC-2026-004", date: "2026-08-15", amountCop: 1_250_000, status: "pagada" },
  { id: "FAC-2026-003", date: "2026-07-15", amountCop: 1_250_000, status: "pagada" },
  { id: "FAC-2026-002", date: "2026-06-15", amountCop: 980_000, status: "pagada" },
  { id: "FAC-2026-001", date: "2026-05-15", amountCop: 750_000, status: "vencida" },
];

export const mockPaymentMethod = {
  brand: "Visa",
  last4: "4242",
  holder: "Empresa Demo S.A.S.",
  expires: "08/28",
};

export const mockNextCharge = {
  date: "2026-09-15",
  amountCop: 1_250_000,
};
