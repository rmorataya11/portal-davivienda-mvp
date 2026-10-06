"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { BreakablePath } from "@/components/ui/breakable-path";

export function CredentialField({
  label,
  value,
  secret,
  variant = "card",
}: {
  label: string;
  value: string;
  secret?: boolean;
  variant?: "card" | "well";
}) {
  const t = useTranslations("Dashboard.credentials");
  const [visible, setVisible] = useState(!secret);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div
      className={
        variant === "well"
          ? "rounded-2xl bg-[#F2F3F5] px-5 py-4"
          : "rounded-[18px] border border-[#E3E7EC] bg-white px-5 py-4"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] font-medium text-[#8E8E8E]">{label}</p>
        <div className="flex items-center gap-2">
          {secret ? (
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              className="text-[13px] font-medium text-[#6A7178] transition-colors hover:text-[#E1251B]"
            >
              {visible ? t("hide") : t("show")}
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex h-9 items-center justify-center rounded-full border border-[#D5DAE0] px-4 text-[13px] font-medium text-[#404040] transition-colors ${
              variant === "well" ? "bg-white hover:bg-[#EEF0F2]" : "hover:bg-[#F3F5F7]"
            }`}
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      </div>
      <p className="mt-3 font-mono text-[14px] leading-7 text-[#404040]">
        {visible ? <BreakablePath value={value} /> : "•".repeat(Math.min(value.length, 28))}
      </p>
    </div>
  );
}
