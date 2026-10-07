"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";

import { useDocsTheme } from "@/components/docs/docs-theme";
import type { CodeResponseExample as DocsResponseExample } from "@/lib/catalog/generate-code-samples";

SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("python", python);

const daviviendaCodeTheme = {
  'pre[class*="language-"]': {
    background: "transparent",
    margin: 0,
    padding: 0,
    fontSize: "13px",
    lineHeight: "1.65",
    overflow: "visible",
  },
  'code[class*="language-"]': {
    background: "transparent",
    color: "#404040",
    fontSize: "13px",
    lineHeight: "1.65",
    textShadow: "none",
  },
  comment: { color: "#8E8E8E" },
  function: { color: "#E1251B" },
  builtin: { color: "#E1251B" },
  keyword: { color: "#8A4B00" },
  string: { color: "#347659" },
  number: { color: "#202A31" },
  boolean: { color: "#8A4B00" },
  null: { color: "#707070", fontStyle: "italic" },
  property: { color: "#E1251B" },
  operator: { color: "#707070" },
  punctuation: { color: "#707070" },
  variable: { color: "#404040" },
};

const daviviendaDarkCodeTheme = {
  'pre[class*="language-"]': {
    background: "transparent",
    margin: 0,
    padding: 0,
    fontSize: "13px",
    lineHeight: "1.65",
    overflow: "visible",
  },
  'code[class*="language-"]': {
    background: "transparent",
    color: "#E6EDF3",
    fontSize: "13px",
    lineHeight: "1.65",
    textShadow: "none",
  },
  comment: { color: "#8B949E" },
  function: { color: "#FF7B72" },
  builtin: { color: "#FF7B72" },
  keyword: { color: "#FFA657" },
  string: { color: "#7EE787" },
  number: { color: "#79C0FF" },
  boolean: { color: "#FFA657" },
  null: { color: "#8B949E", fontStyle: "italic" },
  property: { color: "#FF7B72" },
  operator: { color: "#8B949E" },
  punctuation: { color: "#8B949E" },
  variable: { color: "#E6EDF3" },
};

const languageTabs = [
  { id: "json", language: "json" },
  { id: "curl", language: "bash" },
  { id: "javascript", language: "javascript" },
  { id: "python", language: "python" },
] as const;

type ExampleLanguage = (typeof languageTabs)[number]["id"];

function prettyPrintJson(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

function CopyButton({ content }: { content: string }) {
  const t = useTranslations("Documentacion.explorer");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="h-8 px-2 font-mono text-[11px] text-[var(--docs-soft)] transition-colors hover:text-[var(--docs-text)]"
    >
      {copied ? t("copied") : t("copy")}
    </button>
  );
}

function useDocsCodeTheme() {
  const { dark } = useDocsTheme();
  return dark ? daviviendaDarkCodeTheme : daviviendaCodeTheme;
}

export function DocsRequestCode({
  examples,
}: {
  examples: { json: string; curl: string; javascript: string; python: string };
}) {
  const t = useTranslations("Documentacion.explorer");
  const [language, setLanguage] = useState<ExampleLanguage>("json");
  const codeTheme = useDocsCodeTheme();
  const activeTab = languageTabs.find((tab) => tab.id === language) ?? languageTabs[0];
  const rawCode = examples[activeTab.id];
  const code = activeTab.language === "json" ? prettyPrintJson(rawCode) : rawCode;

  return (
    <div className="overflow-hidden rounded-[16px] border border-[var(--docs-border)] bg-[var(--docs-code)]">
      <div className="flex h-12 items-center justify-between gap-3 bg-[var(--docs-code-bar)] px-4">
        <div className="flex min-w-0 items-center gap-3 overflow-x-auto">
          {languageTabs.map((tab) => {
            const isActive = tab.id === language;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setLanguage(tab.id)}
                className={`h-12 shrink-0 font-mono text-[12px] ${
                  isActive
                    ? "font-semibold text-[var(--docs-text)]"
                    : "text-[var(--docs-soft)] hover:text-[var(--docs-text)]"
                }`}
              >
                {t(`languages.${tab.id}`)}
              </button>
            );
          })}
        </div>
        <CopyButton content={code} />
      </div>
      <div className="overflow-x-auto px-4 py-4">
        <SyntaxHighlighter language={activeTab.language} style={codeTheme} wrapLongLines={false}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function DocsJsonCode({ code }: { code: string }) {
  const codeTheme = useDocsCodeTheme();

  return (
    <div className="overflow-hidden rounded-[16px] border border-[var(--docs-border)] bg-[var(--docs-code)]">
      <div className="overflow-x-auto px-4 py-4">
        <SyntaxHighlighter language="json" style={codeTheme} wrapLongLines={false}>
          {prettyPrintJson(code)}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function statusTabClass(example: DocsResponseExample, isActive: boolean) {
  if (!isActive) {
    return "text-[var(--docs-soft)] hover:text-[var(--docs-text)]";
  }

  if (example.kind === "success") {
    return "font-semibold text-[#347659]";
  }

  if (example.status === 500) {
    return "font-semibold text-[#A11B1B]";
  }

  return "font-semibold text-[#C47B17]";
}

export function DocsStatusCode({ examples }: { examples: DocsResponseExample[] }) {
  const [activeStatus, setActiveStatus] = useState(examples[0]?.status);
  const codeTheme = useDocsCodeTheme();
  const active = examples.find((example) => example.status === activeStatus) ?? examples[0];

  if (!active) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-[16px] border border-[var(--docs-border)] bg-[var(--docs-code)]">
      <div className="flex h-12 items-center justify-between gap-3 bg-[var(--docs-code-bar)] px-4">
        <div className="flex min-w-0 items-center gap-3 overflow-x-auto">
          {examples.map((example) => {
            const isActive = example.status === active.status;

            return (
              <button
                key={example.status}
                type="button"
                onClick={() => setActiveStatus(example.status)}
                className={`h-12 shrink-0 font-mono text-[12px] ${statusTabClass(example, isActive)}`}
              >
                {example.status}
              </button>
            );
          })}
        </div>
        <CopyButton content={active.body} />
      </div>
      <div className="overflow-x-auto px-4 py-4">
        <SyntaxHighlighter language="json" style={codeTheme} wrapLongLines={false}>
          {prettyPrintJson(active.body)}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
