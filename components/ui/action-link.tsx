import Link from "next/link";
import type { ReactNode } from "react";

function buttonClasses(variant: "primary" | "secondary") {
  if (variant === "primary") {
    return "bg-[#E1251B] text-white shadow-[0_16px_40px_rgba(225,37,27,0.25)] hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_20px_44px_rgba(225,37,27,0.32)]";
  }

  return "border border-[#707070] bg-white text-[#3F3F3F] hover:-translate-y-0.5 hover:border-[#2A3239] hover:text-[#141F25] hover:shadow-[0_14px_32px_rgba(20,31,37,0.12)]";
}

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function ActionLink({
  href,
  children,
  variant = "primary",
  className = "",
}: ActionLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold transition-all duration-300 ease-out ${buttonClasses(variant)} ${className}`}
    >
      {children}
    </Link>
  );
}
