import type { UseCaseIconName } from "../content/types";

const customIcons: Record<UseCaseIconName, { src: string; compact?: boolean }> = {
  "payments-checkout": { src: "/home/icons/pagos.svg" },
  "payments-payroll": { src: "/home/icons/transferencia.svg", compact: true },
  accounts: { src: "/home/icons/cuentas.svg" },
  kyc: { src: "/home/icons/identidad.svg", compact: true },
  cards: { src: "/home/icons/tarjeta.svg", compact: true },
  notifications: { src: "/home/icons/notification.svg", compact: true },
};

export function UseCaseIcon({ name }: { name: UseCaseIconName }) {
  const customIcon = customIcons[name];

  return (
    <img
      src={customIcon.src}
      alt=""
      width={52}
      height={48}
      className={customIcon.compact ? "inspire-card-icon-img inspire-card-icon-img-sm" : "inspire-card-icon-img"}
      aria-hidden="true"
    />
  );
}
