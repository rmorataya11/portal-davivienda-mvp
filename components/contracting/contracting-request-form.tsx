"use client";

import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { MenuSelectField, TextAreaField, TextField } from "@/components/auth/auth-form-fields";
import { useCatalogView } from "@/components/catalog/catalog-provider";
import { AppStatusBadge } from "@/components/dashboard/app-status-badge";
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

  const linkedProduct = useCatalogView(linkedApp?.apiProduct ?? "");
  const displayProduct = linkedProduct?.name ?? productName;
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [volume, setVolume] = useState("");
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
          app_id: linkedApp?.id ?? null,
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
      <div>
        <h1 className="text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#404040] sm:text-[36px]">
          {t("form.title")}
        </h1>
        <p className="mt-4 text-[16px] leading-7 tracking-[0.24px] text-[#5A5A5A]">{t("form.description")}</p>
        {linkedApp || displayProduct ? (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {linkedApp ? (
              <>
                <p className="text-[15px] font-semibold text-[#404040]">{linkedApp.name}</p>
                <AppStatusBadge environment={linkedApp.environment} />
              </>
            ) : null}
            {displayProduct ? (
              <span className="inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-full border border-[#E7EAEE] bg-[#F8F9FB] px-2.5 py-1 text-[12px] font-medium text-[#404040]">
                {linkedProduct?.icon ? (
                  <img src={linkedProduct.icon} alt="" className="h-4 w-4 shrink-0 object-contain" aria-hidden="true" />
                ) : null}
                <span className="min-w-0 truncate">{displayProduct}</span>
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <form className="mt-8" noValidate onSubmit={handleSubmit}>
        <input type="hidden" name="product" value={displayProduct} />
        {linkedApp ? <input type="hidden" name="appId" value={linkedApp.id} /> : null}
        <input type="hidden" name="accountEmail" value={user?.email ?? ""} />
        <input type="hidden" name="requestId" defaultValue="" />
        <input type="hidden" name="submittedAt" defaultValue="" />

        <FormSection title={t("sections.company")}>
          <TextField
            id="companyName"
            name="companyName"
            orientation="row"
            label={t("fields.companyName")}
            required
            autoComplete="organization"
            placeholder={t("fields.companyNamePlaceholder")}
            value={companyName}
            error={errors.companyName}
            className="py-4"
            onChange={(event) => {
              setCompanyName(event.currentTarget.value);
              clearError("companyName");
            }}
          />
          <TextField
            id="taxId"
            name="taxId"
            orientation="row"
            label={t("fields.taxId")}
            required
            placeholder={t("fields.taxIdPlaceholder")}
            error={errors.taxId}
            className="border-t border-[#E7EAEE] py-4"
            onChange={() => clearError("taxId")}
          />
          <MenuSelectField
            id="industry"
            name="industry"
            orientation="row"
            label={t("fields.industry")}
            required
            value={industry}
            error={errors.industry}
            options={industryOptions}
            className="border-t border-[#E7EAEE] py-4"
            onChange={(value) => {
              setIndustry(value);
              clearError("industry");
            }}
          />
        </FormSection>

        <FormSection title={t("sections.request")}>
          <TextAreaField
            id="useCase"
            name="useCase"
            orientation="row"
            label={t("fields.useCase")}
            required
            rows={5}
            hint={t("fields.useCaseHint")}
            placeholder={t("fields.useCasePlaceholder")}
            error={errors.useCase}
            className="py-4"
            onChange={() => clearError("useCase")}
          />
          <MenuSelectField
            id="volume"
            name="volume"
            orientation="row"
            label={t("fields.volume")}
            required
            value={volume}
            error={errors.volume}
            options={volumeOptions}
            className="border-t border-[#E7EAEE] py-4"
            onChange={(value) => {
              setVolume(value);
              clearError("volume");
            }}
          />
          <RadioGroup
            legend={t("fields.environment")}
            name="environment"
            orientation="row"
            required
            error={errors.environment}
            value={environment}
            options={environmentOptions}
            className="border-t border-[#E7EAEE] py-4"
            onChange={(value) => {
              setEnvironment(value);
              clearError("environment");
            }}
          />
          <RadioGroup
            legend={t("fields.needsIpWhitelist")}
            name="needsIpWhitelist"
            orientation="row"
            required
            error={errors.needsIpWhitelist}
            value={needsIpWhitelist}
            options={whitelistOptions}
            className="border-t border-[#E7EAEE] py-4"
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
              orientation="row"
              label={t("fields.ipRanges")}
              required
              rows={4}
              hint={t("fields.ipRangesHint", { example: IP_EXAMPLE })}
              placeholder={IP_PLACEHOLDER}
              error={errors.ipRanges}
              className="border-t border-[#E7EAEE] py-4"
              onChange={() => clearError("ipRanges")}
            />
          ) : null}
        </FormSection>

        <FormSection title={t("sections.contact")}>
          <TextField
            id="technicalName"
            name="technicalName"
            orientation="row"
            label={t("fields.technicalName")}
            required
            autoComplete="name"
            placeholder={t("fields.technicalNamePlaceholder")}
            error={errors.technicalName}
            className="py-4"
            onChange={() => clearError("technicalName")}
          />
          <TextField
            id="technicalEmail"
            name="technicalEmail"
            type="email"
            orientation="row"
            label={t("fields.technicalEmail")}
            required
            autoComplete="email"
            placeholder={t("fields.technicalEmailPlaceholder")}
            error={errors.technicalEmail}
            className="border-t border-[#E7EAEE] py-4"
            onChange={() => clearError("technicalEmail")}
          />
          <TextField
            id="technicalPhone"
            name="technicalPhone"
            type="tel"
            orientation="row"
            label={t("fields.technicalPhone")}
            required
            autoComplete="tel"
            placeholder={t("fields.technicalPhonePlaceholder")}
            error={errors.technicalPhone}
            className="border-t border-[#E7EAEE] py-4"
            onChange={() => clearError("technicalPhone")}
          />
        </FormSection>

        <div className="border-t border-[#E7EAEE] pt-5">
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

          <div className="mt-6 flex flex-col items-stretch gap-3 sm:items-start">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)] disabled:translate-y-0 disabled:bg-[#C9CED4] disabled:shadow-none sm:w-auto"
            >
              {isSubmitting ? t("actions.sending") : t("actions.submit")}
            </button>
            {formError ? <p className="text-[13px] text-[#E1251B]">{formError}</p> : null}
          </div>
        </div>
      </form>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-[#E7EAEE] pt-5 pb-2">
      <h2 className="text-[13px] font-medium text-[#8E8E8E]">{title}</h2>
      <div className="mt-1">{children}</div>
    </section>
  );
}
