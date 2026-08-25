import type { ValueCard } from "../content/types";
import { ValueCardIcon } from "./value-card-icon";

export function TallValueCard({ card }: { card: ValueCard }) {
  return (
    <article className="group flex min-h-[280px] w-full flex-col rounded-[32px] bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(20,31,37,0.14)] lg:row-span-2 lg:min-h-0">
      <span className="text-[24px] leading-none font-normal text-[#8E8E8E]">{card.step}</span>
      <ValueCardIcon step={card.step} className="mx-auto mt-6 transition-colors duration-300 group-hover:bg-[#E1251B]" />
      <div className="mt-auto pt-8">
        <h3 className="text-[20px] leading-7 font-medium tracking-[0.4px] text-[#404040]">{card.title}</h3>
        <p className="mt-3 text-[16px] leading-5 font-normal tracking-[0.32px] text-[#8E8E8E]">{card.description}</p>
      </div>
    </article>
  );
}
