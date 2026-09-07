"use client";

import { useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";

import type { DocsResponseExample } from "@/lib/mock/mockDocs";

SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("python", python);

const editorTheme = {
  ...vscDarkPlus,
  'pre[class*="language-"]': {
    ...vscDarkPlus['pre[class*="language-"]'],
    background: "#141F25",
    margin: 0,
    padding: 0,
    fontSize: "13px",
    lineHeight: "1.65",
    overflow: "visible",
  },
  'code[class*="language-"]': {
    ...vscDarkPlus['code[class*="language-"]'],
    background: "transparent",
    fontSize: "13px",
    lineHeight: "1.65",
    textShadow: "none",
  },
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
      className="inline-flex h-8 items-center justify-center rounded-full border border-white/14 px-3 text-[12px] font-medium text-white transition-all duration-300 hover:bg-white/8"
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
    <div className="overflow-hidden rounded-[18px] border border-[#141F25] bg-[linear-gradient(180deg,#141F25_0%,#1D2930_100%)] shadow-[0_20px_46px_rgba(20,31,37,0.18)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
          {languageTabs.map((tab) => {
            const isActive = tab.id === language;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setLanguage(tab.id)}
                className={`inline-flex h-8 shrink-0 items-center rounded-full px-3 text-[12px] font-medium transition-colors duration-300 ${
                  isActive ? "bg-white/12 text-white" : "text-white/62 hover:bg-white/8 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <CopyButton content={code} />
      </div>
      <div className="overflow-x-auto px-4 py-4 sm:px-5">
        <SyntaxHighlighter language={activeTab.language} style={editorTheme} wrapLongLines={false}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function DocsJsonCode({ code }: { code: string }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#141F25] bg-[linear-gradient(180deg,#141F25_0%,#1D2930_100%)]">
      <div className="overflow-x-auto px-4 py-4 sm:px-5">
        <SyntaxHighlighter language="json" style={editorTheme} wrapLongLines={false}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function statusTabClass(example: DocsResponseExample, isActive: boolean) {
  if (!isActive) {
    return "border-transparent text-white/55 hover:bg-white/8 hover:text-white/80";
  }

  if (example.kind === "success") {
    return "border-[#55B685] bg-[#55B685]/16 text-[#B7E4C7]";
  }

  if (example.status === 500) {
    return "border-[#E1251B] bg-[#E1251B]/16 text-[#FFB4B0]";
  }

  return "border-[#C47B17] bg-[#C47B17]/16 text-[#F3D4A0]";
}

export function DocsStatusCode({ examples }: { examples: DocsResponseExample[] }) {
  const [activeStatus, setActiveStatus] = useState(examples[0]?.status);
  const active = examples.find((example) => example.status === activeStatus) ?? examples[0];

  if (!active) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#141F25] bg-[linear-gradient(180deg,#141F25_0%,#1D2930_100%)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
          {examples.map((example) => {
            const isActive = example.status === active.status;

            return (
              <button
                key={example.status}
                type="button"
                onClick={() => setActiveStatus(example.status)}
                className={`inline-flex h-8 shrink-0 items-center rounded-full border px-3 font-mono text-[12px] font-medium transition-colors duration-300 ${statusTabClass(example, isActive)}`}
              >
                {example.status}
              </button>
            );
          })}
        </div>
        <CopyButton content={active.body} />
      </div>
      <div className="overflow-x-auto px-4 py-4 sm:px-5">
        <SyntaxHighlighter language="json" style={editorTheme} wrapLongLines={false}>
          {active.body}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
