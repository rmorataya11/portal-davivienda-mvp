import type { ComponentType } from "react";

import type { IconProps } from "../icons";

export type NavItem = {
  label: string;
  href: string;
  active?: boolean;
};

export type ValueCard = {
  step: string;
  title: string;
  description: string;
  icon: ComponentType<IconProps>;
  wide?: boolean;
};

export type UseCaseCard = {
  category: string;
  title: string;
  description: string;
  icon: ComponentType<IconProps>;
  mediaTone?: "warm" | "neutral";
};

export type StepCard = {
  step: string;
  title: string;
  description: string;
};
