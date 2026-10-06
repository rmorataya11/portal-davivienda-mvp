"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { sendPasswordResetEmail } from "firebase/auth";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { SurfaceCard } from "@/components/ui/layout";
import { getPasswordResetActionCodeSettings } from "@/lib/auth/session";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { getAuthErrorKey } from "@/lib/firebase/errors";

import { TextField } from "./auth-form-fields";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RecoverPasswordPage() {
  const t = useTranslations("Auth");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();

    if (!email) {
      setError(t("errors.emailRequired"));
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setError(t("errors.emailInvalid"));
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email, getPasswordResetActionCodeSettings());
      setSubmitted(true);
    } catch (resetError) {
      const code = typeof resetError === "object" && resetError && "code" in resetError ? String(resetError.code) : "";

      if (code === "auth/user-not-found") {
        setSubmitted(true);
        return;
      }

      setError(t(`errors.${getAuthErrorKey(resetError)}`));
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
            {submitted ? (
              <div>
                <h1 className="text-[26px] font-bold tracking-[0.3px] text-[#141F25] sm:text-[32px] lg:text-[36px]">
                  {t("recover.sentTitle")}
                </h1>
                <p className="mt-4 text-[16px] leading-7 text-[#6A7178]">{t("recover.sentDescription")}</p>
                <Link
                  href="/iniciar-sesion"
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
                >
                  {t("recover.backToLogin")}
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]">
                  {t("recover.title")}
                </h1>
                <p className="mt-4 text-[16px] leading-7 text-[#6A7178]">{t("recover.description")}</p>
                <form className="mt-8 space-y-6" noValidate onSubmit={handleSubmit}>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    label={t("common.email")}
                    required
                    autoComplete="email"
                    placeholder={t("common.emailPlaceholder")}
                    error={error}
                    onChange={() => setError("")}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C] disabled:bg-[#C9CED4]"
                  >
                    {isSubmitting ? t("recover.submitting") : t("recover.submit")}
                  </button>
                </form>
                <p className="mt-6 text-[15px] text-[#5B636A]">
                  {t("recover.remembered")}{" "}
                  <Link href="/iniciar-sesion" className="font-medium text-[#141F25] transition-colors hover:text-[#E1251B]">
                    {t("recover.signInLink")}
                  </Link>
                </p>
              </>
            )}
          </SurfaceCard>
        </div>
      </section>

      <MarketplaceFooter />
    </main>
  );
}
