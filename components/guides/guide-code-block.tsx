"use client";

import { useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";

import type { GuideCodeSample } from "@/lib/guides/guides-content";

SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);

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

export function GuideCodeBlock({ samples }: { samples: GuideCodeSample[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = samples[activeIndex] ?? samples[0];

  if (!active) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-[16px] border border-[#E7EAEE] bg-[#F8F9FB]">
      <div className="flex items-center justify-between gap-3 border-b border-[#E7EAEE] px-3">
        <div className="flex min-w-0 items-center gap-4 overflow-x-auto">
          {samples.map((sample, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={sample.label}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-10 shrink-0 border-b-2 font-mono text-[12px] ${
                  isActive ? "border-[#E1251B] text-[#404040]" : "border-transparent text-[#8E8E8E] hover:text-[#404040]"
                }`}
              >
                {sample.label}
              </button>
            );
          })}
        </div>
        <CopyButton content={active.code} />
      </div>
      <div className="overflow-x-auto px-4 py-4">
        <SyntaxHighlighter language={active.language} style={daviviendaCodeTheme} wrapLongLines={false}>
          {active.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function GuideJsonBlock({ code }: { code: string }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-[#E7EAEE] bg-[#F8F9FB]">
      <div className="flex items-center justify-end border-b border-[#E7EAEE] px-3">
        <CopyButton content={code} />
      </div>
      <div className="overflow-x-auto px-4 py-4">
        <SyntaxHighlighter language="json" style={daviviendaCodeTheme} wrapLongLines={false}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function GuideMermaidBlock({ source }: { source: string }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-[#E7EAEE] bg-[#F8F9FB]">
      <div className="flex items-center justify-between border-b border-[#E7EAEE] px-3">
        <span className="h-10 font-mono text-[12px] leading-10 text-[#8E8E8E]">Mermaid</span>
        <CopyButton content={source} />
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-7 text-[#404040]">{source}</pre>
    </div>
  );
}
