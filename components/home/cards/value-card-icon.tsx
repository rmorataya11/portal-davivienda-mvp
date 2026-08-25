type ValueCardIconProps = {
  step: string;
  className?: string;
};

export function ValueCardIcon({ step, className = "" }: ValueCardIconProps) {
  return (
    <span className={`flex h-[95px] w-[95px] items-center justify-center rounded-full bg-[#3F3F3F] ${className}`}>
      {step === "01" ? <RocketIcon /> : null}
      {step === "02" ? <ArrowIcon /> : null}
      {step === "03" ? <LockIcon /> : null}
      {step === "04" ? <GrowthIcon /> : null}
    </span>
  );
}

function RocketIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M25.5 7.5C21 9 16.5 13 14 18L10.5 21.5L16 23L17.5 28.5L21 25C26 22.5 30 18 31.5 13.5C32.3 11.1 32.3 8.7 31.5 7.5C30.3 6.7 27.9 6.7 25.5 7.5Z"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M22.5 19.5C23.8807 19.5 25 18.3807 25 17C25 15.6193 23.8807 14.5 22.5 14.5C21.1193 14.5 20 15.6193 20 17C20 18.3807 21.1193 19.5 22.5 19.5Z" stroke="white" strokeWidth="2.4" />
      <path d="M13.5 24.5L9 29" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M17.5 28.5L13 33" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="7.5" y="7.5" width="27" height="27" rx="8" stroke="white" strokeWidth="2.4" />
      <path d="M15 21H27" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M22 16L27 21L22 26" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="9" y="18" width="24" height="16" rx="5" stroke="white" strokeWidth="2.4" />
      <path d="M15 18V14C15 10.6863 17.6863 8 21 8C24.3137 8 27 10.6863 27 14V18" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="21" cy="26" r="2.5" fill="white" />
    </svg>
  );
}

function GrowthIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="8" y="8" width="26" height="26" rx="8" stroke="white" strokeWidth="2.4" />
      <path d="M14 26L19 21L23 24L29 16" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25 16H29V20" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
