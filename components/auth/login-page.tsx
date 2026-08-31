import { Suspense } from "react";
import Link from "next/link";

import { LoginForm } from "./login-form";

const loginHighlights = [
  "Un entorno de pruebas para experimentar sin riesgos",
  "Ejemplos listos para copiar y pegar",
  "Un equipo cercano para cuando lo necesite",
];

export function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <section className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[24px] bg-white shadow-[0_18px_50px_rgba(20,31,37,0.08)] lg:grid lg:max-w-[920px] lg:grid-cols-[0.9fr_1.1fr] lg:rounded-[28px]">
          <div className="border-b border-[#E7EAEE] bg-white px-5 py-5 text-[#141F25] sm:px-6 sm:py-5 lg:hidden">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8E8E8E]">Developers</p>
            <p className="mt-2 text-[18px] font-bold leading-6 tracking-[0.15px]">
              Nos encanta acompañar a quienes se atreven a crear.
            </p>
          </div>

          <aside className="relative hidden overflow-hidden border-r border-[#E7EAEE] bg-white px-8 py-8 text-[#141F25] lg:flex lg:flex-col xl:px-10 xl:py-9">
            <span className="absolute inset-y-0 left-0 w-1 bg-[#E1251B]" />
            <div className="pointer-events-none absolute -left-20 top-[-70px] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(225,37,27,0.18)_0%,rgba(135,4,18,0.08)_42%,transparent_70%)]" />
            <div className="pointer-events-none absolute -right-12 bottom-[-70px] h-[180px] w-[180px] rounded-full border border-[#E7EAEE]" />

            <div className="relative">
              <Link
                href="/"
                className="inline-flex h-9 items-center rounded-[8px] border border-[#E7EAEE] bg-[#F8F9FB] px-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#404040] transition-colors hover:bg-[#F2F3F5]"
              >
                logo
              </Link>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#E1251B]">Developers</p>
            </div>

            <div className="relative my-auto py-8">
              <h2 className="max-w-[340px] text-[28px] font-bold leading-[1.15] tracking-[0.2px] xl:text-[32px]">
                Nos encanta acompañar a quienes se atreven a crear.
              </h2>
              <ul className="mt-6 space-y-3">
                {loginHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] leading-6 text-[#6A7178]">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E1251B]">
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="relative text-[12px] tracking-[0.2px] text-[#8E8E8E]">Con el respaldo de Davivienda</p>
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
