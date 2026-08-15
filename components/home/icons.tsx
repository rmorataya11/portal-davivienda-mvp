import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

export function RocketIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M5 19c1.5-4.5 5-8.2 9.5-10.8l3.4-2 1.1 1.1-2 3.4C14.2 15.2 10.5 18.6 6 20Z" />
      <path d="M11 8.5 15.5 13" />
      <circle cx="14.8" cy="9.2" r="1.35" />
      <path d="M7.2 16.8 4 20m4.4-1.6-2.8 1" />
    </svg>
  );
}

export function ArrowSquareIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
      <path d="M9 12h7m0 0-2.8-2.8M16 12l-2.8 2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <rect x="6.3" y="10.2" width="11.4" height="9.5" rx="2.5" />
      <path d="M8.8 10.2V8.4a3.2 3.2 0 1 1 6.4 0v1.8" />
    </svg>
  );
}

export function GrowthIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M5 18.5h14" strokeLinecap="round" />
      <path d="M6.5 16V11l4-4 3.2 3.2L18 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 10V6h-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CurrencyTransferIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M4.8 7.4A7.6 7.6 0 0 1 18.3 6" strokeLinecap="round" />
      <path d="M19.2 6v4.1H15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.2 16.6A7.6 7.6 0 0 1 5.7 18" strokeLinecap="round" />
      <path d="M4.8 18v-4.1H9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.2 8.6c1.1 0 2 .7 2 1.7s-.9 1.5-2 1.8c-1.1.3-2 .8-2 1.8s.9 1.7 2 1.7m0-6v6m-2.8-5.2h5.6" strokeLinecap="round" />
    </svg>
  );
}

export function WalletCardIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M5.2 7.5h10.3a2.7 2.7 0 0 1 2.7 2.7v6.1a2.7 2.7 0 0 1-2.7 2.7H7.3a2.8 2.8 0 0 1-2.8-2.8V8.7a2.2 2.2 0 0 1 2.2-2.2h8.1" />
      <path d="M15.2 11.3h4.2v3.5h-4.2a1.7 1.7 0 0 1 0-3.5Z" />
      <circle cx="15.7" cy="13.05" r=".55" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MoneyHandIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M4.5 15.2h4.1l1.7 1.7H15a2 2 0 0 0 2-2V14a1.6 1.6 0 0 0-1.6-1.6h-4.3l-1.6-1.6H7.2a2.7 2.7 0 0 0-2.7 2.7Z" />
      <path d="M15.6 12.4 18.8 9a2.1 2.1 0 1 1 3 3l-3.6 3.6a4 4 0 0 1-2.8 1.2H12" />
      <path d="M15.7 6.6c0 1-.9 1.8-2.1 1.8s-2.1-.8-2.1-1.8.9-1.8 2.1-1.8 2.1.8 2.1 1.8Z" />
      <path d="M13.6 4.8v3.6m-1.5-1.8h3" strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <circle cx="12" cy="8.1" r="3.5" />
      <path d="M5.5 18.8c1.7-2.7 4-4 6.5-4s4.8 1.3 6.5 4" strokeLinecap="round" />
    </svg>
  );
}

export function CardIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <rect x="3.8" y="6.2" width="16.4" height="11.6" rx="2.6" />
      <path d="M3.8 10.1h16.4" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M8.2 18.2h7.6l-1.1-1.7v-4.3a3.7 3.7 0 1 0-7.4 0v4.3Z" />
      <path d="M10.1 19.3a2 2 0 0 0 3.8 0" strokeLinecap="round" />
    </svg>
  );
}

export function LightBulbIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M8.8 14.7c-1.4-1-2.3-2.6-2.3-4.4A5.5 5.5 0 1 1 17.5 10c0 2-1 3.8-2.7 4.9v1.8H9v-2Z" />
      <path d="M10 19h4m-3-2.3h2" strokeLinecap="round" />
      <path d="M12 7.4v4.2m0 0-1.7-1.8M12 11.6l1.7-1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
