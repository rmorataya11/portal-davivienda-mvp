import type { UseCaseCard } from "./types";

export const useCaseCardDefinitions: Array<
  Pick<UseCaseCard, "icon" | "imageSrc" | "imagePosition"> & {
    messageKey: "checkout" | "payroll" | "accounts" | "identity" | "cards" | "notifications";
  }
> = [
  {
    icon: "payments-checkout",
    messageKey: "checkout",
    imageSrc: "/home/images/pagos.jpg",
  },
  {
    icon: "payments-payroll",
    messageKey: "payroll",
    imageSrc: "/home/images/transferencia.jpg",
  },
  {
    icon: "accounts",
    messageKey: "accounts",
    imageSrc: "/home/images/cuentas_saldos.jpg",
  },
  {
    icon: "kyc",
    messageKey: "identity",
    imageSrc: "/home/images/identity_kyc.jpg",
    imagePosition: "68% 42%",
  },
  {
    icon: "cards",
    messageKey: "cards",
    imageSrc: "/home/images/tarjetas.jpg",
  },
  {
    icon: "notifications",
    messageKey: "notifications",
    imageSrc: "/home/images/notification.jpg",
  },
];
