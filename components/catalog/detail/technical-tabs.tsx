"use client";

import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";

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

type ProvisionedCredentials = {
  consumerKey: string;
  expiresAt: string;
  baseUrl: string;
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [credentials, setCredentials] = useState<ProvisionedCredentials | null>(null);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionError, setProvisionError] = useState("");

  async function handleProvisionCredentials() {
    if (!user?.email) {
      setProvisionError("No encontramos una sesión activa para provisionar credenciales.");
      return;
    }

    setIsProvisioning(true);
    setProvisionError("");

    try {
      const response = await fetch("/api/apigee/provision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
        }),
      });

      const payload = (await response.json()) as
        | {
            consumerKey?: string;
            expiresAt?: string;
            hostname?: string;
            basePath?: string;
            message?: string;
          }
        | undefined;

      if (!response.ok || !payload?.consumerKey || !payload.hostname || !payload.basePath || !payload.expiresAt) {
        throw new Error(payload?.message || "No fue posible obtener las credenciales de sandbox.");
      }

      setCredentials({
        consumerKey: payload.consumerKey,
        expiresAt: payload.expiresAt,
        baseUrl: `https://${payload.hostname}${payload.basePath}`,
      });
    } catch (error) {
      setProvisionError(error instanceof Error ? error.message : "No fue posible obtener las credenciales de sandbox.");
    } finally {
      setIsProvisioning(false);
    }
  }

  const formattedExpiry = formatExpiration(credentials?.expiresAt);

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
                  Sandbox
                </span>
                <p className="text-[14px] text-[#6A7178]">
                  Genere credenciales reales en Apigee para consumir el proxy publicado.
                </p>
              </div>
              <div className="rounded-[18px] border border-[#E3E7EC] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FB_100%)] px-5 py-5">
                <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Provisionar acceso</p>
                <p className="mt-3 text-[15px] leading-7 text-[#3C444B]">
                  {credentials
                    ? "Ya generó credenciales para esta sesión. Si necesita otra app de sandbox, puede volver a provisionar."
                    : "Haga clic para crear el developer app en Apigee y recibir el consumer key real de sandbox."}
                </p>
                <button
                  type="button"
                  onClick={handleProvisionCredentials}
                  disabled={isProvisioning}
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C] disabled:translate-y-0 disabled:bg-[#C9CED4]"
                >
                  {isProvisioning ? "Provisionando..." : credentials ? "Provisionar otra app" : "Obtener credenciales reales"}
                </button>
                {provisionError ? <p className="mt-3 text-[13px] text-[#E1251B]">{provisionError}</p> : null}
              </div>
              {credentials ? (
                <>
                  <CredentialRow label="Consumer key / API key" value={credentials.consumerKey} secret />
                  <CredentialRow label="Base URL" value={credentials.baseUrl} />
                  <CredentialRow label="Expira" value={formattedExpiry} />
                </>
              ) : (
                <div className="rounded-[18px] border border-dashed border-[#D5DAE0] bg-white px-5 py-5 text-[14px] leading-7 text-[#6A7178]">
                  Todavía no hay credenciales provisionadas para mostrar.
                </div>
              )}
            </div>

            <div className="rounded-[22px] bg-[linear-gradient(180deg,#FCFCFD_0%,#F6F8FA_100%)] p-6">
              <h3 className="text-[22px] font-bold tracking-[0.24px] text-[#30383F]">Cómo usarlas</h3>
              <ul className="mt-4 space-y-4 text-[16px] leading-7 tracking-[0.24px] text-[#3C444B]">
                <li className="flex gap-3">
                  <span className="mt-[11px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#E1251B]" />
                  Use el valor de <span className="font-mono text-[14px]">consumerKey</span> en la cabecera{" "}
                  <span className="font-mono text-[14px]">x-api-key</span>.
                </li>
                <li className="flex gap-3">
                  <span className="mt-[11px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#E1251B]" />
                  Llame el proxy directamente en la URL base entregada por el portal.
                </li>
                <li className="flex gap-3">
                  <span className="mt-[11px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#E1251B]" />
                  Estas credenciales solo aplican a sandbox. Para producción, solicite contratación.
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function formatExpiration(value: string | undefined) {
  if (!value) {
    return "No disponible";
  }

  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return value;
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(numeric));
}
