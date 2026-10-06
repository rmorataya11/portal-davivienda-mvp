import Link from "next/link";
import { useTranslations } from "next-intl";

import { FooterColumn } from "../cards/footer-column";
import { developerLinks, platformLinks, supportLinks } from "../content/footer-links";
import { DaviviendaLogo } from "../shared/davivienda-logo";

export function MarketplaceFooter() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="px-4 py-14 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.7fr_0.8fr_0.8fr]">
            <div className="max-w-[360px]">
              <DaviviendaLogo variant="footer" />
              <p className="mt-7 text-[15px] leading-8 text-[#404040]">{t("description")}</p>
            </div>

            <FooterColumn titleKey="platform" links={platformLinks} />
            <FooterColumn titleKey="developers" links={developerLinks} />
            <FooterColumn titleKey="support" links={supportLinks} />
          </div>

          <div className="mt-14 flex justify-end border-t border-black/8 pt-6 text-sm text-[#404040]">
            <Link href="#terminos" className="transition-colors duration-300 hover:text-[#E1251B]">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>

      <div className="flex h-[75px] items-center bg-[#404040] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1920px]">
          <p className="text-sm text-white">{t("copyright", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
