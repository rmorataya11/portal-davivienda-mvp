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
      className="group flex h-full flex-col rounded-[24px] border border-[#E7EAEE] bg-white p-5 transition-colors duration-300 hover:border-[#E1251B]/40"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[20px] font-bold tracking-[0.2px] text-[#404040]">{app.name}</h3>
        <AppStatusBadge status={app.status} />
      </div>
      <p className="mt-3 line-clamp-2 text-[14px] leading-6 text-[#707070]">
        {app.description || "Sin descripción todavía"}
      </p>
      <div className="mt-4 mb-5 flex flex-wrap gap-2">
        {products.length > 0 ? (
          products.map((product) => (
            <span
              key={product.slug}
              className="rounded-full border border-[#E7EAEE] bg-[#F8F9FB] px-3 py-1.5 text-[13px] font-medium text-[#404040]"
            >
              {product.name}
            </span>
          ))
        ) : (
          <span className="text-[13px] text-[#8E8E8E]">Sin APIs vinculadas</span>
        )}
      </div>
      <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#E7EAEE] pt-4">
        <div>
          <p className="text-[12px] text-[#707070]">Llamadas / 30 días</p>
          <p className="mt-1 text-[20px] font-bold text-[#404040]">{stats.callsLast30Days.toLocaleString("es-CO")}</p>
          <p className="mt-1 text-[12px] text-[#707070]">
            {formatMoneyCop(stats.consumedCop)} estimado · no se factura
          </p>
        </div>
        <div className="text-right">
          <p className="text-[13px] font-semibold text-[#E1251B] transition-colors group-hover:text-[#C01F16]">
            Abrir →
          </p>
          <p className="mt-1 text-[12px] text-[#8E8E8E]">Creada {formatAppDate(app.createdAt)}</p>
        </div>
      </div>
    </Link>
  );
}
