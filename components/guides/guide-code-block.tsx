"use client";

import { useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";

import type { GuideCodeSample } from "@/lib/guides/guides-content";

SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);

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

function CopyButton({ content, tone = "dark" }: { content: string; tone?: "dark" | "light" }) {
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
      className={`h-8 px-2 font-mono text-[11px] transition-colors ${
        tone === "light" ? "text-[#8E8E8E] hover:text-[#141F25]" : "text-white/55 hover:text-white"
      }`}
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
    <div className="overflow-hidden bg-[#141F25]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3">
        <div className="flex min-w-0 items-center gap-4 overflow-x-auto">
          {samples.map((sample, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={sample.label}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-10 shrink-0 border-b-2 font-mono text-[12px] ${
                  isActive ? "border-white text-white" : "border-transparent text-white/45 hover:text-white/80"
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
        <SyntaxHighlighter language={active.language} style={editorTheme} wrapLongLines={false}>
          {active.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function GuideJsonBlock({ code }: { code: string }) {
  return (
    <div className="overflow-hidden bg-[#141F25]">
      <div className="flex items-center justify-end border-b border-white/10 px-3">
        <CopyButton content={code} />
      </div>
      <div className="overflow-x-auto px-4 py-4">
        <SyntaxHighlighter language="json" style={editorTheme} wrapLongLines={false}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function GuideMermaidBlock({ source }: { source: string }) {
  return (
    <div className="overflow-hidden border border-[#D8DCE1] bg-[#F7F5F1]">
      <div className="flex items-center justify-between border-b border-[#D8DCE1] px-3">
        <span className="h-10 font-mono text-[12px] leading-10 text-[#8E8E8E]">Mermaid</span>
        <CopyButton content={source} tone="light" />
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-7 text-[#141F25]">{source}</pre>
    </div>
  );
}
