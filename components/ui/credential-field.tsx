"use client";

import { useState } from "react";

export function CredentialField({
  label,
  value,
  secret,
}: {
  label: string;
  value: string;
  secret?: boolean;
}) {
  const [visible, setVisible] = useState(!secret);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="rounded-[18px] border border-[#E3E7EC] bg-white px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">{label}</p>
        <div className="flex items-center gap-2">
          {secret ? (
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              className="text-[13px] font-medium text-[#6A7178] transition-colors hover:text-[#E1251B]"
            >
              {visible ? "Ocultar" : "Mostrar"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-9 items-center justify-center rounded-full border border-[#D5DAE0] px-4 text-[13px] font-medium text-[#404040] transition-all duration-300 hover:bg-[#F3F5F7]"
          >
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>
      <p className="mt-3 break-all font-mono text-[14px] leading-7 text-[#141F25]">
        {visible ? value : "•".repeat(Math.min(value.length, 28))}
      </p>
    </div>
  );
}
