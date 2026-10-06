import Link from "next/link";
import { useTranslations } from "next-intl";

import { SectionContainer } from "@/components/ui/layout";

import type { CatalogView } from "@/lib/catalog/present";

export function DetailFinalCta({ api }: { api: CatalogView }) {
  const t = useTranslations("Catalog.detail");

  return (
    <section id="next-steps" className="scroll-anchor pb-16">
      <SectionContainer>
        <div className="flex flex-col gap-6 rounded-2xl bg-white px-5 py-6 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-10">
          <div className="min-w-0">
            <h2 className="text-[22px] font-bold tracking-[0.2px] text-[#404040] sm:text-[26px]">
              {t("nextStepTitle")}
            </h2>
            <p className="mt-3 max-w-[720px] text-[15px] font-normal leading-6 tracking-[0.2px] text-[#8E8E8E] sm:text-[16px] sm:leading-[22px]">
              {t("nextStepDescription", { name: api.name })}
            </p>
          </div>

          <Link
            href={`/catalogo-apis/${api.slug}/detalle-tecnico`}
            className="inline-flex h-[46px] w-full shrink-0 items-center justify-center rounded-[30px] border border-[#E1251B] bg-transparent text-[14px] font-semibold text-[#E1251B] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#FFF8F8] sm:w-[246px]"
          >
            {t("viewTechnicalDetail")}
          </Link>
        </div>
      </SectionContainer>
    </section>
  );
}
