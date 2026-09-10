import Link from "next/link";

import type { ApiCatalogItem } from "./content/apis";

function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="#8E8E8E" strokeWidth="1.5" />
      <path d="M8.5 12h7" stroke="#8E8E8E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" aria-hidden="true">
      <circle cx="4.5" cy="4.5" r="1.4" fill="#8E8E8E" />
      <circle cx="11.5" cy="4.5" r="1.4" fill="#8E8E8E" />
      <circle cx="4.5" cy="11.5" r="1.4" fill="#8E8E8E" />
      <circle cx="11.5" cy="11.5" r="1.4" fill="#8E8E8E" />
    </svg>
  );
}

export function ApiCard({ api }: { api: ApiCatalogItem }) {
  const detailHref = api.slug ? `/catalogo-apis/${api.slug}` : "#";

  return (
    <article className="group flex min-h-[348px] w-full flex-col rounded-[16px] border border-[#707070] bg-white px-[18px] pb-[16px] pt-[24px]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full bg-[#F2F3F5]">
          {api.imageSrc ? <img src={api.imageSrc} alt="" className="h-6 w-6 object-contain" /> : <CoinIcon />}
        </div>
        <div className="inline-flex h-7 items-center justify-center gap-2 rounded-[24px] bg-[#EFFCF5] px-3 text-[12px] font-medium text-[#347659]">
          <span className="h-2 w-2 rounded-full bg-[#55B685]" />
          {api.status}
        </div>
      </div>

      <h3 className="mt-[26px] max-w-[240px] text-[20px] leading-7 font-medium tracking-[0.4px] text-[#404040]">
        {api.name}
      </h3>
      <p className="mt-3 max-w-[373px] text-[16px] leading-5 tracking-[0.32px] text-[#8E8E8E]">{api.description}</p>

      <div className="mt-auto flex flex-col gap-4 border-t border-[#707070]/30 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-[16px] leading-7 tracking-[0.32px] text-[#8E8E8E]">
          <CategoryIcon />
          {api.category}
        </div>
        <Link
          href={detailHref}
          aria-disabled={!api.slug}
          className={`inline-flex h-10 w-full items-center justify-center rounded-[20px] border text-[14px] font-medium transition-all duration-300 ease-out sm:w-[157px] ${
            api.slug
              ? "border-[#707070] text-[#000000] hover:border-[#E1251B] hover:bg-[#E1251B] hover:text-white"
              : "pointer-events-none border-[#B8B8B8] text-[#B8B8B8]"
          }`}
        >
          Conocer esta API
        </Link>
      </div>
    </article>
  );
}
