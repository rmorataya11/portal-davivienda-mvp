import type { ValueCard } from "../content/types";

export function TallValueCard({ card }: { card: ValueCard }) {
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
