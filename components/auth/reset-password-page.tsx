"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { SurfaceCard } from "@/components/ui/layout";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { getAuthErrorKey } from "@/lib/firebase/errors";

import { PasswordField } from "./auth-form-fields";

type FieldErrors = Record<string, string>;
type ResetStatus = "checking" | "invalid" | "ready" | "success";

function isInvalidActionCode(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  return code === "auth/expired-action-code" || code === "auth/invalid-action-code";
}

export function ResetPasswordPage() {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode") ?? searchParams.get("oobcode");
  const hasValidParams = mode === "resetPassword" && Boolean(oobCode);

  const [status, setStatus] = useState<ResetStatus>(hasValidParams ? "checking" : "invalid");
  const [accountEmail, setAccountEmail] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode !== "resetPassword" || !oobCode) {
      setStatus("invalid");
      return;
    }

    let cancelled = false;
    setStatus("checking");

    verifyPasswordResetCode(getFirebaseAuth(), oobCode)
      .then((email) => {
        if (cancelled) {
          return;
        }

        setAccountEmail(email);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("invalid");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mode, oobCode]);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!oobCode) {
      setStatus("invalid");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const nextErrors: FieldErrors = {};

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

    setErrors(nextErrors);
    setFormError("");

    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      await confirmPasswordReset(getFirebaseAuth(), oobCode, password);
      setStatus("success");
    } catch (error) {
      if (isInvalidActionCode(error)) {
        setStatus("invalid");
        return;
      }

      setFormError(t(`errors.${getAuthErrorKey(error)}`));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader />

      <section className="pt-4 pb-16">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6">
          <SurfaceCard className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            {status === "checking" ? (
              <div className="h-48 animate-pulse rounded-[18px] bg-[#F2F3F5]" />
            ) : null}

            {status === "invalid" ? (
              <div>
                <h1 className="text-[26px] font-bold tracking-[0.3px] text-[#141F25] sm:text-[32px] lg:text-[36px]">
                  {t("reset.invalidTitle")}
                </h1>
                <p className="mt-4 text-[16px] leading-7 text-[#6A7178]">{t("reset.invalidDescription")}</p>
                <Link
                  href="/recuperar-clave"
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
                >
                  {t("reset.requestNewLink")}
                </Link>
              </div>
            ) : null}

            {status === "success" ? (
              <div>
                <h1 className="text-[26px] font-bold tracking-[0.3px] text-[#141F25] sm:text-[32px] lg:text-[36px]">
                  {t("reset.successTitle")}
                </h1>
                <p className="mt-4 text-[16px] leading-7 text-[#6A7178]">{t("reset.successDescription")}</p>
                <Link
                  href="/iniciar-sesion"
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
                >
                  {t("reset.goToLogin")}
                </Link>
              </div>
            ) : null}

            {status === "ready" ? (
              <>
                <h1 className="text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]">
                  {t("reset.title")}
                </h1>
                <p className="mt-4 text-[16px] leading-7 text-[#6A7178]">
                  {accountEmail ? t("reset.descriptionWithEmail", { email: accountEmail }) : t("reset.description")}
                </p>
                <form className="mt-8 space-y-6" noValidate onSubmit={handleSubmit}>
                  <PasswordField
                    id="password"
                    name="password"
                    label={t("reset.newPassword")}
                    required
                    autoComplete="new-password"
                    placeholder={t("common.passwordMinPlaceholder")}
                    error={errors.password}
                    onChange={() => clearError("password")}
                  />
                  <PasswordField
                    id="confirmPassword"
                    name="confirmPassword"
                    label={t("reset.confirmNewPassword")}
                    required
                    autoComplete="new-password"
                    placeholder={t("common.repeatPasswordPlaceholder")}
                    error={errors.confirmPassword}
                    onChange={() => clearError("confirmPassword")}
                  />
                  {formError ? <p className="text-[13px] text-[#E1251B]">{formError}</p> : null}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C] disabled:bg-[#C9CED4]"
                  >
                    {isSubmitting ? t("reset.submitting") : t("reset.submit")}
                  </button>
                </form>
              </>
            ) : null}
          </SurfaceCard>
        </div>
      </section>

      <MarketplaceFooter />
    </main>
  );
}
