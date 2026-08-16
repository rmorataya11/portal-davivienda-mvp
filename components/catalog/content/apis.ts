import type { ComponentType } from "react";

import {
  BellIcon,
  CardIcon,
  CurrencyTransferIcon,
  LockIcon,
  MoneyHandIcon,
  WalletCardIcon,
  type IconProps,
} from "@/components/home/icons";

export type ApiCatalogItem = {
  name: string;
  description: string;
  category: string;
  status: "Producción";
  icon: ComponentType<IconProps>;
};

export const apiCategories = ["Todas", "Pagos", "Cuentas", "Autenticación", "Tarjetas", "Identidad"];

export const apiCatalogItems: ApiCatalogItem[] = [
  {
    name: "API Tesorería",
    description:
      "Optimice la liquidez corporativa y la toma de decisiones en tiempo real. Integre la posición consolidada de fondos de su empresa directamente con sus sistemas centrales.",
    category: "Cuentas",
    status: "Producción",
    icon: MoneyHandIcon,
  },
  {
    name: "API Dispersión de Fondos",
    description:
      "Automatice el pago masivo a proveedores y nóminas en segundos. Garantice operaciones directas con validación previa y comprobante instantáneo para maximizar su eficiencia operativa.",
    category: "Pagos",
    status: "Producción",
    icon: CurrencyTransferIcon,
  },
  {
    name: "API Notificación de Pago",
    description:
      "Reciba alertas automáticas e instantáneas en su sistema cada vez que un cliente realice un abono. Acelere la conciliación y cierre ventas al momento con verificación manual.",
    category: "Eventos",
    status: "Producción",
    icon: BellIcon,
  },
  {
    name: "API Daviplata as a Service",
    description:
      "Integre el ecosistema de la billetera digital líder de El Salvador en su propia plataforma. Facilite el onboarding, enrolamiento y transferencias ágiles, impulsando la inclusión financiera.",
    category: "Cuentas",
    status: "Producción",
    icon: WalletCardIcon,
  },
  {
    name: "API Información de Cuenta",
    description:
      "Acceda al historial detallado de movimientos y saldos bancarios bajo el estricto consentimiento del titular. Obtenga data valiosa para potenciar sus análisis financieros.",
    category: "Cuentas",
    status: "Producción",
    icon: CardIcon,
  },
  {
    name: "API Validación de Cuenta",
    description:
      "Mitigue el riesgo de fraude y rechazos verificando al instante la titularidad y el estado activo de las cuentas bancarias antes de originar cualquier transacción o contrato.",
    category: "Cuentas",
    status: "Producción",
    icon: LockIcon,
  },
  {
    name: "API Pay Davivienda",
    description:
      "Incorpore nuestra robusta pasarela de pagos en su e-commerce o aplicación. Procese cobros con tarjetas de crédito y débito de forma segura y con los más altos estándares de conversión.",
    category: "Pagos / Tarjetas",
    status: "Producción",
    icon: CardIcon,
  },
];
