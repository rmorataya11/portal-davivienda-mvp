import Link from "next/link";

import { navItems } from "../content/navigation";

export function MarketplaceDesktopNav({ activeHref = "/" }: { activeHref?: string }) {
  return (
    <nav className="hidden xl:block">
      <ul className="flex items-center gap-12 border-b border-white/40 px-[26px]">
        {navItems.map((item) => {
          const isActive = item.href === activeHref;

          return (
            <li key={item.label} className="relative w-fit">
              <Link
                href={item.href}
                transitionTypes={["marketplace-nav"]}
                className={`relative inline-flex min-h-[44px] w-fit items-center text-[13px] leading-none whitespace-nowrap text-white after:pointer-events-none after:absolute after:bottom-0 after:left-[-26px] after:h-[3px] after:w-[calc(100%+52px)] after:bg-white ${
                  isActive ? "font-semibold after:opacity-100" : "font-medium after:opacity-0"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
