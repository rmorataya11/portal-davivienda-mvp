"use client";

import { useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";

import type { DocsResponseExample } from "@/lib/mock/mockDocs";

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

const languageTabs = [
  { id: "json", label: "JSON", language: "json" },
  { id: "curl", label: "cURL", language: "bash" },
  { id: "javascript", label: "JavaScript", language: "javascript" },
  { id: "python", label: "Python", language: "python" },
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
      className="h-8 px-2 font-mono text-[11px] text-[#8E8E8E] transition-colors hover:text-[#404040]"
    >
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

export function DocsRequestCode({
  examples,
}: {
  examples: { json: string; curl: string; javascript: string; python: string };
}) {
  const [language, setLanguage] = useState<ExampleLanguage>("json");
  const activeTab = languageTabs.find((tab) => tab.id === language) ?? languageTabs[0];
  const rawCode = examples[activeTab.id];
  const code = activeTab.language === "json" ? prettyPrintJson(rawCode) : rawCode;

  return (
    <div className="overflow-hidden rounded-[16px] border border-[#E7EAEE] bg-[#F8F9FB]">
      <div className="flex h-12 items-center justify-between gap-3 bg-[#F2F3F5] px-4">
        <div className="flex min-w-0 items-center gap-3 overflow-x-auto">
          {languageTabs.map((tab) => {
            const isActive = tab.id === language;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setLanguage(tab.id)}
                className={`h-12 shrink-0 font-mono text-[12px] ${
                  isActive ? "font-semibold text-[#404040]" : "text-[#8E8E8E] hover:text-[#404040]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <CopyButton content={code} />
      </div>
      <div className="overflow-x-auto px-4 py-4">
        <SyntaxHighlighter language={activeTab.language} style={daviviendaCodeTheme} wrapLongLines={false}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function DocsJsonCode({ code }: { code: string }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-[#E7EAEE] bg-[#F8F9FB]">
      <div className="overflow-x-auto px-4 py-4">
        <SyntaxHighlighter language="json" style={daviviendaCodeTheme} wrapLongLines={false}>
          {prettyPrintJson(code)}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function statusTabClass(example: DocsResponseExample, isActive: boolean) {
  if (!isActive) {
    return "text-[#8E8E8E] hover:text-[#404040]";
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
  const active = examples.find((example) => example.status === activeStatus) ?? examples[0];

  if (!active) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-[16px] border border-[#E7EAEE] bg-[#F8F9FB]">
      <div className="flex h-12 items-center justify-between gap-3 bg-[#F2F3F5] px-4">
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
        <SyntaxHighlighter language="json" style={daviviendaCodeTheme} wrapLongLines={false}>
          {prettyPrintJson(active.body)}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
