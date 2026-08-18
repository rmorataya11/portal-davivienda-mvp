import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";

import { LoginForm } from "./login-form";

const loginHighlights = [
  "Un entorno de pruebas para experimentar sin riesgos",
  "Ejemplos listos para copiar y pegar",
  "Un equipo cercano para cuando lo necesite",
];

export function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader />

      <section className="px-3 pb-6 pt-[118px] sm:px-5 sm:pt-[128px] lg:px-0 lg:pb-8 lg:pt-[132px]">
        <div className="mx-auto grid min-h-[calc(100vh-168px)] max-w-[1366px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_50px_rgba(20,31,37,0.08)] lg:grid-cols-2 lg:rounded-[32px]">
          <aside className="relative hidden overflow-hidden bg-[#141F25] px-10 py-12 text-white lg:flex lg:flex-col">
            <div className="absolute -left-16 -top-24 h-[340px] w-[340px] rounded-full bg-[#E1251B]/28 blur-3xl" />
            <div className="absolute bottom-[-80px] right-[-60px] h-[220px] w-[220px] rounded-full bg-[#870412]/35 blur-3xl" />

            <div className="relative">
              <p className="text-[13px] font-medium uppercase tracking-[0.22em] text-white/90">logo</p>
              <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.28em] text-white">Developers</p>
              <h2 className="mt-16 max-w-[420px] text-[40px] font-bold leading-[1.12] tracking-[0.3px]">
                Nos encanta acompañar a quienes se atreven a crear.
              </h2>
              <ul className="mt-10 space-y-4">
                {loginHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[16px] leading-7 text-white/88">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/30">
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="relative mt-auto pt-12 text-[13px] text-white/62">Con el respaldo de Davivienda</p>
          </aside>

          <div className="flex items-center px-5 py-10 sm:px-10 lg:px-16 lg:py-14">
            <div className="w-full">
              <p className="mb-6 text-[12px] font-bold uppercase tracking-[0.28em] text-[#E1251B] lg:hidden">
                Developers
              </p>
              <LoginForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.4 6.2L4.7 8.5L9.6 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
