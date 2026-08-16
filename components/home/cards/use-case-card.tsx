import Link from "next/link";

import type { UseCaseCard } from "../content/types";

export function UseCaseCard({
  card,
  highlightWarmMedia = false,
}: {
  card: UseCaseCard;
  highlightWarmMedia?: boolean;
}) {
  const Icon = card.icon;

  return (
    <article className="flex h-[600px] flex-col rounded-[32px] bg-white px-4 pb-6 pt-4">
      <div className="flex items-center gap-2 text-[16px] leading-6 font-medium tracking-[0.32px] text-[#404040]">
        <Icon className="h-[22px] w-[22px] text-[#404040]" />
        <span>{card.category}</span>
      </div>
      <div
        className={`mt-[29px] h-[208px] w-[376px] rounded-[16px] ${highlightWarmMedia ? "media-placeholder--warm" : "media-placeholder"}`}
      />
      <h3 className="mt-[22px] w-[274px] text-[20px] leading-7 font-medium tracking-[0.4px] text-[#404040]">
        {card.title}
      </h3>
      <div className="mt-2 h-1.5 w-10 rounded-full bg-[#E1251B]" />
      <p className="mt-3 w-[373px] text-[16px] leading-5 font-normal tracking-[0.32px] text-[#8E8E8E]">
        {card.description}
      </p>
      <Link
        href="#catalogo"
        className="mt-auto mx-auto inline-flex h-12 w-[317px] items-center justify-center rounded-[32px] border border-[#404040] bg-white text-[15px] font-medium text-[#404040]"
      >
        Ver como funciona
      </Link>
    </article>
  );
}
