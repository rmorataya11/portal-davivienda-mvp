"use client";

import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { SelectField, TextAreaField, TextField } from "@/components/auth/auth-form-fields";
import { apiCatalogItems } from "@/components/catalog/content/apis";
import { localizeCatalogItem } from "@/components/catalog/content/localize-api";
import { useDeveloperApps } from "@/components/dashboard/apps-provider";
import type { DeveloperApp } from "@/lib/developer-apps/types";

import {
  destinationEnvironmentValues,
  industryValues,
  ipWhitelistValues,
  monthlyVolumeValues,
} from "./content/contracting";
import { RadioGroup } from "./radio-group";
import { TermsModal } from "./terms-modal";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+()\s.-]*\d[\d+()\s.-]{6,}$/;
const IP_EXAMPLE = "203.0.113.0/24";
const IP_PLACEHOLDER = "203.0.113.0/24\n198.51.100.15";

type FieldErrors = Record<string, string>;

export function ContractingRequestForm({ productName = "" }: { productName?: string }) {
  const t = useTranslations("Contratacion");
  const catalogT = useTranslations("Catalog");
  const searchParams = useSearchParams();
  const { user, developerId } = useAuth();
  const { getApp, markContracting, ready } = useDeveloperApps();
  const appId = searchParams.get("app") ?? "";
  const [linkedApp, setLinkedApp] = useState<DeveloperApp | null>(null);

  useEffect(() => {
    if (!ready || !appId) {
      setLinkedApp(null);
      return;
    }

    let cancelled = false;

    getApp(appId)
      .then((app) => {
        if (!cancelled) {
          setLinkedApp(app);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLinkedApp(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [appId, getApp, ready]);

  const productItem = apiCatalogItems.find((item) => item.slug === linkedApp?.apiProduct);
  const displayProduct = productItem ? localizeCatalogItem(productItem, catalogT).name : productName;
  const [companyName, setCompanyName] = useState("");
  const [environment, setEnvironment] = useState("");
  const [needsIpWhitelist, setNeedsIpWhitelist] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    const lookupId = developerId ?? user?.uid;

    if (!lookupId) {
      return;
    }

    let cancelled = false;

    fetch(`/api/developers/${lookupId}/profile`)
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }

        return (await response.json()) as { companyName?: string };
      })
      .then((profile) => {
        if (cancelled) {
          return;
        }

        const profileName = profile?.companyName;
        if (typeof profileName === "string" && profileName.trim()) {
          setCompanyName((current) => current || profileName);
        }
      })
      .catch(() => {
        // El usuario puede completar la razón social manualmente.
      });

    return () => {
      cancelled = true;
    };
  }, [developerId, user]);

  function clearError(field: string) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate(form: FormData) {
    const nextErrors: FieldErrors = {};
    const email = String(form.get("technicalEmail") ?? "").trim();
    const phone = String(form.get("technicalPhone") ?? "").trim();

    if (!String(form.get("companyName") ?? "").trim()) {
      nextErrors.companyName = t("validation.companyName");
    }

    if (!String(form.get("taxId") ?? "").trim()) {
      nextErrors.taxId = t("validation.taxId");
    }

    if (!form.get("industry")) {
      nextErrors.industry = t("validation.industry");
    }

    if (!String(form.get("useCase") ?? "").trim()) {
      nextErrors.useCase = t("validation.useCase");
    }

    if (!form.get("volume")) {
      nextErrors.volume = t("validation.volume");
    }

    if (!form.get("environment")) {
      nextErrors.environment = t("validation.environment");
    }

    if (!form.get("needsIpWhitelist")) {
      nextErrors.needsIpWhitelist = t("validation.needsIpWhitelist");
    }

    if (form.get("needsIpWhitelist") === "si" && !String(form.get("ipRanges") ?? "").trim()) {
      nextErrors.ipRanges = t("validation.ipRanges");
    }

    if (!String(form.get("technicalName") ?? "").trim()) {
      nextErrors.technicalName = t("validation.technicalName");
    }

    if (!email) {
      nextErrors.technicalEmail = t("validation.technicalEmail");
    } else if (!EMAIL_PATTERN.test(email)) {
      nextErrors.technicalEmail = t("validation.technicalEmailInvalid");
    }

    if (!phone) {
      nextErrors.technicalPhone = t("validation.technicalPhone");
    } else if (!PHONE_PATTERN.test(phone)) {
      nextErrors.technicalPhone = t("validation.technicalPhoneInvalid");
    }

    if (!form.get("terms")) {
      nextErrors.terms = t("validation.terms");
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const nextErrors = validate(formData);
    setErrors(nextErrors);
    setFormError("");

    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    const lookupId = developerId ?? user?.uid;
    if (!lookupId) {
      setFormError(t("errors.loginRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contracting-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developerId: lookupId,
          razonSocial: String(formData.get("companyName") ?? "").trim(),
          nit: String(formData.get("taxId") ?? "").trim(),
          industria: String(formData.get("industry") ?? "").trim(),
          casoUso: String(formData.get("useCase") ?? "").trim(),
          volumenEstimado: String(formData.get("volume") ?? "").trim(),
          ambienteDestino: String(formData.get("environment") ?? "").trim(),
          ipWhitelist:
            formData.get("needsIpWhitelist") === "si"
              ? String(formData.get("ipRanges") ?? "").trim()
              : undefined,
          contactoTecnicoNombre: String(formData.get("technicalName") ?? "").trim(),
          contactoTecnicoEmail: String(formData.get("technicalEmail") ?? "").trim(),
          contactoTecnicoTelefono: String(formData.get("technicalPhone") ?? "").trim(),
          aceptaTerminos: formData.get("terms") === "on",
        }),
      });

      if (response.status !== 201) {
        throw new Error(t("errors.submit"));
      }

      if (linkedApp?.environment === "sandbox") {
        await markContracting(linkedApp.id);
      }

      setSubmitted(true);
    } catch {
      setFormError(t("errors.submit"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-8 text-center sm:py-10">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EFFCF5]">
          <CircleCheck className="h-10 w-10 text-[#347659]" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-[26px] font-bold tracking-[0.3px] text-[#141F25] sm:text-[32px]">
          {t("success.title")}
        </h1>
        <p className="mt-4 max-w-[560px] text-[16px] leading-7 text-[#6A7178]">{t("success.description")}</p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex h-[46px] items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)]"
        >
          {t("success.cta")}
        </Link>
      </div>
    );
  }

  const industryOptions = industryValues.map((value) => ({
    value,
    label: t(`industries.${value}`),
  }));
  const volumeOptions = monthlyVolumeValues.map((value) => ({
    value,
    label: t(`volumes.${value}`),
  }));
  const environmentOptions = destinationEnvironmentValues.map((value) => ({
    value,
    label: t(`environments.${value}`),
  }));
  const whitelistOptions = ipWhitelistValues.map((value) => ({
    value,
    label: t(`ipWhitelist.${value}`),
  }));

  return (
    <>
      <div className="border-b border-[#E7EAEE] pb-8">
        <h1 className="text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]">
          {t("form.title")}
        </h1>
        <p className="mt-4 text-[16px] leading-7 tracking-[0.2px] text-[#6A7178]">{t("form.description")}</p>
        {linkedApp ? (
          <p className="mt-4 rounded-[12px] bg-[#F8F9FB] px-4 py-3 text-[14px] text-[#404040]">
            {t("form.application")} <span className="font-semibold text-[#141F25]">{linkedApp.name}</span>
            {displayProduct ? (
              <>
                <br />
                {t("form.products")} <span className="font-semibold text-[#141F25]">{displayProduct}</span>
              </>
            ) : null}
          </p>
        ) : productName ? (
          <p className="mt-4 rounded-[12px] bg-[#F8F9FB] px-4 py-3 text-[14px] text-[#404040]">
            {t("form.productOfInterest")} <span className="font-semibold text-[#141F25]">{productName}</span>
          </p>
        ) : null}
      </div>

      <form className="mt-8 space-y-10" noValidate onSubmit={handleSubmit}>
        <input type="hidden" name="product" value={displayProduct} />
        {linkedApp ? <input type="hidden" name="appId" value={linkedApp.id} /> : null}
        <input type="hidden" name="accountEmail" value={user?.email ?? ""} />
        <input type="hidden" name="requestId" defaultValue="" />
        <input type="hidden" name="submittedAt" defaultValue="" />

        <FormSection>
          <TextField
            id="companyName"
            name="companyName"
            label={t("fields.companyName")}
            required
            autoComplete="organization"
            placeholder={t("fields.companyNamePlaceholder")}
            value={companyName}
            error={errors.companyName}
            onChange={(event) => {
              setCompanyName(event.currentTarget.value);
              clearError("companyName");
            }}
          />
          <TextField
            id="taxId"
            name="taxId"
            label={t("fields.taxId")}
            required
            placeholder={t("fields.taxIdPlaceholder")}
            error={errors.taxId}
            onChange={() => clearError("taxId")}
          />
          <SelectField
            id="industry"
            name="industry"
            label={t("fields.industry")}
            required
            error={errors.industry}
            onChange={() => clearError("industry")}
          >
            {industryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </FormSection>

        <FormSection>
          <TextAreaField
            id="useCase"
            name="useCase"
            label={t("fields.useCase")}
            required
            rows={5}
            hint={t("fields.useCaseHint")}
            placeholder={t("fields.useCasePlaceholder")}
            error={errors.useCase}
            onChange={() => clearError("useCase")}
          />
          <SelectField
            id="volume"
            name="volume"
            label={t("fields.volume")}
            required
            error={errors.volume}
            onChange={() => clearError("volume")}
          >
            {volumeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
          <RadioGroup
            legend={t("fields.environment")}
            name="environment"
            required
            error={errors.environment}
            value={environment}
            options={environmentOptions}
            onChange={(value) => {
              setEnvironment(value);
              clearError("environment");
            }}
          />
          <RadioGroup
            legend={t("fields.needsIpWhitelist")}
            name="needsIpWhitelist"
            required
            error={errors.needsIpWhitelist}
            value={needsIpWhitelist}
            options={whitelistOptions}
            onChange={(value) => {
              setNeedsIpWhitelist(value);
              clearError("needsIpWhitelist");
              if (value !== "si") {
                clearError("ipRanges");
              }
            }}
          />
          {needsIpWhitelist === "si" ? (
            <TextAreaField
              id="ipRanges"
              name="ipRanges"
              label={t("fields.ipRanges")}
              required
              rows={4}
              hint={t("fields.ipRangesHint", { example: IP_EXAMPLE })}
              placeholder={IP_PLACEHOLDER}
              error={errors.ipRanges}
              onChange={() => clearError("ipRanges")}
            />
          ) : null}
        </FormSection>

        <FormSection>
          <TextField
            id="technicalName"
            name="technicalName"
            label={t("fields.technicalName")}
            required
            autoComplete="name"
            placeholder={t("fields.technicalNamePlaceholder")}
            error={errors.technicalName}
            onChange={() => clearError("technicalName")}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <TextField
              id="technicalEmail"
              name="technicalEmail"
              type="email"
              label={t("fields.technicalEmail")}
              required
              autoComplete="email"
              placeholder={t("fields.technicalEmailPlaceholder")}
              error={errors.technicalEmail}
              onChange={() => clearError("technicalEmail")}
            />
            <TextField
              id="technicalPhone"
              name="technicalPhone"
              type="tel"
              label={t("fields.technicalPhone")}
              required
              autoComplete="tel"
              placeholder={t("fields.technicalPhonePlaceholder")}
              error={errors.technicalPhone}
              onChange={() => clearError("technicalPhone")}
            />
          </div>
        </FormSection>

        <FormSection>
          <div>
            <div className="flex items-start gap-3 text-[15px] text-[#404040]">
              <input
                id="terms"
                type="checkbox"
                name="terms"
                required
                onChange={() => clearError("terms")}
                className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-[4px] border border-[#C9CED4] accent-[#E1251B]"
              />
              <p>
                {t.rich("consents.terms", {
                  link: (chunks) => (
                    <button
                      type="button"
                      onClick={() => setTermsOpen(true)}
                      className="font-semibold text-[#E1251B] underline-offset-2 hover:underline"
                    >
                      {chunks}
                    </button>
                  ),
                  required: () => <span className="text-[#E1251B]">*</span>,
                })}
              </p>
            </div>
            {errors.terms ? <p className="mt-2 pl-8 text-[13px] text-[#E1251B]">{errors.terms}</p> : null}
          </div>

          <div className="flex flex-col items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)] disabled:translate-y-0 disabled:bg-[#C9CED4] disabled:shadow-none"
            >
              {isSubmitting ? t("actions.sending") : t("actions.submit")}
              {isSubmitting ? null : <span aria-hidden="true">→</span>}
            </button>
            {formError ? <p className="text-[13px] text-[#E1251B]">{formError}</p> : null}
          </div>
        </FormSection>
      </form>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
}

function FormSection({ children }: { children: ReactNode }) {
  return <section className="space-y-5">{children}</section>;
}
