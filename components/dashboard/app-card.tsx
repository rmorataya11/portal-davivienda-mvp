import Link from "next/link";

import { apiCatalogItems } from "@/components/catalog/content/apis";
import { appUsageStats, formatMoneyCop } from "@/lib/developer-apps/factory";
import { formatAppDate } from "@/lib/developer-apps/labels";
import type { DeveloperApp } from "@/lib/developer-apps/types";

import { AppStatusBadge } from "./app-status-badge";

export function AppCard({ app }: { app: DeveloperApp }) {
  const products = apiCatalogItems.filter((item) => app.productSlugs.includes(item.slug));
  const stats = appUsageStats(app);

  return (
    <Link
      href={`/dashboard/apps/${app.id}`}
      className="group flex h-full flex-col rounded-[24px] border border-[#E7EAEE] bg-white p-5 shadow-[0_12px_32px_rgba(20,31,37,0.04)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#E1251B]/24 hover:shadow-[0_18px_40px_rgba(20,31,37,0.08)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[20px] font-bold tracking-[0.2px] text-[#141F25]">{app.name}</h3>
        <AppStatusBadge status={app.status} />
      </div>
      <p className="mt-3 line-clamp-2 text-[14px] leading-6 text-[#6A7178]">
        {app.description || "Sin descripción todavía"}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {products.length > 0 ? (
          products.map((product) => (
            <span
              key={product.slug}
              className="rounded-full bg-[#F3F5F7] px-3 py-1 text-[12px] font-medium text-[#404040]"
            >
              {product.name}
            </span>
          ))
        ) : (
          <span className="text-[13px] text-[#8E8E8E]">Sin APIs vinculadas</span>
        )}
      </div>
      <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#F0F2F4] pt-4">
        <div>
          <p className="text-[12px] text-[#8E8E8E]">Consumido</p>
          <p className="mt-1 text-[20px] font-bold text-[#141F25]">{formatMoneyCop(stats.consumedCop)}</p>
        </div>
        <p className="text-right text-[13px] text-[#6A7178]">
          {stats.callsLast30Days.toLocaleString("es-CO")} llamadas
          <br />
          <span className="text-[#8E8E8E]">Creada {formatAppDate(app.createdAt)}</span>
        </p>
      </div>
    </Link>
  );
}
