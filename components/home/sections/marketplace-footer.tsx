import Link from "next/link";
import { useTranslations } from "next-intl";

import { FooterColumn } from "../cards/footer-column";
import { developerLinks, platformLinks, supportLinks } from "../content/footer-links";
import { DaviviendaLogo } from "../shared/davivienda-logo";

export function MarketplaceFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-black/5 bg-white px-4 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1920px]">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.7fr_0.8fr_0.8fr]">
          <div className="max-w-[360px]">
            <DaviviendaLogo variant="footer" />
            <p className="mt-7 text-[15px] leading-8 text-[#404040]">
              {t("description")}
            </p>
          </div>

          <FooterColumn titleKey="platform" links={platformLinks} />
          <FooterColumn titleKey="developers" links={developerLinks} />
          <FooterColumn titleKey="support" links={supportLinks} />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-black/8 pt-6 text-sm text-[#404040] sm:flex-row sm:justify-end sm:gap-10">
          <Link href="#terminos" className="transition-colors duration-300 hover:text-[#E1251B]">
            {t("terms")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
