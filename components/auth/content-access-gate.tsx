"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AuthReturnLink } from "@/components/auth/auth-return-link";
import { useAuth } from "@/components/auth/auth-provider";
import { SectionContainer } from "@/components/ui/layout";
import { getLoginHref, getSignupHref } from "@/lib/navigation/safe-path";

type ContentAccessGateProps = {
  children: ReactNode;
  eyebrow: string;
  description: string;
  fallbackPath: string;
  variant?: "page" | "embedded";
};

export function ContentAccessGate({
  children,
  eyebrow,
  description,
  fallbackPath,
  variant = "page",
}: ContentAccessGateProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const returnTo = pathname || fallbackPath;

  if (loading) {
    if (variant === "embedded") {
      return <div className="h-32 animate-pulse rounded-[20px] bg-[#F2F3F5]" />;
    }

    return (
      <section className="pt-4 pb-16">
        <SectionContainer>
          <div className="h-64 animate-pulse rounded-[24px] bg-white" />
        </SectionContainer>
      </section>
    );
  }

  if (!user) {
    const prompt = (
      <div className="rounded-[24px] border border-[#E7EAEE] bg-[#F8F9FB] px-5 py-6 sm:px-7 sm:py-7">
        <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#8E8E8E]">{eyebrow}</p>
        <h3 className="mt-3 text-[22px] font-bold leading-[1.2] tracking-[0.2px] text-[#141F25]">
          Inicie sesión o cree una cuenta para ver este contenido
        </h3>
        <div className="mt-3 h-1.5 w-14 rounded-full bg-[#E1251B]" />
        <p className="mt-4 max-w-[640px] text-[15px] leading-7 text-[#6A7178]">{description}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <AuthReturnLink
            href={getSignupHref(returnTo)}
            returnTo={returnTo}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
          >
            Crear cuenta
          </AuthReturnLink>
          <AuthReturnLink
            href={getLoginHref(returnTo)}
            returnTo={returnTo}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#E1251B] bg-white px-6 text-[14px] font-semibold text-[#E1251B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFF8F8]"
          >
            Iniciar sesión
          </AuthReturnLink>
        </div>
      </div>
    );

    if (variant === "embedded") {
      return prompt;
    }

    return (
      <section className="pt-4 pb-16">
        <SectionContainer>
          <div className="rounded-[32px] border border-[#E7EAEE] bg-white px-6 py-8 shadow-[0_18px_50px_rgba(20,31,37,0.06)] sm:px-8 sm:py-10">
            <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#8E8E8E]">{eyebrow}</p>
            <h1 className="mt-4 text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]">
              Inicie sesión o cree una cuenta para ver este contenido
            </h1>
            <div className="mt-4 h-1.5 w-14 rounded-full bg-[#E1251B]" />
            <p className="mt-5 max-w-[640px] text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">{description}</p>
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
        </SectionContainer>
      </section>
    );
  }

  return children;
}
