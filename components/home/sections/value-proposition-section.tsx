import { TallValueCard } from "../cards/tall-value-card";
import { WideValueCard } from "../cards/wide-value-card";
import { valueCards } from "../content/value-proposition";

export function ValuePropositionSection() {
  const [firstCard, secondCard, thirdCard, fourthCard] = valueCards;

  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-0">
      <div className="mx-auto max-w-[1366px]">
        <div className="dark-orbit relative overflow-hidden rounded-[32px] bg-[#141F25] px-6 py-10 sm:px-8 sm:py-12 lg:h-[712px] lg:rounded-none">
          <div className="lg:absolute lg:left-[58px] lg:top-[55px]">
            <p className="w-full max-w-[180px] text-[24px] leading-7 font-normal tracking-[0.48px] text-white">Por qué Davivienda</p>
            <h2 className="mt-3 max-w-[741px] text-[28px] leading-8 font-bold tracking-[0.64px] text-white sm:text-[32px]">
              Pensado para acompañar a su negocio
            </h2>
          </div>

          <div className="mt-10 grid gap-[18px] lg:absolute lg:left-14 lg:top-[196px] lg:mt-0 lg:grid-cols-[302px_302px_616px]">
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
