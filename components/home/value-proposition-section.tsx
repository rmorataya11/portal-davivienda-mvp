import { valueCards } from "./data";

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

function TallValueCard({ card }: { card: (typeof valueCards)[number] }) {
  const Icon = card.icon;

  return (
    <article className="relative h-[394px] w-[302px] rounded-[32px] bg-white">
      <span className="absolute left-[19px] top-6 text-[24px] leading-none font-normal text-[#8E8E8E]">{card.step}</span>
      <div className="absolute left-[104px] top-[48px] flex h-[95px] w-[95px] items-center justify-center rounded-full bg-[#3F3F3F] text-white">
        <Icon className="h-[42px] w-[42px]" />
      </div>
      <div className="absolute left-[18px] top-[185px] w-[266px]">
        <h3 className="w-[233px] text-[20px] leading-7 font-medium tracking-[0.4px] text-[#404040]">{card.title}</h3>
        <p className="mt-3 text-[16px] leading-5 font-normal tracking-[0.32px] text-[#8E8E8E]">{card.description}</p>
      </div>
    </article>
  );
}

function WideValueCard({ card }: { card: (typeof valueCards)[number] }) {
  const Icon = card.icon;

  return (
    <article className="relative h-[188px] w-[616px] rounded-[32px] bg-white">
      <span className="absolute left-5 top-6 text-[24px] leading-none font-normal text-[#8E8E8E]">{card.step}</span>
      <div className="absolute left-[49px] top-[47px] flex h-[95px] w-[95px] items-center justify-center rounded-full bg-[#404040] text-white">
        <Icon className="h-[42px] w-[42px]" />
      </div>
      <div className="absolute left-[192px] top-[27px] w-[376px]">
        <h3 className="w-[244px] text-[20px] leading-7 font-medium tracking-[0.4px] text-[#404040]">{card.title}</h3>
        <p className="mt-3 text-[16px] leading-5 font-normal tracking-[0.32px] text-[#8E8E8E]">{card.description}</p>
      </div>
    </article>
  );
}
