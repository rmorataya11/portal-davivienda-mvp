"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useId } from "react";

export const SUPPORT_HREF = "/soporte";

export function DeleteAccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("Profile.danger");
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
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
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8">
      <button type="button" className="absolute inset-0 bg-[#141F25]/45" aria-label={t("closeAria")} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-[520px] rounded-[24px] bg-white px-6 py-6 shadow-[0_24px_70px_rgba(20,31,37,0.18)] sm:px-8 sm:py-8"
      >
        <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#E1251B]">{t("eyebrow")}</p>
        <h2 id={titleId} className="mt-2 text-[24px] font-bold tracking-[0.3px] text-[#141F25]">
          {t("title")}
        </h2>
        <p className="mt-4 text-[15px] leading-7 text-[#5B636A]">
          {t.rich("modalDescription", {
            support: (chunks) => (
              <Link href={SUPPORT_HREF} className="font-semibold text-[#E1251B] underline-offset-2 hover:underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href={SUPPORT_HREF}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
          >
            {t("goToSupport")}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#D5DAE0] bg-white px-6 text-[14px] font-semibold text-[#404040] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E1251B] hover:text-[#E1251B]"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}
