export type NavItem = {
  label: string;
  href: string;
  active?: boolean;
};

export type ValueCard = {
  step: string;
  title: string;
  description: string;
  wide?: boolean;
};

export type UseCaseCard = {
  category: string;
  title: string;
  description: string;
  mediaTone?: "warm" | "neutral";
};

export type StepCard = {
  step: string;
  title: string;
  description: string;
};
