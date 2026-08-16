import { TallValueCard } from "../cards/tall-value-card";
import { WideValueCard } from "../cards/wide-value-card";
import { valueCards } from "../content/value-proposition";

export function ValuePropositionSection() {
  const [firstCard, secondCard, thirdCard, fourthCard] = valueCards;

  return (
    <section className="pb-16">
      <div className="mx-auto max-w-[1366px]">
        <div className="dark-orbit relative h-[712px] overflow-hidden bg-[#141F25]">
          <div className="absolute left-[58px] top-[55px]">
            <p className="w-[180px] text-[24px] leading-7 font-normal tracking-[0.48px] text-white">Por qué Davivienda</p>
            <h2 className="mt-3 w-[741px] text-[32px] leading-8 font-bold tracking-[0.64px] text-white">
              Pensado para acompañar a su negocio
            </h2>
          </div>

          <div className="absolute left-14 top-[196px] flex gap-[18px]">
            <TallValueCard card={firstCard} />
            <TallValueCard card={secondCard} />
            <div className="flex flex-col gap-[18px]">
              <WideValueCard card={thirdCard} />
              <WideValueCard card={fourthCard} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
