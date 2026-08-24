"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";

type ContractingRequestLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function ContractingRequestLink({ href, className, children }: ContractingRequestLinkProps) {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return null;
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
