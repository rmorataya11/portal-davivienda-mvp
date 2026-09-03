"use client";

import { useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";

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
  { id: "curl", label: "cURL", language: "bash" },
  { id: "javascript", label: "JavaScript", language: "javascript" },
  { id: "python", label: "Python", language: "python" },
] as const;

type ExampleLanguage = (typeof languageTabs)[number]["id"];

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
  examples: { curl: string; javascript: string; python: string };
}) {
  const [language, setLanguage] = useState<ExampleLanguage>("curl");
  const activeTab = languageTabs.find((tab) => tab.id === language) ?? languageTabs[0];
  const code = examples[activeTab.id];

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
