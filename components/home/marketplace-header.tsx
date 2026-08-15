import Link from "next/link";

import { navItems } from "./data";

function DaviviendaLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-5 w-5 shrink-0">
        <span className="absolute left-[1px] top-[7px] h-[10px] w-[15px] rounded-[999px] bg-[#F6B400]" />
        <span className="absolute left-[2px] top-[2px] h-[7px] w-[13px] rounded-t-[999px] rounded-b-[4px] bg-[#B30D14] rotate-[-8deg]" />
        <span className="absolute left-[9px] top-[3px] h-[9px] w-[8px] rounded-t-[999px] rounded-b-[3px] bg-[#E1251B] rotate-[20deg]" />
      </div>
      <span className="text-[13px] font-medium tracking-[0.22em] text-white">DAVIVIENDA</span>
    </div>
  );
}

export function MarketplaceHeader() {
  return (
    <header className="static mx-auto flex w-full max-w-[1366px] justify-center px-4 pt-6 sm:px-6 lg:px-10">
      <div className="flex min-h-[88px] w-full max-w-[1301px] items-center rounded-[40px] bg-[linear-gradient(270deg,#E1111C_0%,#870412_100%)] px-6 text-white lg:px-8">
        <Link href="#inicio" className="flex shrink-0 items-center">
          <DaviviendaLogo />
        </Link>

        <nav className="relative ml-8 hidden items-end gap-8 border-b border-white/35 pb-2 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`relative pb-1.5 text-[13px] font-medium leading-none transition-colors ${item.active ? "text-white" : "text-white/90 hover:text-white"}`}
            >
              {item.label}
              {item.active ? (
                <span className="absolute inset-x-0 -bottom-[10px] h-0.5 rounded-full bg-white" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-8 sm:flex">
          <Link
            href="#crear-cuenta"
            className="text-[14px] font-medium text-white transition-opacity hover:opacity-85"
          >
            Crear cuenta
          </Link>
          <Link
            href="#iniciar-sesion"
            className="inline-flex min-h-[42px] min-w-[156px] items-center justify-center rounded-full bg-white px-7 text-[14px] font-bold text-[#404040] transition-colors hover:bg-[#F2F3F5]"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </header>
  );
}
