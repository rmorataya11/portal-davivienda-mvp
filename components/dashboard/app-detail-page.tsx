"use client";

import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

import { useCatalogView } from "@/components/catalog/catalog-provider";
import { catalogCategoryLabel } from "@/components/catalog/content/localize-api";
import { CredentialField } from "@/components/ui/credential-field";
import { AppsRequestError } from "@/lib/developer-apps/api";
import { formatAppDate, formatAppDateTime } from "@/lib/developer-apps/labels";
import type { DeveloperApp } from "@/lib/developer-apps/types";

import { AppActionDialog, AppEditForm, messageForStatus } from "./app-edit-form";
import { AppStatusBadge } from "./app-status-badge";
import { useDeveloperApps } from "./apps-provider";

export function AppDetailPage({ appId }: { appId: string }) {
  const { getApp, deleteApp, ready } = useDeveloperApps();
  const router = useRouter();
  const [app, setApp] = useState<DeveloperApp | null>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "missing" | "denied" | "error">("loading");
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"edit" | "delete" | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const t = useTranslations("Dashboard");
  const errorsT = useTranslations("Dashboard.errors");
  const catalogT = useTranslations("Catalog");
  const locale = useLocale();
  const product = useCatalogView(app?.apiProduct ?? "");
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

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

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

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

  const detail = app;
  const productionHref = `/solicitud-contratacion?app=${detail.id}&producto=${detail.apiProduct}`;
  const created = formatAppDate(detail.createdAt, locale) || t("dates.noActivity");
  const expires = formatAppDateTime(detail.expiresAt, locale);

  function closeConfirm() {
    if (isDeleting) {
      return;
    }

    setConfirmAction(null);
    setDeleteError("");
  }

  function confirmEdit() {
    setConfirmAction(null);
    setIsEditing(true);
  }

  function confirmDelete() {
    setIsDeleting(true);
    setDeleteError("");
    deleteApp(detail.id)
      .then(() => {
        router.replace("/dashboard");
      })
      .catch((error: unknown) => {
        setDeleteError(messageForStatus(error, errorsT));
        setIsDeleting(false);
      });
  }

  return (
    <div>
      <div className="relative rounded-2xl bg-white px-6 py-6 sm:px-8 sm:py-8">
        {!isEditing ? (
          <div ref={menuRef} className="absolute top-5 right-5 z-10 sm:top-6 sm:right-6">
            <button
              type="button"
              aria-label={t("detail.moreAria")}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((current) => !current)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#8E8E8E] transition-colors hover:bg-[#F2F3F5] hover:text-[#404040]"
            >
              <EllipsisVertical className="h-4 w-4" strokeWidth={1.8} />
            </button>
            {menuOpen ? (
              <div
                id={menuId}
                role="menu"
                className="absolute right-0 z-20 mt-1 min-w-[168px] overflow-hidden rounded-[12px] border border-[#E7EAEE] bg-white py-1"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    setConfirmAction("edit");
                  }}
                  className="flex w-full px-3 py-2.5 text-left text-[14px] font-medium text-[#404040] transition-colors hover:bg-[#F8F9FB] hover:text-[#E1251B]"
                >
                  {t("detail.edit")}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    setConfirmAction("delete");
                  }}
                  className="flex w-full px-3 py-2.5 text-left text-[14px] font-medium text-[#404040] transition-colors hover:bg-[#F8F9FB] hover:text-[#E1251B]"
                >
                  {t("edit.delete")}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className={`flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16 ${!isEditing ? "pr-14" : ""}`}>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#404040] sm:text-[36px]">{detail.name}</h1>
              <AppStatusBadge environment={detail.environment} />
            </div>
            {!isEditing ? (
              <p className="mt-3 max-w-[720px] text-[16px] leading-7 tracking-[0.24px] text-[#5A5A5A]">
                {detail.description || t("detail.noDescription")}
              </p>
            ) : null}
            {detail.environment === "contracting" ? (
              <p className="mt-3 text-[14px] leading-6 text-[#707070]">{t("detail.contractingNote")}</p>
            ) : null}
            {detail.environment === "production" ? (
              <p className="mt-3 text-[14px] leading-6 text-[#707070]">{t("detail.productionNote")}</p>
            ) : null}
          </div>

          {!isEditing && detail.environment === "sandbox" && detail.status === "active" ? (
            <Link
              href={productionHref}
              className="inline-flex h-[46px] w-full shrink-0 items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)] sm:w-[246px]"
            >
              {t("detail.requestProduction")}
            </Link>
          ) : null}
        </div>

        {isEditing ? (
          <div className="mt-6">
            <AppEditForm
              app={detail}
              onCancel={() => setIsEditing(false)}
              onSaved={(updated) => {
                setApp(updated);
                setIsEditing(false);
              }}
            />
          </div>
        ) : null}
      </div>

      <AppActionDialog
        open={confirmAction === "edit"}
        title={t("detail.editConfirmTitle")}
        description={t("detail.editConfirm", { name: detail.name })}
        confirmLabel={t("detail.editYes")}
        loadingLabel={t("detail.editYes")}
        onConfirm={confirmEdit}
        onClose={closeConfirm}
      />
      <AppActionDialog
        open={confirmAction === "delete"}
        title={t("edit.deleteConfirmTitle")}
        description={t("edit.deleteConfirm", { name: detail.name })}
        confirmLabel={t("edit.deleteYes")}
        loadingLabel={t("edit.deleting")}
        loading={isDeleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onClose={closeConfirm}
      />

      <div className="mt-8 grid items-start gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl bg-white px-6 py-6 sm:px-8 sm:py-8">
          <h2 className="text-[22px] font-bold tracking-[0.2px] text-[#404040]">{t("detail.credentialsTitle")}</h2>
          <p className="mt-2 text-[15px] leading-6 text-[#8E8E8E]">
            {t.rich("detail.credentialsDescription", {
              header: (chunks) => <span className="font-mono text-[#404040]">{chunks}</span>,
            })}
          </p>
          <div className="mt-6">
            {detail.consumerKey ? (
              <CredentialField label={t("detail.consumerKey")} value={detail.consumerKey} secret variant="well" />
            ) : (
              <p className="text-[14px] leading-6 text-[#707070]">{t("detail.noKey")}</p>
            )}
          </div>
          <dl className="mt-6 grid gap-4 border-t border-[#E7EAEE] pt-5 sm:grid-cols-3">
            <DetailFact label={t("detail.product")} value={product?.name ?? detail.apiProduct} />
            <DetailFact label={t("detail.environment")} value={t(`status.${detail.environment}`)} />
            <DetailFact label={t("detail.expires")} value={expires || t("dates.noActivity")} />
          </dl>
        </div>

        <div className="rounded-2xl bg-white px-6 py-6 sm:px-8 sm:py-8">
          <h2 className="text-[22px] font-bold tracking-[0.2px] text-[#404040]">{t("detail.linkedApi")}</h2>
          {product ? (
            <>
              <p className="mt-6 text-[18px] font-semibold text-[#404040]">{product.name}</p>
              <p className="mt-1 text-[14px] text-[#8E8E8E]">{catalogCategoryLabel(product.category, catalogT)}</p>
              <nav className="mt-5 divide-y divide-[#E7EAEE] border-y border-[#E7EAEE]">
                <Link
                  href={`/catalogo-apis/${product.slug}`}
                  className="flex py-3 text-[15px] font-medium text-[#404040] transition-colors hover:text-[#E1251B]"
                >
                  {t("detail.viewCard")}
                </Link>
                <Link
                  href={`/catalogo-apis/${product.slug}/detalle-tecnico`}
                  className="flex py-3 text-[15px] font-medium text-[#404040] transition-colors hover:text-[#E1251B]"
                >
                  {t("detail.technicalConsole")}
                </Link>
                <Link
                  href={`/documentacion?api=${product.slug}`}
                  className="flex py-3 text-[15px] font-medium text-[#404040] transition-colors hover:text-[#E1251B]"
                >
                  {t("detail.viewDocs")}
                </Link>
              </nav>
            </>
          ) : (
            <p className="mt-6 text-[14px] leading-6 text-[#707070]">{detail.apiProduct}</p>
          )}
          <p className="mt-5 text-[13px] text-[#8E8E8E]">{t("detail.created", { date: created })}</p>
        </div>
      </div>
    </div>
  );
}

function DetailFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[14px] text-[#8E8E8E]">{label}</dt>
      <dd className="mt-1 text-[15px] font-medium text-[#404040]">{value}</dd>
    </div>
  );
}
