"use client";

import { useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";

import { BreakablePath } from "@/components/ui/breakable-path";
import type { ApiEndpoint } from "../content/apis";

SyntaxHighlighter.registerLanguage("json", json);

const daviviendaJsonTheme = {
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
  property: { color: "#E1251B" },
  string: { color: "#347659" },
  number: { color: "#202A31" },
  boolean: { color: "#8A4B00" },
  null: { color: "#707070", fontStyle: "italic" },
  punctuation: { color: "#707070" },
};

function prettyJson(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

function JsonPreview({ value }: { value: string }) {
  return (
    <SyntaxHighlighter language="json" style={daviviendaJsonTheme} wrapLongLines={false}>
      {prettyJson(value)}
    </SyntaxHighlighter>
  );
}

function methodClasses(method: ApiEndpoint["method"]) {
  if (method === "POST") {
    return "bg-[#E1251B] text-white";
  }

  if (method === "PUT") {
    return "bg-[#FFF4E8] text-[#8A4B00]";
  }

  if (method === "DELETE") {
    return "bg-[#FFE9E9] text-[#A11B1B]";
  }

  return "bg-[#EFFCF5] text-[#347659]";
}

export function selectSummaryEndpoints(endpoints: ApiEndpoint[]) {
  return endpoints.slice(0, 1);
}

function keyParameters(endpoint: ApiEndpoint) {
  const candidates = endpoint.playground.parameters.filter((parameter) => parameter.name !== "Authorization");
  const required = candidates.filter((parameter) => parameter.required);
  return (required.length > 0 ? required : candidates).slice(0, 3);
}

function CompactEndpointCard({ endpoint }: { endpoint: ApiEndpoint }) {
  const [executed, setExecuted] = useState(false);
  const parameters = keyParameters(endpoint);

  return (
    <article className="overflow-hidden rounded-[22px] border border-[#707070] bg-white">
      <div className="flex flex-wrap items-center gap-3 border-b border-[#707070]/30 px-5 py-4">
        <span
          className={`inline-flex min-w-16 items-center justify-center rounded-full px-3 py-1 text-[12px] font-bold ${methodClasses(endpoint.method)}`}
        >
          {endpoint.method}
        </span>
        <code className="min-w-0 text-[18px] font-medium text-[#404040] sm:text-[20px]">
          <BreakablePath value={endpoint.path} />
        </code>
      </div>

      <div className="border-b border-[#707070]/30 bg-white px-5 py-4">
        <p className="text-[15px] leading-6 text-[#707070]">{endpoint.description}</p>
        {parameters.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {parameters.map((parameter) => (
              <li
                key={`${parameter.location}-${parameter.name}`}
                className="rounded-full bg-[#F2F3F5] px-3 py-1 text-[12px] text-[#404040]"
              >
                <span className="font-semibold">{parameter.name}</span>
                <span className="text-[#707070]"> · {parameter.location}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="grid lg:grid-cols-2 lg:items-stretch">
        <div className="flex min-h-0 flex-col border-b border-[#707070]/30 lg:border-r lg:border-b-0">
          <div className="flex h-12 shrink-0 items-center justify-between gap-3 bg-[#F2F3F5] px-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#707070]">Request</p>
            <button
              type="button"
              onClick={() => setExecuted(true)}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-[#E1251B] px-4 text-[13px] font-semibold text-white transition-colors duration-300 hover:bg-[#C01F16]"
            >
              EXECUTE
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto bg-white px-5 py-4">
            <JsonPreview value={endpoint.playground.requestBody} />
          </div>
        </div>

        <div className="flex min-h-0 flex-col">
          <div className="flex h-12 shrink-0 items-center bg-[#F2F3F5] px-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#707070]">
              {executed ? endpoint.playground.responseStatus : "Response"}
            </p>
          </div>
          {executed ? (
            <div className="min-h-0 flex-1 overflow-auto bg-white px-5 py-4">
              <JsonPreview value={endpoint.playground.responseBody} />
            </div>
          ) : (
            <p className="flex flex-1 items-start bg-white px-5 py-4 text-[14px] leading-6 text-[#707070]">
              Ejecute para ver la respuesta de ejemplo.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function CompactEndpointPlayground({ endpoints }: { endpoints: ApiEndpoint[] }) {
  const featured = selectSummaryEndpoints(endpoints);

  return (
    <div className="grid gap-4">
      {featured.map((endpoint) => (
        <CompactEndpointCard key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} />
      ))}
    </div>
  );
}
