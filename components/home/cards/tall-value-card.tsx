import type { ValueCard } from "../content/types";

export function TallValueCard({ card }: { card: ValueCard }) {
  return (
    <article className="group flex min-h-[280px] w-full flex-col rounded-[32px] bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(20,31,37,0.14)] sm:min-h-[320px] xl:row-span-2 xl:h-auto xl:min-h-0">
      <span className="text-[24px] leading-none font-normal text-[#8E8E8E]">{card.step}</span>
      {card.imageSrc ? (
        <div className="mx-auto mt-6 flex h-[95px] w-[95px] items-center justify-center overflow-hidden rounded-full bg-[#3F3F3F] transition-colors duration-300 group-hover:bg-[#E1251B]">
          <img src={card.imageSrc} alt="" className="h-[42px] w-[42px] object-contain" />
        </div>
      ) : null}
      <div className="mt-10 max-w-[266px]">
        <h3 className="max-w-[233px] text-[20px] leading-7 font-medium tracking-[0.4px] text-[#404040]">{card.title}</h3>
        <p className="mt-3 text-[16px] leading-5 font-normal tracking-[0.32px] text-[#8E8E8E]">{card.description}</p>
      </div>
    </article>
  );
}
