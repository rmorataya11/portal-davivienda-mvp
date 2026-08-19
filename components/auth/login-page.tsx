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
      <section className="px-3 py-6 sm:px-5 lg:px-8 lg:py-8">
        <div className="mx-auto grid min-h-[calc(100vh-48px)] max-w-[1366px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_50px_rgba(20,31,37,0.08)] lg:min-h-[calc(100vh-64px)] lg:grid-cols-2 lg:rounded-[32px]">
          <div className="bg-[#141F25] px-5 py-6 text-white lg:hidden">
            <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-white/80">Developers</p>
            <p className="mt-3 max-w-[420px] text-[22px] font-bold leading-7 tracking-[0.2px]">
              Nos encanta acompañar a quienes se atreven a crear.
            </p>
          </div>

          <aside className="relative hidden overflow-hidden bg-[#141F25] px-12 py-12 text-white lg:flex lg:flex-col">
            <span className="absolute inset-y-0 left-0 w-1 bg-[#E1251B]" />
            <div className="pointer-events-none absolute -left-24 top-[-80px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(225,37,27,0.42)_0%,rgba(135,4,18,0.18)_42%,transparent_70%)]" />
            <div className="pointer-events-none absolute -right-16 bottom-[-90px] h-[280px] w-[280px] rounded-full border border-white/8" />

            <div className="relative">
              <Link
                href="/"
                className="inline-flex h-11 items-center rounded-[10px] border border-white/14 bg-white/8 px-3 text-[12px] font-medium uppercase tracking-[0.22em] text-white/90 transition-colors hover:bg-white/12"
              >
                logo
              </Link>
              <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.28em] text-white">Developers</p>
            </div>

            <div className="relative my-auto py-12">
              <h2 className="max-w-[460px] text-[44px] font-bold leading-[1.1] tracking-[0.28px]">
                Nos encanta acompañar a quienes se atreven a crear.
              </h2>
              <ul className="mt-9 space-y-4">
                {loginHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[16px] leading-7 text-white/88">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E1251B]">
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="relative mt-auto text-[13px] tracking-[0.2px] text-white/58">Con el respaldo de Davivienda</p>
          </aside>

          <div className="flex items-start px-5 py-8 sm:px-10 sm:py-10 lg:px-16 lg:pt-[72px] lg:pb-14">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.4 6.2L4.7 8.5L9.6 3.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
