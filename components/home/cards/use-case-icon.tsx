import type { UseCaseIconName } from "../content/types";

export function UseCaseIcon({ name }: { name: UseCaseIconName }) {
  return (
    <svg className="inspire-card-icon-svg" viewBox="0 0 44 37" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {name === "payments-checkout" ? <PaymentsCheckoutIcon /> : null}
      {name === "payments-payroll" ? <PaymentsPayrollIcon /> : null}
      {name === "accounts" ? <AccountsIcon /> : null}
      {name === "kyc" ? <KycIcon /> : null}
      {name === "cards" ? <CardsIcon /> : null}
      {name === "notifications" ? <NotificationsIcon /> : null}
    </svg>
  );
}

function PaymentsCheckoutIcon() {
  return (
    <>
      <circle cx="22" cy="18.5" r="13" stroke="#404040" strokeWidth="1.6" />
      <path d="M22 11.5V25.5" stroke="#404040" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M18.2 14.8C18.2 13.4 19.8 12.4 22 12.4C24.2 12.4 25.8 13.4 25.8 14.8C25.8 16.2 24.4 16.8 22 17.2C19.6 17.6 18.2 18.4 18.2 20.2C18.2 21.8 19.8 22.8 22 22.8C24.2 22.8 25.8 21.8 25.8 20.2"
        stroke="#404040"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  );
}

function PaymentsPayrollIcon() {
  return (
    <>
      <path
        d="M10 13.5H30C31.7 13.5 33 14.8 33 16.5V25C33 26.7 31.7 28 30 28H14C11.8 28 10 26.2 10 24V13.5Z"
        stroke="#404040"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M10 13.5C10 11.6 11.6 10 13.5 10H24" stroke="#404040" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="18" y="18" width="14" height="9" rx="1.5" stroke="#404040" strokeWidth="1.6" />
    </>
  );
}

function AccountsIcon() {
  return (
    <>
      <rect x="11" y="8" width="18" height="22" rx="2" stroke="#404040" strokeWidth="1.6" />
      <path d="M15 14H25M15 18.5H25M15 23H21" stroke="#404040" strokeWidth="1.6" strokeLinecap="round" />
    </>
  );
}

function KycIcon() {
  return (
    <>
      <circle cx="22" cy="13" r="5.5" stroke="#404040" strokeWidth="1.6" />
      <path
        d="M11.5 29.5C12.8 23.8 16.8 20.5 22 20.5C27.2 20.5 31.2 23.8 32.5 29.5"
        stroke="#404040"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  );
}

function CardsIcon() {
  return (
    <>
      <rect x="8" y="11" width="28" height="18" rx="3" stroke="#404040" strokeWidth="1.6" />
      <path d="M8 17.5H36" stroke="#404040" strokeWidth="1.6" />
      <path d="M13 24H20" stroke="#404040" strokeWidth="1.6" strokeLinecap="round" />
    </>
  );
}

function NotificationsIcon() {
  return (
    <>
      <path
        d="M14 16.5C14 12.4 17.4 9 21.5 9C25.6 9 29 12.4 29 16.5V22L32 26H11L14 22V16.5Z"
        stroke="#404040"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M19 26.5C19.4 28.2 20.6 29.2 22 29.2C23.4 29.2 24.6 28.2 25 26.5" stroke="#404040" strokeWidth="1.6" strokeLinecap="round" />
    </>
  );
}
