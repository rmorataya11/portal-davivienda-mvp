"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { SelectField, TextField } from "@/components/auth/auth-form-fields";
import { useCatalogViews } from "@/components/catalog/catalog-provider";
import { CredentialField } from "@/components/ui/credential-field";
import { AppsRequestError } from "@/lib/developer-apps/api";
import type { CreatedAppResult } from "@/lib/developer-apps/types";

import { useDeveloperApps } from "./apps-provider";

const submitClassName =
  "inline-flex h-[46px] w-full items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)] disabled:translate-y-0 disabled:bg-[#C9CED4] disabled:shadow-none sm:w-auto";

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
      <div>
        <h1 className="text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#404040] sm:text-[36px]">
          {createdT("title", { name: created.app.name })}
        </h1>
        <p className="mt-4 max-w-[640px] text-[16px] leading-7 tracking-[0.24px] text-[#5A5A5A]">
          {createdT("description", { product: productName })}
        </p>

        <div className="mt-8 rounded-2xl bg-white px-6 py-6 sm:px-8 sm:py-8">
          <div className="space-y-3">
            <CredentialField label={createdT("consumerKey")} value={created.app.consumerKey ?? ""} />
            <div className="rounded-[18px] border border-[#F3D7A1] bg-[#FFF8EB] px-5 py-4 text-[14px] leading-6 text-[#8A5A12]">
              {createdT("secretWarning")}
            </div>
            <CredentialField label={createdT("consumerSecret")} value={created.consumerSecret} />
          </div>

          <Link href={`/dashboard/apps/${created.app.id}`} className={`mt-8 ${submitClassName}`}>
            {createdT("continue")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#404040] sm:text-[36px]">
        {lockedProduct ? t("titleForProduct", { name: lockedProductName }) : t("title")}
      </h1>

      <form
        className="mt-8 space-y-6 rounded-2xl bg-white px-6 py-6 sm:px-8 sm:py-8"
        noValidate
        onSubmit={handleSubmit}
      >
        <TextField
          id="appName"
          name="appName"
          label={t("name")}
          required
          autoComplete="off"
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
        <TextField
          id="appDescription"
          name="appDescription"
          label={t("descriptionLabel")}
          placeholder={t("descriptionPlaceholder")}
          autoComplete="off"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        {lockedProduct ? (
          <div>
            <p className="text-[15px] font-bold tracking-[0.2px] text-[#141F25]">{t("apisLegend")}</p>
            <div className="mt-2 flex h-12 items-center rounded-[10px] border border-[#D5DAE0] bg-[#F5F6F8] px-4 text-[15px] text-[#6A7178]">
              {lockedProductName}
            </div>
            <p className="mt-2 text-[14px] leading-6 text-[#8E8E8E]">{t("descriptionLocked")}</p>
          </div>
        ) : (
          <div>
            <SelectField
              id="apiProduct"
              name="apiProduct"
              label={t("apisLegend")}
              required
              error={errors.products}
              placeholder={t("apisPlaceholder")}
              value={apiProduct}
              onChange={(event) => selectProduct(event.target.value)}
            >
              {products.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </SelectField>
            <p className="mt-2 text-[14px] leading-6 text-[#8E8E8E]">{t("description")}</p>
          </div>
        )}

        {formError ? <p className="text-[14px] leading-6 text-[#E1251B]">{formError}</p> : null}

        <button type="submit" disabled={isSubmitting} className={submitClassName}>
          {isSubmitting ? t("submitting") : t("submit")}
        </button>
      </form>
    </div>
  );
}
