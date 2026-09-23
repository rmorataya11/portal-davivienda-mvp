"use client";

import { useTranslations } from "next-intl";

import { SectionContainer } from "@/components/ui/layout";

import { ApiLinkedApps } from "./api-linked-apps";

export function ApiAppsSection({ slug, apiName }: { slug: string; apiName: string }) {
  const t = useTranslations("Catalog.apps");
  const returnTo = `/catalogo-apis/${slug}`;

  return (
    <section id="apps" className="scroll-anchor pt-10">
      <SectionContainer>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[28px] font-bold tracking-[0.3px] text-[#141F25]">{t("title")}</h2>
            <p className="mt-2 max-w-[640px] text-[15px] leading-7 text-[#6A7178]">
              {t("description", { name: apiName })}
            </p>
          </div>
        </div>
        <ApiLinkedApps slug={slug} apiName={apiName} returnTo={returnTo} />
      </SectionContainer>
    </section>
  );
}
