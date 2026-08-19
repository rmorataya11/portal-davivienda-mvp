"use client";

import { useState } from "react";

import type { ApiDetail, ApiEndpoint, ApiError } from "../content/apis";
import { EndpointPlayground } from "./endpoint-playground";

type TabId = "overview" | "endpoints" | "request" | "response" | "errors" | "credentials";

type TechnicalTabsProps = {
  authentication: ApiDetail["authentication"];
  requirements: string[];
  endpoints: ApiEndpoint[];
  sampleRequest: string;
  sampleResponse: string;
  errors: ApiError[];
  slug?: string;
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
      className={`inline-flex h-9 items-center justify-center rounded-full border px-4 text-[13px] font-medium transition-all duration-300 ${
        tone === "light"
          ? "border-[#D5DAE0] text-[#404040] hover:bg-[#F3F5F7]"
          : "border-white/14 text-white hover:bg-white/8"
      }`}
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

function CredentialRow({
  label,
  value,
  secret,
}: {
  label: string;
  value: string;
  secret?: boolean;
}) {
  const [visible, setVisible] = useState(!secret);

  return (
    <div className="rounded-[18px] border border-[#E3E7EC] bg-white px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">{label}</p>
        <div className="flex items-center gap-2">
          {secret ? (
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              className="text-[13px] font-medium text-[#6A7178] transition-colors hover:text-[#E1251B]"
            >
              {visible ? "Ocultar" : "Mostrar"}
            </button>
          ) : null}
          <CopyButton content={value} tone="light" />
        </div>
      </div>
      <p className="mt-3 break-all font-mono text-[14px] leading-7 text-[#141F25]">
        {visible ? value : "•".repeat(Math.min(value.length, 28))}
      </p>
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
  slug,
}: TechnicalTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const sandboxKey = slug ? slug.replace(/-/g, "").slice(0, 8) : "tesoreria";

  const mockCredentials = {
    environment: "Sandbox",
    clientId: `davi_sandbox_${sandboxKey}_8f2a1c94`,
    clientSecret: `sk_sandbox_${sandboxKey}_9c4e7b21d6a0`,
    apiKey: `ak_sandbox_${sandboxKey.toUpperCase()}_Q8M2L1`,
    baseUrl: "https://sandbox.api.davivienda.com",
  };

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "endpoints", label: "Endpoints" },
    { id: "request", label: "Request" },
    { id: "response", label: "Response" },
    { id: "errors", label: "Errores" },
    { id: "credentials", label: "Credenciales" },
  ];

  return (
    <div className="rounded-[28px] bg-white px-6 py-6 shadow-[0_18px_50px_rgba(20,31,37,0.06)] sm:px-8 sm:py-8">
      <div className="flex flex-wrap gap-2">
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

        {activeTab === "credentials" ? (
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#EFFCF5] px-4 py-2 text-[13px] font-medium text-[#347659]">
                  <span className="h-2 w-2 rounded-full bg-[#55B685]" />
                  {mockCredentials.environment}
                </span>
                <p className="text-[14px] text-[#6A7178]">Mock de credenciales para pruebas. No usar en producción.</p>
              </div>
              <CredentialRow label="Client ID" value={mockCredentials.clientId} />
              <CredentialRow label="Client secret" value={mockCredentials.clientSecret} secret />
              <CredentialRow label="API key" value={mockCredentials.apiKey} secret />
              <CredentialRow label="Base URL" value={mockCredentials.baseUrl} />
            </div>

            <div className="rounded-[22px] bg-[linear-gradient(180deg,#FCFCFD_0%,#F6F8FA_100%)] p-6">
              <h3 className="text-[22px] font-bold tracking-[0.24px] text-[#30383F]">Cómo usarlas</h3>
              <ul className="mt-4 space-y-4 text-[16px] leading-7 tracking-[0.24px] text-[#3C444B]">
                <li className="flex gap-3">
                  <span className="mt-[11px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#E1251B]" />
                  Envíe el Client ID y el secret para obtener el Bearer token.
                </li>
                <li className="flex gap-3">
                  <span className="mt-[11px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#E1251B]" />
                  Incluya la API key en la cabecera x-api-key de cada request.
                </li>
                <li className="flex gap-3">
                  <span className="mt-[11px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#E1251B]" />
                  Estas claves solo aplican a sandbox. Para producción, solicite contratación.
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
