import type { StepCard as StepCardType } from "../content/types";

export function StepCard({ card }: { card: StepCardType }) {
  return (
    <article className="flex gap-4 rounded-[24px] bg-white px-5 py-5 md:block md:rounded-[32px] md:pt-5 xl:h-[273px] xl:px-[17px] xl:pt-[18px]">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#404040] text-[20px] font-medium text-white md:h-14 md:w-14 md:text-[24px]">
        {card.step}
      </div>
      <div className="min-w-0">
        <h3 className="text-[18px] leading-6 font-medium tracking-[0.4px] text-[#404040] md:mt-[26px] md:max-w-[245px] md:text-[20px] md:leading-7">
          {card.title}
        </h3>
        <p className="mt-2 text-[15px] leading-6 font-normal tracking-[0.32px] text-[#8E8E8E] md:mt-3 md:max-w-[373px] md:text-[16px] md:leading-5">
          {card.description}
        </p>
      </div>
    </article>
  );
}
