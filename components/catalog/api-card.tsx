import Link from "next/link";

import type { ApiCatalogItem } from "./content/apis";

export function ApiCard({ api }: { api: ApiCatalogItem }) {
  const Icon = api.icon;

  return (
    <article className="flex h-[348px] w-[408px] flex-col rounded-[16px] border border-[#707070] bg-white px-[18px] pb-[16px] pt-[24px]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[8px] bg-[#F2F3F5] text-[#404040]">
          <Icon className="h-6 w-6" />
        </div>
        <div className="inline-flex h-7 w-[116px] items-center justify-center gap-2 rounded-[24px] bg-[#EFFCF5] text-[12px] font-medium text-[#347659]">
          <span className="h-2 w-2 rounded-full bg-[#55B685]" />
          {api.status}
        </div>
      </div>

      <h3 className="mt-[26px] w-[240px] text-[20px] leading-7 font-medium tracking-[0.4px] text-[#404040]">
        {api.name}
      </h3>
      <p className="mt-3 w-[373px] text-[16px] leading-5 tracking-[0.32px] text-[#8E8E8E]">{api.description}</p>

      <div className="mt-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-[16px] leading-7 tracking-[0.32px] text-[#8E8E8E]">
          <span className="text-lg">⌁</span>
          <span>{api.category}</span>
        </div>
        <Link
          href="#"
          className="inline-flex h-10 w-[157px] items-center justify-center rounded-[20px] border border-[#000000] text-[14px] font-medium text-[#000000]"
        >
          Conocer esta API
        </Link>
      </div>
    </article>
  );
}
