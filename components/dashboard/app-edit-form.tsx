"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useState, type FormEvent } from "react";

import { TextAreaField, TextField } from "@/components/auth/auth-form-fields";
import { useCatalogView } from "@/components/catalog/catalog-provider";
import { AppsRequestError } from "@/lib/developer-apps/api";
import type { DeveloperApp } from "@/lib/developer-apps/types";

import { useDeveloperApps } from "./apps-provider";

export function AppEditForm({
  app,
  onCancel,
  onSaved,
}: {
  app: DeveloperApp;
  onCancel: () => void;
  onSaved: (app: DeveloperApp) => void;
}) {
  const { updateApp } = useDeveloperApps();
  const t = useTranslations("Dashboard");
  const errorsT = useTranslations("Dashboard.errors");
  const product = useCatalogView(app.apiProduct);
  const productName = product?.name ?? app.apiProduct;
  const [name, setName] = useState(app.name);
  const [description, setDescription] = useState(app.description ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) {
      nextErrors.name = t("create.nameRequired");
    }

    setErrors(nextErrors);
    setFormError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    updateApp(app.id, {
      name: name.trim(),
      description: description.trim(),
    })
      .then((updated) => {
        onSaved(updated);
      })
      .catch((error: unknown) => {
        setFormError(messageForStatus(error, errorsT));
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <TextField
        id="editAppName"
        name="editAppName"
        label={t("create.name")}
        required
        value={name}
        error={errors.name}
        onChange={(event) => {
          setName(event.target.value);
          setErrors((current) => {
            if (!current.name) {
              return current;
            }
            const next = { ...current };
            delete next.name;
            return next;
          });
        }}
      />
      <TextAreaField
        id="editAppDescription"
        name="editAppDescription"
        label={t("create.descriptionLabel")}
        rows={4}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <div>
        <p className="text-[15px] font-bold tracking-[0.2px] text-[#141F25]">{t("create.apisLegend")}</p>
        <p className="mt-1 text-[14px] leading-6 text-[#8A9096]">{t("edit.productLocked")}</p>
        <div
          aria-disabled="true"
          className="mt-4 inline-flex cursor-not-allowed rounded-full border border-[#E7EAEE] bg-[#F5F6F8] px-4 py-2 text-[14px] font-medium text-[#6A7178]"
        >
          {productName}
        </div>
      </div>
      {formError ? <p className="text-[14px] leading-6 text-[#E1251B]">{formError}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C] disabled:translate-y-0 disabled:bg-[#C9CED4]"
        >
          {isSubmitting ? t("edit.saving") : t("edit.save")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-12 items-center justify-center rounded-full border border-[#D5DAE0] bg-white px-7 text-[15px] font-medium text-[#404040] transition-all duration-300 hover:border-[#404040]"
        >
          {t("edit.cancel")}
        </button>
      </div>
    </form>
  );
}

export function AppActionDialog({
  open,
  title,
  description,
  confirmLabel,
  loadingLabel,
  loading,
  error,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  loadingLabel: string;
  loading?: boolean;
  error?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const t = useTranslations("Dashboard.edit");
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8">
      <button type="button" className="absolute inset-0 bg-[#141F25]/45" aria-label={t("cancel")} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-[480px] rounded-2xl bg-white px-6 py-6 sm:px-8 sm:py-7"
      >
        <h2 id={titleId} className="text-[22px] font-bold tracking-[0.2px] text-[#404040]">
          {title}
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-[#5A5A5A]">{description}</p>
        {error ? <p className="mt-3 text-[13px] leading-5 text-[#E1251B]">{error}</p> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="inline-flex h-11 items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#C01F16] disabled:bg-[#C9CED4]"
          >
            {loading ? loadingLabel : confirmLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-[30px] border border-[#D5DAE0] bg-white px-6 text-[14px] font-medium text-[#404040] transition-colors hover:border-[#E1251B] hover:text-[#E1251B]"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function messageForStatus(error: unknown, t: (key: "unauthorized" | "forbidden" | "notFound" | "invalid" | "generic") => string) {
  if (!(error instanceof AppsRequestError)) {
    return t("generic");
  }

  if (error.status === 401) {
    return t("unauthorized");
  }

  if (error.status === 403) {
    return t("forbidden");
  }

  if (error.status === 404) {
    return t("notFound");
  }

  if (error.status === 400) {
    return t("invalid");
  }

  return t("generic");
}
