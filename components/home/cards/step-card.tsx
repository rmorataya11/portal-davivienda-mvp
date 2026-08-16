import type { StepCard as StepCardType } from "../content/types";

export function StepCard({ card }: { card: StepCardType }) {
  return (
    <article className="h-[273px] rounded-[32px] bg-white px-[17px] pt-[18px]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#404040] text-[24px] font-medium text-white">
        {card.step}
      </div>
      <h3 className="mt-[26px] w-[245px] text-[20px] leading-7 font-medium tracking-[0.4px] text-[#404040]">
        {card.title}
      </h3>
      <p className="mt-3 max-w-[333px] text-[16px] leading-5 font-normal tracking-[0.32px] text-[#8E8E8E]">
        {card.description}
      </p>
    </article>
  );
}
