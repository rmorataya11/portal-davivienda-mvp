"use client";

import { Check, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";

import { setUserLocale } from "@/app/actions/locale";
import type { Locale } from "@/i18n/config";

const options: Array<{ locale: Locale; label: string }> = [
  { locale: "es", label: "Español" },
  { locale: "en", label: "English" },
];

type LanguageDropdownProps = {
  theme?: "light" | "dark";
  align?: "left" | "right";
};

export function LanguageDropdown({ theme = "light", align = "right" }: LanguageDropdownProps) {
  const locale = useLocale();
  const t = useTranslations("Language");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const isDark = theme === "dark";

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function changeLocale(nextLocale: Locale) {
    setOpen(false);

    if (nextLocale === locale || isPending) {
      return;
    }

    startTransition(async () => {
      await setUserLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={t("label")}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        disabled={isPending}
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex min-h-8 items-center gap-1 rounded-full px-2.5 text-[12px] font-semibold tracking-[0.4px] transition-colors disabled:cursor-wait disabled:opacity-70 ${
          isDark
            ? "text-white hover:bg-white/12"
            : "text-[#141F25] hover:bg-[#F8F9FB]"
        }`}
      >
        {locale.toUpperCase()}
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className={`absolute z-[90] mt-2 min-w-[168px] overflow-hidden rounded-[12px] border border-[#E7EAEE] bg-white py-1 shadow-[0_16px_40px_rgba(20,31,37,0.16)] ${
            align === "left" ? "left-0" : "right-0"
          }`}
        >
          {options.map((option) => {
            const selected = locale === option.locale;

            return (
              <button
                key={option.locale}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                disabled={isPending}
                onClick={() => changeLocale(option.locale)}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-[14px] font-medium transition-colors ${
                  selected
                    ? "bg-[#FFF1F0] text-[#E1251B]"
                    : "text-[#141F25] hover:bg-[#F8F9FB] hover:text-[#E1251B]"
                }`}
              >
                {option.label}
                {selected ? <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
