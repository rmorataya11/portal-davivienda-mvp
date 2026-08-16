import type { ValueCard } from "../content/types";

export function WideValueCard({ card }: { card: ValueCard }) {
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
