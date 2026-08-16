import Link from "next/link";

import type { ApiCatalogItem } from "./content/apis";

export function ApiCard({ api }: { api: ApiCatalogItem }) {
  const Icon = api.icon;

  return (
    <article className="flex min-h-[248px] flex-col rounded-[16px] border border-[#D7DBE0] bg-white p-4 shadow-[0_8px_24px_rgba(20,31,37,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#D7DBE0] text-[#404040]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#EFFCF5] px-2.5 py-1 text-xs font-medium text-[#347659]">
          <span className="h-2 w-2 rounded-full bg-[#55B685]" />
          {api.status}
        </div>
      </div>

      <h3 className="mt-4 text-[24px] font-medium leading-8 text-[#404040]">{api.name}</h3>
      <p className="mt-3 text-[14px] leading-5 text-[#8E8E8E]">{api.description}</p>

      <div className="mt-auto flex items-center justify-between gap-4 pt-5">
        <span className="text-sm font-medium text-[#707070]">{api.category}</span>
        <Link
          href="#"
          className="inline-flex h-10 items-center justify-center rounded-full border border-[#2C2C2C] px-5 text-sm font-medium text-[#2C2C2C]"
        >
          Conocer esta API
        </Link>
      </div>
    </article>
  );
}
