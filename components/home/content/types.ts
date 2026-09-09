export type NavItem = {
  label: string;
  href: string;
  active?: boolean;
};

export type ValueCard = {
  step: string;
  title: string;
  description: string;
  imageSrc?: string;
  wide?: boolean;
};

export type UseCaseIconName =
  | "payments-checkout"
  | "payments-payroll"
  | "accounts"
  | "kyc"
  | "cards"
  | "notifications";

export type UseCaseCard = {
  category: string;
  title: string;
  description: string;
  icon: UseCaseIconName;
  imageSrc?: string;
};

export type StepCard = {
  step: string;
  title: string;
  description: string;
};
