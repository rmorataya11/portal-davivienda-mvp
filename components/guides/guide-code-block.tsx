"use client";

import { useState, type ReactNode } from "react";
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

function SampleBar({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex h-12 items-center justify-between gap-3 bg-[#F2F3F5] px-4">
      <div className="flex min-w-0 items-baseline gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#707070]">{title}</p>
        {meta ? <span className="font-mono text-[12px] text-[#347659]">{meta}</span> : null}
      </div>
      <div className="flex min-w-0 items-center gap-3">{children}</div>
    </div>
  );
}

export function GuideCodeBlock({ samples, title = "Request" }: { samples: GuideCodeSample[]; title?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = samples[activeIndex] ?? samples[0];

  if (!active) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-[16px] border border-[#E7EAEE] bg-[#F8F9FB]">
      <SampleBar title={title}>
        <div className="flex min-w-0 items-center gap-3 overflow-x-auto">
          {samples.map((sample, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={sample.label}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-12 shrink-0 font-mono text-[12px] ${
                  isActive ? "font-semibold text-[#404040]" : "text-[#8E8E8E] hover:text-[#404040]"
                }`}
              >
                {sample.label}
              </button>
            );
          })}
        </div>
        <CopyButton content={active.code} />
      </SampleBar>
      <div className="overflow-x-auto px-4 py-4">
        <SyntaxHighlighter language={active.language} style={daviviendaCodeTheme} wrapLongLines={false}>
          {active.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function GuideJsonBlock({
  code,
  title = "Response",
  meta,
}: {
  code: string;
  title?: string;
  meta?: string;
}) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-[#E7EAEE] bg-[#F8F9FB]">
      <SampleBar title={title} meta={meta}>
        <CopyButton content={code} />
      </SampleBar>
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
      <SampleBar title="Flujo">
        <CopyButton content={source} />
      </SampleBar>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-7 text-[#404040]">{source}</pre>
    </div>
  );
}
