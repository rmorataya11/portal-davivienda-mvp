"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { rememberReturnPath, clearReturnPath } from "@/lib/navigation/safe-path";

type AuthReturnLinkProps = {
  href: string;
  returnTo?: string;
  className?: string;
  children: ReactNode;
};

export function AuthReturnLink({ href, returnTo, className, children }: AuthReturnLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        if (returnTo) {
          rememberReturnPath(returnTo);
        } else {
          clearReturnPath();
        }
      }}
    >
      {children}
    </Link>
  );
}
