"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useState, type FormEvent } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { ContentAccessGate } from "@/components/auth/content-access-gate";
import { SelectField, TextAreaField, TextField } from "@/components/auth/auth-form-fields";
import { useCatalogViews } from "@/components/catalog/catalog-provider";
import { RadioGroup } from "@/components/contracting/radio-group";
import { getSessionIdToken } from "@/lib/auth/session";
import { type SupportCaseSeverity } from "@/lib/support/cases";

const severityValues = ["bloqueante", "importante", "consulta"] as const;

type FieldErrors = Record<string, string>;

export function SupportCaseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("Faq.case");
  const products = useCatalogViews();
  const { user, developerId } = useAuth();
  const titleId = useId();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [apiSlug, setApiSlug] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
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
  }, [isSubmitting, onClose, open]);

  useEffect(() => {
    if (open) {
      return;
    }

    setTitle("");
    setDescription("");
    setSeverity("");
    setApiSlug("");
    setErrors({});
    setIsSubmitting(false);
    setSubmitted(false);
    setFormError("");
  }, [open]);

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

  function validate() {
    const nextErrors: FieldErrors = {};

    if (!title.trim()) {
      nextErrors.title = t("titleRequired");
    }

    if (!description.trim()) {
      nextErrors.description = t("descriptionRequired");
    }

    if (!severity) {
      nextErrors.severity = t("severityRequired");
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setFormError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await getSessionIdToken();

      if (!token) {
        throw new Error(t("submitError"));
      }

      const response = await fetch("/api/support-cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: title.trim(),
          descripcion: description.trim(),
          severidad: severity as SupportCaseSeverity,
          apiSlug: apiSlug || undefined,
          developerId: developerId ?? user?.uid ?? undefined,
          email: user?.email || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(t("submitError"));
      }

      setSubmitted(true);
      window.setTimeout(() => {
        onClose();
      }, 2200);
    } catch {
      setFormError(t("submitError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!open) {
    return null;
  }

  const severityOptions = severityValues.map((value) => ({
    value,
    label: t(`severities.${value}`),
  }));

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        className="absolute inset-0 bg-[#141F25]/45"
        aria-label={t("closeAria")}
        onClick={() => {
          if (!isSubmitting) {
            onClose();
          }
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[80vh] w-full max-w-[560px] overflow-y-auto rounded-[24px] bg-white px-6 py-6 shadow-[0_24px_70px_rgba(20,31,37,0.18)] sm:px-8 sm:py-8"
      >
        {submitted ? (
          <div>
            <h2 id={titleId} className="text-[24px] font-bold tracking-[0.3px] text-[#141F25]">
              {t("createdTitle")}
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[#5B636A]">{t("createdDescription")}</p>
          </div>
        ) : (
          <ContentAccessGate
            embedded
            titleId={titleId}
            eyebrow={t("gateEyebrow")}
            description={t("gateDescription")}
            fallbackPath="/soporte"
          >
            <h2 id={titleId} className="text-[24px] font-bold tracking-[0.3px] text-[#141F25]">
              {t("title")}
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-[#6A7178]">{t("description")}</p>

            <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit}>
              <TextField
                id="support-title"
                name="title"
                label={t("fieldTitle")}
                required
                value={title}
                error={errors.title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  clearError("title");
                }}
              />

              <TextAreaField
                id="support-description"
                name="description"
                label={t("fieldDescription")}
                required
                value={description}
                error={errors.description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  clearError("description");
                }}
              />

              <RadioGroup
                legend={t("severity")}
                name="severity"
                required
                error={errors.severity}
                options={severityOptions}
                value={severity}
                onChange={(value) => {
                  setSeverity(value);
                  clearError("severity");
                }}
              />

              <SelectField
                id="support-api"
                name="apiSlug"
                label={t("api")}
                placeholder={t("apiPlaceholder")}
                value={apiSlug}
                onChange={(event) => setApiSlug(event.target.value)}
              >
                {products.map((api) => (
                  <option key={api.slug} value={api.slug}>
                    {api.name}
                  </option>
                ))}
              </SelectField>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C] disabled:translate-y-0 disabled:bg-[#C9CED4]"
                >
                  {isSubmitting ? t("sending") : t("submit")}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={onClose}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[#D5DAE0] bg-white px-6 text-[14px] font-semibold text-[#404040] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E1251B] hover:text-[#E1251B] disabled:opacity-50"
                >
                  {t("cancel")}
                </button>
              </div>
              {formError ? <p className="text-[13px] text-[#E1251B]">{formError}</p> : null}
            </form>
          </ContentAccessGate>
        )}
      </div>
    </div>
  );
}
