"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { setUserLocale } from "@/app/actions/locale";
import type { Locale } from "@/i18n/config";

type LanguageSwitcherProps = {
  compact?: boolean;
  theme?: "light" | "dark";
};

const options: Array<{ locale: Locale; labelKey: "spanish" | "english"; shortLabelKey: "shortSpanish" | "shortEnglish" }> = [
  { locale: "es", labelKey: "spanish", shortLabelKey: "shortSpanish" },
  { locale: "en", labelKey: "english", shortLabelKey: "shortEnglish" },
];

export function LanguageSwitcher({ compact = false, theme = "light" }: LanguageSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("Language");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isDark = theme === "dark";

  function changeLocale(nextLocale: Locale) {
    if (nextLocale === locale || isPending) {
      return;
    }

    startTransition(async () => {
      await setUserLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={`inline-flex rounded-full p-1 ${
        isDark ? "border border-white/35 bg-white/10" : "border border-[#D5DAE0] bg-[#F2F3F5]"
      }`}
    >
      {options.map((option) => {
        const selected = locale === option.locale;

        return (
          <button
            key={option.locale}
            type="button"
            aria-pressed={selected}
            disabled={isPending}
            onClick={() => changeLocale(option.locale)}
            className={`min-h-8 rounded-full px-3 text-[12px] font-semibold transition-colors disabled:cursor-wait disabled:opacity-70 ${
              selected
                ? isDark
                  ? "bg-white text-[#870412]"
                  : "bg-[#E1251B] text-white"
                : isDark
                  ? "text-white hover:bg-white/10"
                  : "text-[#5B636A] hover:text-[#E1251B]"
            }`}
          >
            {t(compact ? option.shortLabelKey : option.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
