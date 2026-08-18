"use client";

import { useState } from "react";

import type { ApiDetail, ApiEndpoint, ApiError } from "../content/apis";
import { EndpointPlayground } from "./endpoint-playground";

type TabId = "overview" | "endpoints" | "request" | "response" | "errors";

type TechnicalTabsProps = {
  authentication: ApiDetail["authentication"];
  requirements: string[];
  endpoints: ApiEndpoint[];
  sampleRequest: string;
  sampleResponse: string;
  errors: ApiError[];
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
      className="inline-flex h-9 items-center justify-center rounded-full border border-white/14 px-4 text-[13px] font-medium text-white transition-all duration-300 hover:bg-white/8"
    >
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

function CodePanel({ title, code }: { title: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#141F25] bg-[linear-gradient(180deg,#141F25_0%,#1D2930_100%)] shadow-[0_20px_46px_rgba(20,31,37,0.18)]">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
        <div className="text-[12px] font-medium uppercase tracking-[0.24em] text-white/68">{title}</div>
        <CopyButton content={code} />
      </div>
      <pre className="overflow-x-auto px-6 py-6 text-[14px] leading-7 text-white">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ErrorCard({ error }: { error: ApiError }) {
  return (
    <div className="rounded-[22px] border border-[#E3E7EC] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FB_100%)] px-6 py-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-[#F2F3F5] px-3 text-[14px] font-bold text-[#404040]">
          {error.code}
        </span>
        <h3 className="text-[18px] font-medium tracking-[0.24px] text-[#30383F]">{error.title}</h3>
      </div>
      <p className="mt-4 text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">{error.description}</p>
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
    <div className="rounded-[28px] bg-white px-6 py-6 shadow-[0_18px_50px_rgba(20,31,37,0.06)] sm:px-8 sm:py-8">
      <div className="rounded-[24px] bg-[linear-gradient(180deg,#F8F9FB_0%,#F3F5F7_100%)] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Centro técnico</p>
            <p className="mt-2 text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">
              Revise la integración, explore endpoints y copie ejemplos de consumo para acelerar su implementación.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[#30383F] shadow-[0_8px_20px_rgba(20,31,37,0.04)]">
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
                  ? "bg-[#202A31] text-white shadow-[0_12px_28px_rgba(20,31,37,0.14)]"
                  : "bg-[#F3F5F7] text-[#5F676E] hover:-translate-y-0.5 hover:bg-[#EAEDF0] hover:text-[#30383F]"
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
            <div className="rounded-[22px] bg-[linear-gradient(180deg,#FCFCFD_0%,#F6F8FA_100%)] p-6">
              <h3 className="text-[22px] font-bold tracking-[0.24px] text-[#30383F]">Autenticación y seguridad</h3>
              <p className="mt-4 text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">{authentication.description}</p>

              <h4 className="mt-8 text-[18px] font-medium tracking-[0.24px] text-[#30383F]">Cabeceras clave</h4>
              <ul className="mt-4 space-y-3">
                {authentication.headers.map((header) => (
                  <li
                    key={header}
                    className="rounded-[16px] border border-[#E3E7EC] bg-white px-4 py-3 font-mono text-[14px] text-[#404040]"
                  >
                    {header}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[22px] bg-[linear-gradient(180deg,#FCFCFD_0%,#F6F8FA_100%)] p-6">
              <h3 className="text-[22px] font-bold tracking-[0.24px] text-[#30383F]">Antes de integrar</h3>
              <ul className="mt-4 space-y-4">
                {requirements.map((item) => (
                  <li key={item} className="flex gap-3 text-[16px] leading-7 tracking-[0.24px] text-[#3C444B]">
                    <span className="mt-[11px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#E1251B]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {activeTab === "endpoints" ? (
          <EndpointPlayground endpoints={endpoints} />
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
