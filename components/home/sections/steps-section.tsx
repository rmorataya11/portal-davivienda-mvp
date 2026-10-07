import Link from "next/link";
import { useTranslations } from "next-intl";

import { PageContainer } from "@/components/ui/layout";

import { StepCard } from "../cards/step-card";
import { stepCardDefinitions } from "../content/steps";

export function StepsSection() {
  const t = useTranslations("Home.steps");
  const stepCards = stepCardDefinitions.map((card) => ({
    ...card,
    title: t(`cards.${card.messageKey}.title`),
    description: t(`cards.${card.messageKey}.description`),
  }));

  return (
    <section id="catalogo" className="scroll-anchor pb-20 pt-1">
      <PageContainer>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[741px]">
            <p className="text-[24px] leading-7 font-normal tracking-[0.48px] text-[#E1251B]">{t("eyebrow")}</p>
            <h2 className="mt-[6px] text-[28px] leading-8 font-bold tracking-[0.64px] text-[#404040] sm:text-[32px] sm:leading-7">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/catalogo-apis"
            className="inline-flex h-12 w-full shrink-0 items-center justify-center rounded-[30px] bg-[#E1251B] text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C] sm:w-auto sm:min-w-[255px] sm:px-6"
          >
            {t("exploreProducts")}
          </Link>
        </div>

        <div className="mt-[41px] grid gap-[15px] md:grid-cols-2 xl:grid-cols-3">
          {stepCards.map((card) => (
            <StepCard key={card.step} card={card} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
