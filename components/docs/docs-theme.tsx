"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "docs-ide-theme";

export type DocsIdeTheme = "light" | "dark";

type DocsThemeContextValue = {
  theme: DocsIdeTheme;
  dark: boolean;
  toggleTheme: () => void;
};

const DocsThemeContext = createContext<DocsThemeContextValue | null>(null);

export function DocsThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<DocsIdeTheme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    }
  }, []);

  function toggleTheme() {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  return (
    <DocsThemeContext.Provider value={{ theme, dark: theme === "dark", toggleTheme }}>
      {children}
    </DocsThemeContext.Provider>
  );
}

export function useDocsTheme() {
  const context = useContext(DocsThemeContext);

  if (!context) {
    return {
      theme: "light" as const,
      dark: false,
      toggleTheme: () => undefined,
    };
  }

  return context;
}

export function DocsThemeToggle({ className = "" }: { className?: string }) {
  const t = useTranslations("Documentacion.explorer");
  const { dark, toggleTheme } = useDocsTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center text-[var(--docs-text)] transition-colors hover:bg-[var(--docs-hover)] ${className}`}
      aria-label={dark ? t("themeToLight") : t("themeToDark")}
      title={dark ? t("themeToLight") : t("themeToDark")}
      aria-pressed={dark}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M12.6 9.6A5.2 5.2 0 0 1 6.4 3.4 5.3 5.3 0 1 0 12.6 9.6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 2.2v1.3M8 12.5v1.3M2.2 8h1.3M12.5 8h1.3M3.9 3.9l.9.9M11.2 11.2l.9.9M3.9 12.1l.9-.9M11.2 4.8l.9-.9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
