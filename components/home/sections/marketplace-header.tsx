import { Suspense } from "react";
import Link from "next/link";

import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { SectionContainer } from "@/components/ui/layout";

import { AuthNav } from "./auth-nav";
import { MarketplaceDesktopNav } from "./marketplace-nav";
import { MarketplaceMobileMenu } from "./marketplace-mobile-menu";
import { DaviviendaLogo } from "../shared/davivienda-logo";

export function MarketplaceHeader({ activeHref = "/" }: { activeHref?: string }) {
  return (
    <>
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

            <MarketplaceDesktopNav activeHref={activeHref} />

            <div className="ml-auto hidden lg:flex">
              <AuthNav />
            </div>

            <MarketplaceMobileMenu activeHref={activeHref} className="ml-auto lg:hidden" />
          </div>
        </div>
      </header>

      <div className="pt-[104px] sm:pt-[120px] lg:pt-[132px]">
        <SectionContainer>
          <Suspense fallback={null}>
            <PageBreadcrumb />
          </Suspense>
        </SectionContainer>
      </div>
    </>
  );
}
