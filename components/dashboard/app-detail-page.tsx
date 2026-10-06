"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useCatalogView } from "@/components/catalog/catalog-provider";
import { catalogCategoryLabel } from "@/components/catalog/content/localize-api";
import { BreakablePath } from "@/components/ui/breakable-path";
import { CredentialField } from "@/components/ui/credential-field";
import { AppsRequestError } from "@/lib/developer-apps/api";
import { formatAppDate, formatAppDateTime } from "@/lib/developer-apps/labels";
import type { DeveloperApp } from "@/lib/developer-apps/types";

import { AppDeleteControl, AppEditForm } from "./app-edit-form";
import { AppStatusBadge } from "./app-status-badge";
import { useDeveloperApps } from "./apps-provider";

export function AppDetailPage({ appId }: { appId: string }) {
  const { getApp, ready } = useDeveloperApps();
  const [app, setApp] = useState<DeveloperApp | null>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "missing" | "denied" | "error">("loading");
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations("Dashboard");
  const errorsT = useTranslations("Dashboard.errors");
  const catalogT = useTranslations("Catalog");
  const locale = useLocale();
  const product = useCatalogView(app?.apiProduct ?? "");

  useEffect(() => {
    if (!ready) {
      return;
    }

    let cancelled = false;
    setPhase("loading");

    getApp(appId)
      .then((next) => {
        if (cancelled) {
          return;
        }

        setApp(next);
        setPhase("ready");
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setApp(null);
        if (error instanceof AppsRequestError && error.status === 404) {
          setPhase("missing");
          return;
        }

        if (error instanceof AppsRequestError && error.status === 403) {
          setPhase("denied");
          return;
        }

        setPhase("error");
      });

    return () => {
      cancelled = true;
    };
  }, [appId, getApp, ready]);

  if (!ready || phase === "loading") {
    return <div className="h-64 animate-pulse rounded-[24px] bg-white" />;
  }

  if (!app || phase !== "ready") {
    const title = phase === "denied" ? errorsT("forbidden") : phase === "error" ? errorsT("generic") : t("detail.notFoundTitle");
    const description = phase === "missing" ? t("detail.notFoundDescription") : errorsT("generic");

    return (
      <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-6 py-8">
        <h1 className="text-[26px] font-bold text-[#404040] sm:text-[32px]">{title}</h1>
        <p className="mt-3 text-[16px] leading-7 text-[#707070]">{description}</p>
        <Link
          href="/dashboard"
          className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white"
        >
          {t("detail.back")}
        </Link>
      </div>
    );
  }

  const productionHref = `/solicitud-contratacion?app=${app.id}&producto=${app.apiProduct}`;
  const created = formatAppDate(app.createdAt, locale) || t("dates.noActivity");
  const expires = formatAppDateTime(app.expiresAt, locale);

  return (
    <div>
      <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[26px] font-bold tracking-[0.3px] text-[#404040] sm:text-[32px]">{app.name}</h1>
              <AppStatusBadge environment={app.environment} />
            </div>
          </div>
          {!isEditing ? (
            <div className="flex flex-wrap items-center gap-2">
              {app.environment === "sandbox" && app.status === "active" ? (
                <Link
                  href={productionHref}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#C01F16]"
                >
                  {t("detail.requestProduction")}
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#D5DAE0] bg-white px-5 text-[14px] font-medium text-[#404040] transition-colors hover:border-[#E1251B] hover:text-[#E1251B]"
              >
                {t("detail.edit")}
              </button>
              <AppDeleteControl appId={app.id} appName={app.name} />
            </div>
          ) : null}
        </div>
        {isEditing ? (
          <AppEditForm
            app={app}
            onCancel={() => setIsEditing(false)}
            onSaved={(updated) => {
              setApp(updated);
              setIsEditing(false);
            }}
          />
        ) : (
          <p className="mt-3 max-w-[720px] text-[15px] leading-6 text-[#707070]">
            {app.description || t("detail.noDescription")}
          </p>
        )}
        {app.environment === "contracting" ? (
          <p className="mt-3 text-[14px] leading-6 text-[#707070]">{t("detail.contractingNote")}</p>
        ) : null}
        {app.environment === "production" ? (
          <p className="mt-3 text-[14px] leading-6 text-[#707070]">{t("detail.productionNote")}</p>
        ) : null}
      </div>

      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] border border-[#E7EAEE] bg-white p-6 sm:p-7">
          <h2 className="text-[22px] font-bold text-[#404040]">{t("detail.credentialsTitle")}</h2>
          <p className="mt-2 text-[14px] leading-6 text-[#707070]">
            {t.rich("detail.credentialsDescription", {
              header: (chunks) => <span className="font-mono text-[#404040]">{chunks}</span>,
            })}
          </p>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <DetailFact label={t("detail.product")} value={product?.name ?? app.apiProduct} />
            <DetailFact label={t("detail.environment")} value={t(`status.${app.environment}`)} />
            <DetailFact label={t("detail.status")} value={t(`recordStatus.${app.status}`)} />
            <DetailFact label={t("detail.expires")} value={expires || t("dates.noActivity")} />
          </dl>
          <div className="mt-5">
            {app.consumerKey ? (
              <CredentialField label={t("detail.consumerKey")} value={app.consumerKey} secret />
            ) : (
              <p className="text-[14px] leading-6 text-[#707070]">{t("detail.noKey")}</p>
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#E7EAEE] bg-white p-6 sm:p-7">
          <h2 className="text-[22px] font-bold text-[#404040]">{t("detail.linkedApi")}</h2>
          <div className="mt-4">
            {product ? (
              <div className="rounded-[16px] border border-[#E7EAEE] bg-white px-4 py-4">
                <p className="text-[18px] font-semibold text-[#404040]">{product.name}</p>
                <p className="mt-1 text-[13px] text-[#707070]">{catalogCategoryLabel(product.category, catalogT)}</p>
                {product.endpoints[0] ? (
                  <div className="mt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex min-w-14 items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          product.endpoints[0].method === "POST" ? "bg-[#E1251B] text-white" : "bg-[#EFFCF5] text-[#347659]"
                        }`}
                      >
                        {product.endpoints[0].method}
                      </span>
                      <code className="min-w-0 text-[13px] text-[#404040]">
                        <BreakablePath value={product.endpoints[0].path} />
                      </code>
                    </div>
                    <p className="mt-2 text-[13px] leading-5 text-[#707070]">{product.endpoints[0].description}</p>
                  </div>
                ) : null}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Link
                    href={`/catalogo-apis/${product.slug}`}
                    className="inline-flex h-10 items-center justify-center rounded-[20px] border border-[#D5DAE0] px-4 text-[13px] font-medium text-[#404040] transition-colors hover:border-[#E1251B] hover:text-[#E1251B]"
                  >
                    {t("detail.viewCard")}
                  </Link>
                  <Link
                    href={`/catalogo-apis/${product.slug}/detalle-tecnico`}
                    className="inline-flex h-10 items-center justify-center rounded-[20px] bg-[#E1251B] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#C01F16]"
                  >
                    {t("detail.technicalConsole")}
                  </Link>
                </div>
                <Link
                  href={`/documentacion?api=${product.slug}`}
                  className="mt-4 inline-flex text-[13px] font-semibold text-[#E1251B] transition-colors hover:text-[#C01F16]"
                >
                  {t("detail.viewDocs")}
                </Link>
              </div>
            ) : (
              <p className="text-[14px] leading-6 text-[#707070]">{app.apiProduct}</p>
            )}
          </div>
          <p className="mt-5 text-[13px] text-[#707070]">{t("detail.created", { date: created })}</p>
        </div>
      </div>
    </div>
  );
}

function DetailFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#8E8E8E]">{label}</dt>
      <dd className="mt-1 text-[15px] font-medium text-[#404040]">{value}</dd>
    </div>
  );
}
