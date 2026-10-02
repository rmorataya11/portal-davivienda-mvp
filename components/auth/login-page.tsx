import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { DaviviendaLogo } from "@/components/home/shared/davivienda-logo";

import { LoginForm } from "./login-form";

export async function LoginPage() {
  const t = await getTranslations("Auth.login");
  const highlights = [t("highlights.0"), t("highlights.1"), t("highlights.2")];

  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <section className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[24px] bg-white shadow-[0_18px_50px_rgba(20,31,37,0.08)] lg:grid lg:max-w-[920px] lg:grid-cols-[0.9fr_1.1fr] lg:rounded-[28px]">
          <div className="border-b border-[#E7EAEE] bg-white px-5 py-5 text-[#141F25] sm:px-6 sm:py-5 lg:hidden">
            <Link href="/" className="inline-flex items-center">
              <DaviviendaLogo variant="auth" />
            </Link>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#E1251B]">{t("developers")}</p>
            <p className="mt-2 text-[18px] font-bold leading-6 tracking-[0.15px]">{t("headline")}</p>
          </div>

          <aside className="relative hidden overflow-hidden border-r border-[#E7EAEE] bg-white px-8 py-8 text-[#141F25] lg:flex lg:flex-col xl:px-10 xl:py-9">
            <div className="relative">
              <Link href="/" className="inline-flex items-center">
                <DaviviendaLogo variant="auth" />
              </Link>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#E1251B]">{t("developers")}</p>
            </div>

            <div className="relative my-auto py-8">
              <h2 className="max-w-[340px] text-[28px] font-bold leading-[1.15] tracking-[0.2px] xl:text-[32px]">
                {t("headline")}
              </h2>
              <ul className="mt-6 space-y-3">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] leading-6 text-[#6A7178]">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E1251B]">
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="relative text-[12px] tracking-[0.2px] text-[#8E8E8E]">{t("backedBy")}</p>
          </aside>

          <div className="flex items-start px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8 xl:px-10">
            <Suspense fallback={<div className="h-64 w-full max-w-[480px] animate-pulse rounded-[18px] bg-[#F2F3F5]" />}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.4 6.2L4.7 8.5L9.6 3.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
