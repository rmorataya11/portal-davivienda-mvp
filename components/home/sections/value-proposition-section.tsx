import { SectionContainer } from "@/components/ui/layout";
import { TallValueCard } from "../cards/tall-value-card";
import { WideValueCard } from "../cards/wide-value-card";
import { valueCards } from "../content/value-proposition";

export function ValuePropositionSection() {
  const [firstCard, secondCard, thirdCard, fourthCard] = valueCards;

  return (
    <section className="pb-16">
      <SectionContainer>
        <div className="dark-orbit relative overflow-hidden rounded-[32px] bg-[#141F25] px-6 py-10 sm:px-8 sm:py-12">
          <div>
            <p className="w-full max-w-[180px] text-[24px] leading-7 font-normal tracking-[0.48px] text-white">Por qué Davivienda</p>
            <h2 className="mt-3 max-w-[741px] text-[28px] leading-8 font-bold tracking-[0.64px] text-white sm:text-[32px]">
              Pensado para acompañar a su negocio
            </h2>
          </div>

          <div className="mt-10 grid gap-[18px] md:grid-cols-2 xl:auto-rows-[188px] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.25fr)]">
            <TallValueCard card={firstCard} />
            <TallValueCard card={secondCard} />
            <div className="grid gap-[18px] md:col-span-2 md:grid-cols-2 xl:col-span-1 xl:auto-rows-[188px] xl:grid-cols-1">
              <WideValueCard card={thirdCard} />
              <WideValueCard card={fourthCard} />
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
