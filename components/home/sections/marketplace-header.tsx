import Link from "next/link";

import { navItems } from "../content/navigation";
import { DaviviendaLogo } from "../shared/davivienda-logo";

export function MarketplaceHeader({ activeHref = "/" }: { activeHref?: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-6 sm:px-6 lg:px-10">
      <div className="flex min-h-[88px] w-full max-w-[1301px] items-center rounded-[40px] bg-[linear-gradient(270deg,#E1111C_0%,#870412_100%)] px-6 text-white lg:px-8">
        <Link href="/" transitionTypes={["marketplace-nav"]} className="flex shrink-0 items-center">
          <DaviviendaLogo />
        </Link>

        <nav className="relative ml-8 hidden items-end gap-8 border-b border-white/35 pb-2 lg:flex">
          {navItems.map((item) => {
            const isActive = item.href === activeHref;

            return (
              <Link
                key={item.label}
                href={item.href}
                transitionTypes={["marketplace-nav"]}
                className={`relative pb-1.5 text-[13px] font-medium leading-none transition-colors ${isActive ? "text-white" : "text-white/90 hover:text-white"}`}
              >
                {item.label}
                {isActive ? (
                  <span className="absolute inset-x-0 -bottom-[10px] h-0.5 rounded-full bg-white" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-8 sm:flex">
          <Link href="#crear-cuenta" className="text-[14px] font-medium text-white transition-opacity hover:opacity-85">
            Crear cuenta
          </Link>
          <Link
            href="#iniciar-sesion"
            className="inline-flex min-h-[42px] min-w-[156px] items-center justify-center rounded-full bg-white px-7 text-[14px] font-bold !text-[#404040] transition-colors hover:bg-[#F2F3F5]"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </header>
  );
}
