import Link from "next/link";

import { navItems } from "../content/navigation";

export function MarketplaceDesktopNav({ activeHref = "/" }: { activeHref?: string }) {
  return (
    <nav className="hidden lg:block">
      <ul className="flex items-center gap-7 border-b border-white/40">
        {navItems.map((item) => {
          const isActive = item.href === activeHref;

          return (
            <li key={item.label} className="relative">
              <Link
                href={item.href}
                transitionTypes={["marketplace-nav"]}
                className={`flex h-8 items-center text-[13px] leading-none whitespace-nowrap ${
                  isActive ? "font-semibold text-white" : "font-medium text-white"
                }`}
              >
                {item.label}
              </Link>
              {isActive ? <span className="absolute inset-x-0 -bottom-px h-[3px] bg-white" /> : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
