"use client";

import { useState } from "react";

import type { ApiDetail, ApiEndpoint, ApiError } from "../content/apis";

type TabId = "overview" | "endpoints" | "request" | "response" | "errors";

type TechnicalTabsProps = {
  authentication: ApiDetail["authentication"];
  requirements: string[];
  endpoints: ApiEndpoint[];
  sampleRequest: string;
  sampleResponse: string;
  errors: ApiError[];
};

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
      className="inline-flex h-9 items-center justify-center rounded-full border border-white/14 px-4 text-[13px] font-medium text-white transition-all duration-300 hover:bg-white/8"
    >
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

function CodePanel({ title, code }: { title: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#141F25] bg-[#141F25]">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
        <div className="text-[13px] font-medium uppercase tracking-[0.24em] text-white/72">{title}</div>
        <CopyButton content={code} />
      </div>
      <pre className="overflow-x-auto px-6 py-6 text-[14px] leading-7 text-white">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: ApiEndpoint }) {
  return (
    <div className="rounded-[20px] border border-[#D8DCE1] bg-[#FCFCFD] px-6 py-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(20,31,37,0.08)]">
      <div className="flex flex-wrap items-center gap-4">
        <span
          className={`inline-flex min-w-[78px] items-center justify-center rounded-full px-4 py-2 text-[13px] font-bold tracking-[0.26px] ${methodClasses(endpoint.method)}`}
        >
          {endpoint.method}
        </span>
        <code className="text-[16px] font-medium tracking-[0.16px] text-[#0D0D0D]">{endpoint.path}</code>
      </div>
      <p className="mt-4 text-[16px] leading-7 tracking-[0.32px] text-[#707070]">{endpoint.description}</p>
    </div>
  );
}

function ErrorCard({ error }: { error: ApiError }) {
  return (
    <div className="rounded-[20px] border border-[#D8DCE1] bg-white px-6 py-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-[#F2F3F5] px-3 text-[14px] font-bold text-[#404040]">
          {error.code}
        </span>
        <h3 className="text-[18px] font-medium tracking-[0.36px] text-[#404040]">{error.title}</h3>
      </div>
      <p className="mt-4 text-[16px] leading-7 tracking-[0.32px] text-[#707070]">{error.description}</p>
    </div>
  );
}

export function TechnicalTabs({
  authentication,
  requirements,
  endpoints,
  sampleRequest,
  sampleResponse,
  errors,
}: TechnicalTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "endpoints", label: "Endpoints" },
    { id: "request", label: "Request" },
    { id: "response", label: "Response" },
    { id: "errors", label: "Errores" },
  ];

  return (
    <div className="rounded-[28px] bg-white px-8 py-8 shadow-[0_18px_50px_rgba(20,31,37,0.06)]">
      <div className="rounded-[22px] bg-[#F6F7F9] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-[#8E8E8E]">Centro técnico</p>
            <p className="mt-2 text-[16px] leading-7 tracking-[0.32px] text-[#707070]">
              Revise la integración, explore endpoints y copie ejemplos de consumo para acelerar su implementación.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[#404040]">
            Ejemplos listos para copiar
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex h-11 items-center justify-center rounded-full px-5 text-[14px] font-medium transition-all duration-300 ease-out ${
                isActive
                  ? "bg-[#141F25] text-white shadow-[0_12px_28px_rgba(20,31,37,0.16)]"
                  : "bg-[#F2F3F5] text-[#404040] hover:-translate-y-0.5 hover:bg-[#E9ECEF]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {activeTab === "overview" ? (
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[20px] bg-[#FCFCFD] p-5">
              <h3 className="text-[22px] font-bold tracking-[0.44px] text-[#404040]">Autenticación y seguridad</h3>
              <p className="mt-4 text-[16px] leading-7 tracking-[0.32px] text-[#707070]">{authentication.description}</p>

              <h4 className="mt-8 text-[18px] font-medium tracking-[0.36px] text-[#404040]">Cabeceras clave</h4>
              <ul className="mt-4 space-y-3">
                {authentication.headers.map((header) => (
                  <li key={header} className="rounded-[16px] bg-[#F2F3F5] px-4 py-3 font-mono text-[14px] text-[#404040]">
                    {header}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[20px] bg-[#FCFCFD] p-5">
              <h3 className="text-[22px] font-bold tracking-[0.44px] text-[#404040]">Antes de integrar</h3>
              <ul className="mt-4 space-y-4">
                {requirements.map((item) => (
                  <li key={item} className="flex gap-3 text-[16px] leading-7 tracking-[0.32px] text-[#404040]">
                    <span className="mt-[11px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#E1251B]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {activeTab === "endpoints" ? (
          <div className="space-y-4">
            {endpoints.map((endpoint) => (
              <EndpointCard key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} />
            ))}
          </div>
        ) : null}

        {activeTab === "request" ? <CodePanel title="Request de ejemplo" code={sampleRequest} /> : null}

        {activeTab === "response" ? <CodePanel title="Response de ejemplo" code={sampleResponse} /> : null}

        {activeTab === "errors" ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {errors.map((error) => (
              <ErrorCard key={error.code} error={error} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
