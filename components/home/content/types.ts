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

export type UseCaseCard = {
  category: string;
  title: string;
  description: string;
  imageSrc?: string;
  mediaTone?: "warm" | "neutral";
};

export type StepCard = {
  step: string;
  title: string;
  description: string;
};
