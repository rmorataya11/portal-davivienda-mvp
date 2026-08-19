import { PageContainer } from "@/components/ui/layout";
import { StepCard } from "../cards/step-card";
import { stepCards } from "../content/steps";

export function StepsSection() {
  return (
    <section id="catalogo" className="pb-20 pt-1">
      <PageContainer>
        <div>
          <p className="w-[74px] text-[24px] leading-7 font-normal tracking-[0.48px] text-[#E1251B]">Cómo funciona</p>
          <h2 className="mt-[6px] max-w-[741px] text-[28px] leading-8 font-bold tracking-[0.64px] text-[#404040] sm:text-[32px] sm:leading-7">
            Empezar es muy sencillo
          </h2>
        </div>

        <div className="mt-[41px] grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stepCards.map((card) => (
            <StepCard key={card.step} card={card} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
