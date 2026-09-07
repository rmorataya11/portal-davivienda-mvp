import type { StepCard as StepCardType } from "../content/types";

export function StepCard({ card }: { card: StepCardType }) {
  return (
    <article className="h-auto rounded-[32px] bg-white px-5 pt-5 xl:h-[273px] xl:px-[17px] xl:pt-[18px]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#404040] text-[24px] font-medium text-white">
        {card.step}
      </div>
      <h3 className="mt-[26px] max-w-[245px] text-[20px] leading-7 font-medium tracking-[0.4px] text-[#404040]">
        {card.title}
      </h3>
      <p className="mt-3 max-w-[373px] text-[16px] leading-5 font-normal tracking-[0.32px] text-[#8E8E8E]">
        {card.description}
      </p>
    </article>
  );
}
