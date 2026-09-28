"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { apiCatalogItems } from "@/components/catalog/content/apis";
import { localizeCatalogItem } from "@/components/catalog/content/localize-api";
import { appUsageStats, formatMoney } from "@/lib/developer-apps/factory";
import { formatAppDate, isProductionApp } from "@/lib/developer-apps/labels";
import type { DeveloperApp } from "@/lib/developer-apps/types";

import { AppStatusBadge } from "./app-status-badge";

export function AppCard({ app }: { app: DeveloperApp }) {
  const t = useTranslations("Dashboard");
  const catalogT = useTranslations("Catalog");
  const locale = useLocale();
  const numberLocale = locale === "en" ? "en-US" : "es";
  const products = apiCatalogItems
    .filter((item) => app.productSlugs.includes(item.slug))
    .map((item) => localizeCatalogItem(item, catalogT));
  const stats = appUsageStats(app);
  const created = formatAppDate(app.createdAt, locale) || t("dates.noActivity");

  return (
    <Link
      href={`/dashboard/apps/${app.id}`}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[16px] border border-[#E7EAEE] bg-white px-[18px] py-4 transition-colors duration-300 hover:border-[#E1251B]/40"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 text-[18px] font-bold leading-6 tracking-[0.2px] text-[#404040] [overflow-wrap:anywhere] line-clamp-2">
          {app.name}
        </h3>
        <div className="shrink-0">
          <AppStatusBadge status={app.status} />
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-[#707070]">
        {app.description || t("card.noDescription")}
      </p>
      <div className="mt-3 mb-4 flex min-w-0 flex-wrap gap-1.5">
        {products.length > 0 ? (
          products.map((product) => (
            <span
              key={product.slug}
              className="inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-full border border-[#E7EAEE] bg-[#F8F9FB] px-2.5 py-1 text-[12px] font-medium text-[#404040]"
            >
              {product.imageSrc ? (
                <img src={product.imageSrc} alt="" className="h-4 w-4 shrink-0 object-contain" aria-hidden="true" />
              ) : null}
              <span className="min-w-0 truncate">{product.name}</span>
            </span>
          ))
        ) : (
          <span className="text-[12px] text-[#8E8E8E]">{t("card.noApis")}</span>
        )}
      </div>
      <div className="mt-auto flex items-end justify-between gap-2 border-t border-[#E7EAEE] pt-3">
        <div className="min-w-0">
          <p className="text-[11px] text-[#707070]">{t("card.calls30")}</p>
          <p className="mt-0.5 text-[18px] font-bold leading-6 text-[#404040]">
            {stats.callsLast30Days.toLocaleString(numberLocale)}
          </p>
          {isProductionApp(app) ? (
            <p className="mt-0.5 truncate text-[11px] text-[#707070]">
              {t("card.billed", { amount: formatMoney(stats.consumedUsd) })}
            </p>
          ) : null}
        </div>
        <div className="min-w-0 shrink-0 text-right">
          <p className="text-[13px] font-semibold text-[#E1251B] transition-colors group-hover:text-[#C01F16]">
            {t("card.open")}
          </p>
          <p className="mt-1 max-w-[9rem] truncate text-[11px] text-[#8E8E8E]">{t("card.created", { date: created })}</p>
        </div>
      </div>
    </Link>
  );
}
