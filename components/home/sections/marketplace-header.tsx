import Link from "next/link";

import { AuthNav } from "./auth-nav";
import { navItems } from "../content/navigation";
import { DaviviendaLogo } from "../shared/davivienda-logo";

export function MarketplaceHeader({ activeHref = "/" }: { activeHref?: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4 lg:px-10 lg:pt-6">
      <div className="w-full max-w-[1301px] rounded-[28px] bg-[linear-gradient(270deg,#E1111C_0%,#870412_100%)] px-4 py-4 text-white sm:px-5 lg:min-h-[88px] lg:rounded-[40px] lg:px-8 lg:py-0">
        <div className="flex items-center gap-4 lg:min-h-[88px]">
          <Link
            href="/"
            transitionTypes={["marketplace-nav"]}
            className="flex shrink-0 items-center transition-transform duration-300 ease-out hover:scale-[1.02]"
          >
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
                  className={`relative pb-1.5 text-[13px] font-medium leading-none transition-all duration-300 ${isActive ? "text-white" : "text-white/90 hover:text-white hover:drop-shadow-[0_4px_10px_rgba(255,255,255,0.22)]"}`}
                >
                  {item.label}
                  {isActive ? (
                    <span className="absolute inset-x-0 -bottom-[10px] h-0.5 rounded-full bg-white" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <AuthNav />
        </div>

        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {navItems.map((item) => {
            const isActive = item.href === activeHref;

            return (
              <Link
                key={item.label}
                href={item.href}
                transitionTypes={["marketplace-nav"]}
                className={`inline-flex shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 ${
                  isActive ? "bg-white text-[#870412]" : "bg-white/10 text-white/90"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
