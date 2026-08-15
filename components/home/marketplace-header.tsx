import Link from "next/link";

import { navItems } from "./data";
import { ActionLink } from "@/components/ui/action-link";

export function MarketplaceHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-[1366px] justify-center px-4 pt-6 sm:px-6 lg:px-10">
      <div className="flex w-full max-w-[1240px] items-center gap-4 rounded-[30px] bg-[#C30D13] px-5 py-4 text-white shadow-[0_18px_48px_rgba(135,4,18,0.22)] lg:px-8">
        <Link href="#inicio" className="flex shrink-0 items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5B400] text-[11px] font-black text-[#870412]">
            D
          </div>
          <span className="text-xl font-medium tracking-[0.18em]">DAVIVIENDA</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`relative pb-2 text-sm transition-colors ${item.active ? "font-medium text-white" : "text-white/88 hover:text-white"}`}
            >
              {item.label}
              {item.active ? (
                <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-white" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 sm:flex">
          <ActionLink href="#crear-cuenta" className="bg-transparent px-5 text-white shadow-none hover:bg-white/8">
            Crear cuenta
          </ActionLink>
          <ActionLink
            href="#iniciar-sesion"
            className="min-w-[146px] bg-white px-6 text-[#141F25] shadow-none hover:bg-[#F2F3F5]"
          >
            Iniciar sesión
          </ActionLink>
        </div>
      </div>
    </header>
  );
}
