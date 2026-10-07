"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { resetPassword } from "@/lib/auth/session";
import { getAuthErrorKey } from "@/lib/firebase/errors";

export function ProfilePasswordCard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const t = useTranslations("Profile.password");
  const authT = useTranslations("Auth");
  const [resetState, setResetState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [resetError, setResetError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  async function handlePasswordReset() {
    if (!user?.email) {
      return;
    }

    setResetError("");
    setResetState("sending");

    try {
      await resetPassword(user.email);
      setResetState("sent");
    } catch (error) {
      setResetError(authT(`errors.${getAuthErrorKey(error)}`));
      setResetState("error");
    }
  }

  async function handleSignOut() {
    setSigningOut(true);

    try {
      await signOut();
      router.push("/");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div>
      <p className="text-[14px] leading-6 text-[#707070]">
        {t("description", { email: user?.email ?? t("descriptionFallback") })}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
        <button
          type="button"
          onClick={handlePasswordReset}
          disabled={resetState === "sending" || !user?.email}
          className="text-[14px] font-semibold text-[#E1251B] transition-colors hover:text-[#C01F16] disabled:text-[#C9CED4]"
        >
          {resetState === "sending" ? t("sending") : t("submit")}
        </button>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="text-[14px] font-medium text-[#8E8E8E] transition-colors hover:text-[#E1251B] disabled:opacity-60"
        >
          {signingOut ? t("signingOut") : t("signOut")}
        </button>
      </div>
      {resetState === "sent" ? <p className="mt-2 text-[14px] text-[#347659]">{t("sent")}</p> : null}
      {resetError ? <p className="mt-2 text-[14px] text-[#E1251B]">{resetError}</p> : null}
    </div>
  );
}
