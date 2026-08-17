import type { StepCard as StepCardType } from "../content/types";

export function StepCard({ card }: { card: StepCardType }) {
  return (
    <article className="group min-h-[260px] rounded-[32px] bg-white px-5 pt-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(20,31,37,0.14)] lg:h-[273px] lg:px-[17px] lg:pt-[18px]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#404040] text-[24px] font-medium text-white transition-colors duration-300 group-hover:bg-[#E1251B]">
        {card.step}
      </div>
      <h3 className="mt-[26px] max-w-[245px] text-[20px] leading-7 font-medium tracking-[0.4px] text-[#404040]">
        {card.title}
      </h3>
      <p className="mt-3 max-w-[333px] text-[16px] leading-6 font-normal tracking-[0.32px] text-[#8E8E8E] lg:leading-5">
        {card.description}
      </p>
    </article>
  );
}
