import type { ComponentType } from "react";

import {
  ArrowSquareIcon,
  BellIcon,
  CardIcon,
  CurrencyTransferIcon,
  GrowthIcon,
  type IconProps,
  LockIcon,
  MoneyHandIcon,
  RocketIcon,
  UserIcon,
  WalletCardIcon,
} from "./icons";

export type NavItem = {
  label: string;
  href: string;
  active?: boolean;
};

export type ValueCard = {
  step: string;
  title: string;
  description: string;
  icon: ComponentType<IconProps>;
  wide?: boolean;
};

export type UseCaseCard = {
  category: string;
  title: string;
  description: string;
  icon: ComponentType<IconProps>;
  mediaTone?: "warm" | "neutral";
};

export type StepCard = {
  step: string;
  title: string;
  description: string;
};

export const navItems: NavItem[] = [
  { label: "Inicio", href: "#inicio", active: true },
  { label: "Casos de uso", href: "#casos-de-uso" },
  { label: "Catálogo de APIs", href: "#catalogo" },
  { label: "Documentación", href: "#documentacion" },
  { label: "Soporte", href: "#soporte" },
];

export const partnerLogos = ["tigo business", "DELSUR", "The Coffee Cup", "AGRISAL"];

export const valueCards: ValueCard[] = [
  {
    step: "01",
    title: "Nuevas formas de crecer",
    description:
      "Ofrezca servicios financieros dentro de su propio producto y descubra oportunidades de ingreso que antes no estaban a su alcance.",
    icon: RocketIcon,
  },
  {
    step: "02",
    title: "Empiece sin complicaciones",
    description:
      "Le dejamos todo listo para arrancar: documentación clara y un entorno de pruebas para experimentar con total tranquilidad.",
    icon: ArrowSquareIcon,
  },
  {
    step: "03",
    title: "Tranquilidad en cada paso",
    description:
      "Detrás de cada conexión está Davivienda, cuidando la seguridad de su negocio y la confianza de sus clientes.",
    icon: LockIcon,
    wide: true,
  },
  {
    step: "04",
    title: "Crezca a su propio ritmo",
    description:
      "Comience con algo pequeño y escale cuando lo necesite. Nuestra tecnología avanza junto con usted.",
    icon: GrowthIcon,
    wide: true,
  },
];

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

export const stepCards: StepCard[] = [
  {
    step: "1",
    title: "Explore y elija su producto",
    description:
      "Recorra el catálogo y descubra la API que mejor se ajusta a lo que quiere lograr.",
  },
  {
    step: "2",
    title: "Cuéntenos su interés",
    description:
      "Déjenos sus datos y registre el producto que desea. Es rápido y sin compromiso.",
  },
  {
    step: "3",
    title: "Active sus credenciales",
    description:
      "Revisamos su solicitud y habilitamos sus accesos para que empiece a construir.",
  },
];

export const platformLinks = ["Inicio", "Casos de uso", "Catálogo de APIs", "Documentación", "Soporte"];
export const developerLinks = ["Crear una cuenta", "Iniciar sesión", "Sandbox", "Documentación técnica"];
export const supportLinks = ["Centro de ayuda", "Contactar con un experto", "Preguntas frecuentes"];
