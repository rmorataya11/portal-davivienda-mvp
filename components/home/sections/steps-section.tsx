import Link from "next/link";

import { PageContainer } from "@/components/ui/layout";

import { StepCard } from "../cards/step-card";
import { stepCards } from "../content/steps";

export function StepsSection() {
  return (
    <section id="catalogo" className="scroll-anchor pb-20 pt-1">
      <PageContainer>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[741px]">
            <p className="text-[24px] leading-7 font-normal tracking-[0.48px] text-[#E1251B]">Cómo funciona</p>
            <h2 className="mt-[6px] text-[28px] leading-8 font-bold tracking-[0.64px] text-[#404040] sm:text-[32px] sm:leading-7">
              Empezar es muy sencillo
            </h2>
          </div>
          <Link
            href="/catalogo-apis"
            className="inline-flex h-12 w-full max-w-[255px] shrink-0 items-center justify-center rounded-[30px] bg-[#E1251B] text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
          >
            Explorar productos
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
