import { TallValueCard } from "../cards/tall-value-card";
import { WideValueCard } from "../cards/wide-value-card";
import { valueCards } from "../content/value-proposition";

export function ValuePropositionSection() {
  const [firstCard, secondCard, thirdCard, fourthCard] = valueCards;

  return (
    <section className="pb-16">
      <div className="dark-orbit relative mx-auto w-full max-w-[1366px] overflow-hidden bg-[#141F25] px-6 py-10 sm:px-8 sm:py-12 lg:px-14 lg:py-14">
        <div>
          <p className="text-[24px] leading-7 font-normal tracking-[0.48px] text-white">Por qué Davivienda</p>
          <h2 className="mt-3 max-w-[741px] text-[28px] leading-8 font-bold tracking-[0.64px] text-white sm:text-[32px]">
            Pensado para acompañar a su negocio
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-[18px] md:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr] lg:grid-rows-[minmax(188px,auto)_minmax(188px,auto)]">
          <TallValueCard card={firstCard} />
          <TallValueCard card={secondCard} />
          <div className="grid gap-[18px] md:col-span-2 md:grid-cols-2 lg:col-span-1 lg:row-span-2 lg:grid-cols-1 lg:grid-rows-[minmax(188px,1fr)_minmax(188px,1fr)]">
            <WideValueCard card={thirdCard} />
            <WideValueCard card={fourthCard} />
          </div>
        </div>
      </div>
    </section>
  );
}
