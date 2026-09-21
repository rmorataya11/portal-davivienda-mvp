import type { UseCaseCard } from "./types";

export const useCaseCards: UseCaseCard[] = [
  {
    icon: "payments-checkout",
    category: "Pagos y Transferencias",
    title: "Acepte pagos en su checkout",
    description:
      "Reciba el pago de una venta debitando la cuenta del cliente, con información inmediata y comprobante digital.",
    imageSrc: "/home/images/pagos.jpg",
  },
  {
    icon: "payments-payroll",
    category: "Pagos y Transferencias",
    title: "Disperse nómina y pagos masivos",
    description:
      "Pague a cientos de beneficiarios en una sola corrida, con rastro y pagos duplicados por registro.",
    imageSrc: "/home/images/transferencia.jpg",
  },
  {
    icon: "accounts",
    category: "Cuentas y saldos",
    title: "Muestre saldos y\nmovimientos en su App",
    description:
      "Consulte saldos, movimientos y el detalle de cada operación dentro de su propia aplicación, en tiempo real.",
    imageSrc: "/home/images/cuentas_saldos.jpg",
  },
  {
    icon: "kyc",
    category: "Identidad KYC",
    title: "Registro digital sin fricción",
    description:
      "Valide la identidad de sus clientes de forma digital, con biometría facial y validación de documentos.",
    imageSrc: "/home/images/identity_kyc.jpg",
    imagePosition: "68% 42%",
  },
  {
    icon: "cards",
    category: "Tarjetas",
    title: "Emita tarjetas virtuales al instante",
    description:
      "Genere tarjetas virtuales para compras en línea seguras, con control total sobre topes y vigencia.",
    imageSrc: "/home/images/tarjetas.jpg",
  },
  {
    icon: "notifications",
    category: "Notificaciones",
    title: "Concilie en tiempo real",
    description:
      "Reciba notificaciones inmediatas de cada transacción, facilitando la conciliación y el control operativo.",
    imageSrc: "/home/images/notification.jpg",
  },
];
