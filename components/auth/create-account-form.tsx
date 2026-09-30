"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { signUp } from "@/lib/auth/session";
import { getAuthErrorKey } from "@/lib/firebase/errors";
import { getLoginHref, rememberReturnPath, resolveAuthReturnPath } from "@/lib/navigation/safe-path";

import { PasswordField, SelectField, TextField } from "./auth-form-fields";
import { caseReasons, identificationTypes } from "./content/create-account";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Record<string, string>;

export function CreateAccountForm() {
  const router = useRouter();
  const t = useTranslations("Auth");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const email = String(form.get("email") ?? "").trim();
    const idNumber = String(form.get("idNumber") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (!email) {
      nextErrors.email = t("errors.emailRequired");
    } else if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = t("errors.emailInvalid");
    }

    if (!form.get("idType")) {
      nextErrors.idType = t("errors.idTypeRequired");
    }

    if (!idNumber) {
      nextErrors.idNumber = t("errors.idNumberRequired");
    }

    if (!password) {
      nextErrors.password = t("errors.passwordCreateRequired");
    } else if (password.length < 8) {
      nextErrors.password = t("errors.passwordMin");
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = t("errors.confirmPasswordRequired");
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = t("errors.passwordsMismatch");
    }

    if (!String(form.get("companyName") ?? "").trim()) {
      nextErrors.companyName = t("errors.companyNameRequired");
    }

    if (!form.get("reason")) {
      nextErrors.reason = t("errors.reasonRequired");
    }

    if (!form.get("terms")) {
      nextErrors.terms = t("errors.termsRequired");
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextErrors = validate(formData);
    setErrors(nextErrors);
    setFormError("");

    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(firstField)?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const email = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "");
      const companyName = String(formData.get("companyName") ?? "").trim();

      const user = await signUp(email, password);
      const response = await fetch("/api/developers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identityUid: user.uid,
          email: user.email,
          fullName: companyName,
          companyName,
          documentType: String(formData.get("idType") ?? "").trim(),
          documentId: String(formData.get("idNumber") ?? "").trim(),
          reason: String(formData.get("reason") ?? "").trim(),
          terms: formData.get("terms") === "on",
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        setFormError(t(`errors.${payload?.message ? getAuthErrorKey(payload.message) : "registrationFailed"}`));
        return;
      }

      const destination = resolveAuthReturnPath() ?? "/dashboard";
      router.replace(destination);
    } catch (error) {
      setFormError(t(`errors.${getAuthErrorKey(error)}`));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="border-b border-[#E7EAEE] pb-8">
        <h1 className="text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]">
          {t("signup.title")}
        </h1>
        <p className="mt-4 text-[16px] leading-7 tracking-[0.2px] text-[#6A7178]">{t("signup.description")}</p>
      </div>

      <form className="mt-8 space-y-6" noValidate onSubmit={handleSubmit}>
        <TextField
          id="email"
          name="email"
          type="email"
          label={t("common.email")}
          required
          autoComplete="email"
          placeholder={t("common.emailPlaceholder")}
          error={errors.email}
          onChange={() => clearError("email")}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <PasswordField
            id="password"
            name="password"
            label={t("common.password")}
            required
            autoComplete="new-password"
            placeholder={t("common.passwordMinPlaceholder")}
            error={errors.password}
            onChange={() => clearError("password")}
          />
          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label={t("common.confirmPassword")}
            required
            autoComplete="new-password"
            placeholder={t("common.repeatPasswordPlaceholder")}
            error={errors.confirmPassword}
            onChange={() => clearError("confirmPassword")}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <SelectField
            id="idType"
            name="idType"
            label={t("signup.idType")}
            required
            error={errors.idType}
            onChange={() => clearError("idType")}
          >
            {identificationTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {t(`signup.idTypes.${option.value}`)}
              </option>
            ))}
          </SelectField>
          <TextField
            id="idNumber"
            name="idNumber"
            label={t("signup.idNumber")}
            required
            inputMode="numeric"
            placeholder={t("signup.idNumberPlaceholder")}
            error={errors.idNumber}
            onChange={() => clearError("idNumber")}
          />
        </div>

        <TextField
          id="companyName"
          name="companyName"
          label={t("signup.companyName")}
          required
          autoComplete="organization"
          placeholder={t("signup.companyNamePlaceholder")}
          error={errors.companyName}
          onChange={() => clearError("companyName")}
        />

        <SelectField
          id="reason"
          name="reason"
          label={t("signup.reason")}
          required
          error={errors.reason}
          onChange={() => clearError("reason")}
        >
          {caseReasons.map((option) => (
            <option key={option.value} value={option.value}>
              {t(`signup.reasons.${option.value}`)}
            </option>
          ))}
        </SelectField>

        <div className="space-y-3">
          <label className="flex cursor-pointer items-start gap-3 text-[15px] text-[#404040]">
            <input
              id="terms"
              type="checkbox"
              name="terms"
              required
              onChange={() => clearError("terms")}
              className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-[4px] border border-[#C9CED4] accent-[#E1251B]"
            />
            <span>
              {t.rich("signup.terms", {
                link: (chunks) => (
                  <Link href="#terminos" className="font-semibold text-[#E1251B] underline-offset-2 hover:underline">
                    {chunks}
                  </Link>
                ),
                required: () => <span className="text-[#E1251B]">*</span>,
              })}
            </span>
          </label>
          {errors.terms ? <p className="pl-8 text-[13px] text-[#E1251B]">{errors.terms}</p> : null}
        </div>

        <div className="flex flex-col items-center gap-4 pt-2 text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 min-w-[220px] items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)] disabled:translate-y-0 disabled:bg-[#C9CED4] disabled:shadow-none"
          >
            {isSubmitting ? t("signup.submitting") : t("common.createAccount")}
            {isSubmitting ? null : <span aria-hidden="true">→</span>}
          </button>
          <p className="text-[15px] text-[#5B636A]">
            {t("signup.hasAccount")}{" "}
            <Link
              href={getLoginHref(resolveAuthReturnPath())}
              onClick={() => {
                const destination = resolveAuthReturnPath();
                if (destination) {
                  rememberReturnPath(destination);
                }
              }}
              className="font-medium text-[#141F25] transition-colors hover:text-[#E1251B]"
            >
              {t("signup.signInLink")}
            </Link>
          </p>
        </div>
        {formError ? <p className="text-center text-[13px] text-[#E1251B]">{formError}</p> : null}
      </form>
    </>
  );
}
