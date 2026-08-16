import { BellIcon, CardIcon, CurrencyTransferIcon, MoneyHandIcon, UserIcon, WalletCardIcon } from "../icons";
import type { UseCaseCard } from "./types";

export const useCaseCards: UseCaseCard[] = [
  {
    category: "Pagos y Transferencias",
    title: "Acepte pagos en su checkout",
    description:
      "Reciba el pago de una venta debitando la cuenta del cliente, con información inmediata y comprobante digital.",
    icon: CurrencyTransferIcon,
    mediaTone: "warm",
  },
  {
    category: "Pagos y Transferencias",
    title: "Disperse nómina y pagos masivos",
    description:
      "Pague a cientos de beneficiarios en una sola corrida, con rastro y pagos duplicados por registro.",
    icon: WalletCardIcon,
  },
  {
    category: "Cuentas y saldos",
    title: "Muestre saldos y movimientos en su App",
    description:
      "Reciba el pago de una venta debitando la cuenta del cliente, con información inmediata y comprobante digital.",
    icon: MoneyHandIcon,
  },
  {
    category: "Identidad KYC",
    title: "Registro digital sin fricción",
    description:
      "Confirme la identidad con biometría y abra cuentas o registre usuarios en segundos, sin presencia física.",
    icon: UserIcon,
  },
  {
    category: "Tarjetas",
    title: "Emita tarjetas virtuales al instante",
    description:
      "Cree tarjetas con cupo y reglas para gastos corporativos, proveedores o beneficios, sin plásticos.",
    icon: CardIcon,
  },
  {
    category: "Notificaciones",
    title: "Concilie en tiempo real",
    description:
      "Escuche los avisos del banco y marque facturas como pagadas en el momento en que entra el dinero.",
    icon: BellIcon,
  },
];
