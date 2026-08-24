"use client";

import type { ReactNode } from "react";

import { AuthReturnLink } from "@/components/auth/auth-return-link";
import { useAuth } from "@/components/auth/auth-provider";
import { getLoginHref, getSignupHref } from "@/lib/navigation/safe-path";

export function ContractingAccessGate({
  children,
  returnTo,
}: {
  children: ReactNode;
  returnTo: string;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-64 animate-pulse rounded-[18px] bg-[#F2F3F5]" />;
  }

  if (!user) {
    return (
      <div>
        <h1 className="text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]">
          Inicie sesión para solicitar contratación
        </h1>
        <p className="mt-4 text-[16px] leading-7 tracking-[0.2px] text-[#6A7178]">
          Esta solicitud está disponible para cuentas de desarrollador que ya validaron una API en sandbox.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <AuthReturnLink
            href={getSignupHref(returnTo)}
            returnTo={returnTo}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
          >
            Crear cuenta
          </AuthReturnLink>
          <AuthReturnLink
            href={getLoginHref(returnTo)}
            returnTo={returnTo}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#E1251B] bg-white px-7 text-[15px] font-semibold text-[#E1251B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFF8F8]"
          >
            Iniciar sesión
          </AuthReturnLink>
        </div>
      </div>
    );
  }

  return children;
}
