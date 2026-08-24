import Link from "next/link";

import { navItems } from "../content/navigation";

export function MarketplaceDesktopNav({ activeHref = "/" }: { activeHref?: string }) {
  return (
    <nav className="relative ml-8 hidden items-end gap-6 border-b border-white/35 pb-2 lg:flex xl:gap-8">
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
            {isActive ? <span className="absolute inset-x-0 -bottom-[10px] h-0.5 rounded-full bg-white" /> : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function MarketplaceMobileNav({ activeHref = "/" }: { activeHref?: string }) {
  return (
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
  );
}
