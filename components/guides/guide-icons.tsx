import type { GuideIconId } from "@/lib/guides/guides-content";

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 4 6 6.5v5.2c0 3.6 2.3 6.2 6 7.8 3.7-1.6 6-4.2 6-7.8V6.5L12 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BankIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 10h16M12 5 4.8 10h14.4L12 5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path
        d="M6.5 10v6.5M10.5 10v6.5M13.5 10v6.5M17.5 10v6.5M4.5 16.5h15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M6.5 16.5h11S16.5 13 16.5 10.5a4.5 4.5 0 1 0-9 0C7.5 13 6.5 16.5 6.5 16.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M10 18.2a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function RetryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M7 8.5A6 6 0 1 1 6 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M7 4.8V8.5H3.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M14 6c2.2 1 4.2 3 5.2 5.2-2.2 1-4.2 3-5.2 5.2-2.2-1-4.2-3-5.2-5.2C10 9 12 7 14 6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="11.2" r="1.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.8 15.2 6 18.5M8.2 17.8 5.5 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 5 4.8 18.5h14.4L12 5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 10v4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="16.4" r="0.8" fill="currentColor" />
    </svg>
  );
}

const icons = {
  shield: ShieldIcon,
  bank: BankIcon,
  bell: BellIcon,
  retry: RetryIcon,
  rocket: RocketIcon,
  alert: AlertIcon,
} as const;

export function GuideIcon({ id, className }: { id: GuideIconId; className?: string }) {
  const Icon = icons[id];
  return <Icon className={className} />;
}
