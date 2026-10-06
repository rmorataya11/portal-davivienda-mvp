"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { useAuth } from "@/components/auth/auth-provider";
import { SlidingIndicator, useSlidingIndicator } from "@/components/ui/sliding-indicator";

import { navItems } from "../content/navigation";

export function MarketplaceDesktopNav({ activeHref = "/" }: { activeHref?: string }) {
  const { user } = useAuth();
  const t = useTranslations("Navbar");
  const visibleNavItems = navItems.filter((item) => item.href !== "/dashboard" || user);
  const activeKey = visibleNavItems.some((item) => item.href === activeHref) ? activeHref : null;
  const labels = visibleNavItems.map((item) => t(item.key)).join();
  const { listRef, rect, ready } = useSlidingIndicator<HTMLUListElement>(activeKey, {
    cacheKey: "marketplace-nav",
    insetX: 26,
    deps: [labels],
  });

  return (
    <nav className="hidden xl:block">
      <ul
        ref={listRef}
        className="relative flex items-center gap-12 border-b border-white/40 px-[26px]"
      >
        {visibleNavItems.map((item) => {
          const isActive = item.href === activeHref;

          return (
            <li key={item.key} className="w-fit">
              <Link
                href={item.href}
                data-tab={item.href}
                transitionTypes={["marketplace-nav"]}
                className={`relative inline-flex min-h-[44px] w-fit items-center text-[13px] leading-none whitespace-nowrap text-white transition-[font-weight] duration-200 ${
                  isActive ? "font-semibold" : "font-medium"
                }`}
              >
                {t(item.key)}
              </Link>
            </li>
          );
        })}
        <SlidingIndicator
          rect={rect}
          ready={ready}
          className="bg-white"
          viewTransitionName="marketplace-nav-underline"
        />
      </ul>
    </nav>
  );
}
