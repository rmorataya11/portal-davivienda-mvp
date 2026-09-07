import Link from "next/link";

import { HeaderOffset } from "./header-offset";
import { AuthNav } from "./auth-nav";
import { MarketplaceDesktopNav } from "./marketplace-nav";
import { MarketplaceMobileMenu } from "./marketplace-mobile-menu";
import { DaviviendaLogo } from "../shared/davivienda-logo";

export function MarketplaceHeader({ activeHref = "/" }: { activeHref?: string }) {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4 lg:px-10 lg:pt-6">
        <div className="w-full max-w-[1301px] rounded-[28px] bg-[linear-gradient(270deg,#E1111C_0%,#870412_100%)] px-4 py-4 text-white sm:px-5 lg:rounded-[40px] lg:px-8 lg:py-0">
          <div className="flex items-center lg:h-[88px]">
            <div className="flex min-w-0 items-center gap-8">
              <Link
                href="/"
                transitionTypes={["marketplace-nav"]}
                className="flex shrink-0 items-center"
              >
                <DaviviendaLogo />
              </Link>

              <MarketplaceDesktopNav activeHref={activeHref} />
            </div>

            <div className="ml-auto hidden lg:flex">
              <AuthNav />
            </div>

            <MarketplaceMobileMenu activeHref={activeHref} className="ml-auto lg:hidden" />
          </div>
        </div>
      </header>

      <HeaderOffset />
    </>
  );
}
