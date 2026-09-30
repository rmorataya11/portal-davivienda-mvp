"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { TextAreaField, TextField } from "@/components/auth/auth-form-fields";
import { apiCatalogItems } from "@/components/catalog/content/apis";
import { localizeCatalogItem } from "@/components/catalog/content/localize-api";
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
  const catalogT = useTranslations("Catalog");
  const product = apiCatalogItems.find((item) => item.slug === app.apiProduct);
  const productName = product ? localizeCatalogItem(product, catalogT).name : app.apiProduct;
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
    <form className="mt-6 space-y-6" noValidate onSubmit={handleSubmit}>
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

export function AppDeleteControl({ appId, appName }: { appId: string; appName: string }) {
  const router = useRouter();
  const { deleteApp } = useDeveloperApps();
  const t = useTranslations("Dashboard.edit");
  const errorsT = useTranslations("Dashboard.errors");
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState("");

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex h-11 items-center justify-center rounded-full border border-[#D5DAE0] bg-white px-5 text-[14px] font-medium text-[#6A7178] transition-colors hover:border-[#E1251B] hover:text-[#E1251B]"
      >
        {t("delete")}
      </button>
    );
  }

  return (
    <div className="flex max-w-[420px] flex-col gap-3 rounded-[16px] border border-[#F3D0CD] bg-[#FFF8F8] px-4 py-4">
      <p className="text-[14px] leading-6 text-[#404040]">
        {t.rich("deleteConfirm", {
          name: () => <span className="font-semibold">{appName}</span>,
        })}
      </p>
      {formError ? <p className="text-[13px] leading-5 text-[#E1251B]">{formError}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isDeleting}
          onClick={() => {
            setIsDeleting(true);
            setFormError("");
            deleteApp(appId)
              .then(() => {
                router.replace("/dashboard");
              })
              .catch((error: unknown) => {
                setFormError(messageForStatus(error, errorsT));
                setIsDeleting(false);
              });
          }}
          className="inline-flex h-10 items-center justify-center rounded-full bg-[#E1251B] px-5 text-[13px] font-semibold text-white disabled:bg-[#C9CED4]"
        >
          {isDeleting ? t("deleting") : t("deleteYes")}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="inline-flex h-10 items-center justify-center rounded-full border border-[#D5DAE0] bg-white px-5 text-[13px] font-medium text-[#404040]"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}

function messageForStatus(error: unknown, t: (key: "unauthorized" | "forbidden" | "notFound" | "invalid" | "generic") => string) {
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
