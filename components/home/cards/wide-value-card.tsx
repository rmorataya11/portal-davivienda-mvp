import type { ValueCard } from "../content/types";

export function WideValueCard({ card }: { card: ValueCard }) {
  return (
    <article className="group flex min-h-[220px] w-full flex-col rounded-[32px] bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(20,31,37,0.12)] sm:flex-row sm:items-center sm:gap-8 xl:h-full xl:min-h-0">
      <div className="sm:min-w-[111px]">
        <span className="text-[24px] leading-none font-normal text-[#8E8E8E]">{card.step}</span>
      </div>
      {card.imageSrc ? (
        <div className="mt-6 flex h-[95px] w-[95px] items-center justify-center overflow-hidden rounded-full bg-[#404040] transition-colors duration-300 group-hover:bg-[#E1251B] sm:mt-0">
          <img src={card.imageSrc} alt="" className="h-[42px] w-[42px] object-contain" />
        </div>
      ) : null}
      <div className="mt-8 max-w-[376px] sm:mt-0">
        <h3 className="max-w-[244px] text-[20px] leading-7 font-medium tracking-[0.4px] text-[#404040]">{card.title}</h3>
        <p className="mt-3 text-[16px] leading-5 font-normal tracking-[0.32px] text-[#8E8E8E]">{card.description}</p>
      </div>
    </article>
  );
}
