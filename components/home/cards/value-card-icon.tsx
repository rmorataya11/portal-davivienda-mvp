type ValueCardIconProps = {
  step: string;
  className?: string;
};

export function ValueCardIcon({ step, className = "" }: ValueCardIconProps) {
  return (
    <span className={`why-card-icon ${className}`}>
      {step === "01" ? <RocketIcon /> : null}
      {step === "02" ? <ArrowIcon /> : null}
      {step === "03" ? <LockIcon /> : null}
      {step === "04" ? <ShieldCheckIcon /> : null}
    </span>
  );
}

function RocketIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M19.4 5.2C15.8 6.4 12.2 9.6 10.2 13.6L7.4 16.4L11.8 17.6L13 21.8L15.8 19C19.8 17 23 13.4 24.2 9.8C24.8 7.9 24.8 6 24.2 5.2C23.2 4.6 21.4 4.6 19.4 5.2Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.2 14.2C18.3 14.2 19.2 13.3 19.2 12.2C19.2 11.1 18.3 10.2 17.2 10.2C16.1 10.2 15.2 11.1 15.2 12.2C15.2 13.3 16.1 14.2 17.2 14.2Z"
        stroke="white"
        strokeWidth="2"
      />
      <path d="M10 18.8L6.4 22.4" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M13.2 22L9.6 25.6" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="5.5" y="5.5" width="21" height="21" rx="6" stroke="white" strokeWidth="2" />
      <path d="M11 16H21" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M17.5 12L21.5 16L17.5 20"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="6.5" y="14" width="19" height="12.5" rx="4" stroke="white" strokeWidth="2" />
      <path
        d="M11 14V11.2C11 8.4 13.2 6.5 16 6.5C18.8 6.5 21 8.4 21 11.2V14"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="20.4" r="1.6" fill="white" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M16 5L25 9.2V16.4C25 21.4 21.4 25.8 16 27.2C10.6 25.8 7 21.4 7 16.4V9.2L16 5Z"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M11.8 16.2L14.6 19L20.4 13"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
