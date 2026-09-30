"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { TextAreaField, TextField } from "@/components/auth/auth-form-fields";
import { useCatalogViews } from "@/components/catalog/catalog-provider";
import { CredentialField } from "@/components/ui/credential-field";
import { AppsRequestError } from "@/lib/developer-apps/api";
import type { CreatedAppResult } from "@/lib/developer-apps/types";

import { useDeveloperApps } from "./apps-provider";

export function CreateAppForm() {
  const searchParams = useSearchParams();
  const { createApp } = useDeveloperApps();
  const t = useTranslations("Dashboard.create");
  const createdT = useTranslations("Dashboard.created");
  const errorsT = useTranslations("Dashboard.errors");
  const products = useCatalogViews();
  const lockedProduct = products.find((item) => item.slug === (searchParams.get("producto") ?? ""));
  const lockedProductName = lockedProduct?.name ?? "";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [apiProduct, setApiProduct] = useState(lockedProduct?.slug ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [created, setCreated] = useState<CreatedAppResult | null>(null);

  function selectProduct(slug: string) {
    setApiProduct(slug);
    setErrors((current) => {
      if (!current.products) {
        return current;
      }
      const next = { ...current };
      delete next.products;
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) {
      nextErrors.name = t("nameRequired");
    }

    if (!apiProduct) {
      nextErrors.products = t("apisRequired");
    }

    setErrors(nextErrors);
    setFormError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    createApp({
      name: name.trim(),
      description: description.trim(),
      apiProduct,
    })
      .then((result) => {
        setCreated(result);
      })
      .catch((error: unknown) => {
        if (error instanceof AppsRequestError && error.status === 409) {
          setFormError(errorsT("limitReached"));
          return;
        }

        if (error instanceof AppsRequestError && error.status === 401) {
          setFormError(errorsT("unauthorized"));
          return;
        }

        if (error instanceof AppsRequestError && error.status === 403) {
          setFormError(errorsT("forbidden"));
          return;
        }

        if (error instanceof AppsRequestError && error.status === 400) {
          setFormError(errorsT("invalid"));
          return;
        }

        setFormError(errorsT("generic"));
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  if (created) {
    const product = products.find((item) => item.slug === created.app.apiProduct);
    const productName = product?.name ?? created.app.apiProduct;

    return (
      <div className="rounded-[32px] border border-[#E7EAEE] bg-white px-6 py-7 shadow-[0_18px_50px_rgba(20,31,37,0.06)] sm:px-8 sm:py-8">
        <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#8E8E8E]">{createdT("eyebrow")}</p>
        <h1 className="mt-3 text-[26px] font-bold tracking-[0.3px] text-[#141F25] sm:text-[32px] lg:text-[36px]">
          {createdT("title", { name: created.app.name })}
        </h1>
        <div className="mt-4 h-1.5 w-14 rounded-full bg-[#E1251B]" />
        <p className="mt-4 max-w-[640px] text-[16px] leading-7 text-[#6A7178]">
          {createdT("description", { product: productName })}
        </p>

        <div className="mt-8 space-y-3">
          <CredentialField label={createdT("consumerKey")} value={created.app.consumerKey ?? ""} />
          <div className="rounded-[18px] border border-[#F3D7A1] bg-[#FFF8EB] px-5 py-4 text-[14px] leading-6 text-[#8A5A12]">
            {createdT("secretWarning")}
          </div>
          <CredentialField label={createdT("consumerSecret")} value={created.consumerSecret} />
        </div>

        <Link
          href={`/dashboard/apps/${created.app.id}`}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
        >
          {createdT("continue")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-[32px] border border-[#E7EAEE] bg-white px-6 py-7 shadow-[0_18px_50px_rgba(20,31,37,0.06)] sm:px-8 sm:py-8">
        <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#8E8E8E]">{t("eyebrow")}</p>
        <h1 className="mt-3 text-[26px] font-bold tracking-[0.3px] text-[#141F25] sm:text-[32px] lg:text-[36px]">
          {lockedProduct ? t("titleForProduct", { name: lockedProductName }) : t("title")}
        </h1>
        <div className="mt-4 h-1.5 w-14 rounded-full bg-[#E1251B]" />
        <p className="mt-4 max-w-[640px] text-[16px] leading-7 text-[#6A7178]">
          {lockedProduct ? t("descriptionLocked") : t("description")}
        </p>

        <form className="mt-8 space-y-6" noValidate onSubmit={handleSubmit}>
          <TextField
            id="appName"
            name="appName"
            label={t("name")}
            required
            placeholder={t("namePlaceholder")}
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
            id="appDescription"
            name="appDescription"
            label={t("descriptionLabel")}
            rows={4}
            hint={t("descriptionHint")}
            placeholder={t("descriptionPlaceholder")}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          {!lockedProduct ? (
            <fieldset>
              <legend className="text-[15px] font-bold tracking-[0.2px] text-[#141F25]">
                {t("apisLegend")} <span className="text-[#E1251B]">*</span>
              </legend>
              <p className="mt-1 text-[14px] leading-6 text-[#8A9096]">{t("apisHelp")}</p>
              <div className="mt-4 flex flex-wrap gap-3" role="radiogroup" aria-label={t("apisLegend")}>
                {products.map((item) => {
                  const selected = apiProduct === item.slug;

                  return (
                    <button
                      key={item.slug}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => selectProduct(item.slug)}
                      className={`rounded-full border px-4 py-2 text-[14px] font-medium transition-all duration-300 ${
                        selected
                          ? "border-[#E1251B] bg-[#E1251B] text-white"
                          : "border-[#D5DAE0] bg-white text-[#404040] hover:border-[#E1251B] hover:text-[#E1251B]"
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
              {errors.products ? <p className="mt-2 text-[13px] text-[#E1251B]">{errors.products}</p> : null}
            </fieldset>
          ) : null}

          {formError ? <p className="text-[14px] leading-6 text-[#E1251B]">{formError}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C] disabled:translate-y-0 disabled:bg-[#C9CED4]"
          >
            {isSubmitting ? t("submitting") : t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
