"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { DeleteAccountModal } from "./delete-account-modal";

export function ProfileDangerZone() {
  const t = useTranslations("Profile.danger");
  const [open, setOpen] = useState(false);

  return (
    <section className="flex h-full flex-col rounded-[24px] border border-[#E7B8B5] bg-[#FFF8F8] px-5 py-6 sm:px-6">
      <h2 className="text-[18px] font-bold tracking-[0.2px] text-[#404040]">{t("title")}</h2>
      <p className="mt-2 text-[15px] leading-7 text-[#707070]">{t("description")}</p>
      <div className="mt-auto pt-5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 items-center justify-center rounded-full border border-[#E1251B] bg-white px-5 text-[14px] font-semibold text-[#E1251B] transition-colors hover:bg-[#FFF1F0]"
        >
          {t("delete")}
        </button>
      </div>
      <DeleteAccountModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
