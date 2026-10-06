import { useTranslations } from "next-intl";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { SectionContainer } from "@/components/ui/layout";

import { CatalogBrowser } from "./catalog-browser";
import { CatalogSignupCta } from "./catalog-signup-cta";

export function CatalogPage() {
  const t = useTranslations("Catalog.listing");

  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/catalogo-apis" />

      <section className="pt-4 pb-10">
        <SectionContainer>
          <h1 className="text-[30px] font-bold leading-[1.1] tracking-[0.8px] text-[#404040] sm:text-[40px] sm:leading-[44px]">
            {t("title")}
          </h1>
          <p className="mt-6 text-[17px] leading-7 tracking-[0.02em] text-[#404040] sm:mt-[32px] sm:text-[20px] sm:leading-6">
            {t("description")}
          </p>
        </SectionContainer>
      </section>

      <section className="pb-16">
        <div className="bg-white py-8 sm:py-10">
          <SectionContainer>
            <CatalogBrowser />
          </SectionContainer>
        </div>
      </section>

      <CatalogSignupCta />

      <MarketplaceFooter />
    </main>
  );
}
