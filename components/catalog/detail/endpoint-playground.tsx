"use client";

import { useEffect, useState } from "react";

import type { ApiEndpoint } from "../content/apis";

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

export function EndpointPlayground({ endpoints }: { endpoints: ApiEndpoint[] }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(endpoints[0]);
  const [requestBody, setRequestBody] = useState(endpoints[0]?.playground.requestBody ?? "");
  const [credentialValue, setCredentialValue] = useState("ApiKeyAuth");
  const [executed, setExecuted] = useState(false);

  useEffect(() => {
    setRequestBody(selectedEndpoint.playground.requestBody);
    setExecuted(false);
  }, [selectedEndpoint]);

  return (
    <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="rounded-[24px] border border-[#E3E7EC] bg-[linear-gradient(180deg,#FBFCFD_0%,#F6F8FA_100%)] p-4">
        <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Endpoints</p>
        <p className="mt-2 text-[14px] leading-6 text-[#6A7178]">Seleccione un endpoint para abrir su consola visual de prueba.</p>

        <div className="mt-4 space-y-3">
          {endpoints.map((endpoint) => {
            const isActive = endpoint.path === selectedEndpoint.path && endpoint.method === selectedEndpoint.method;

            return (
              <button
                key={`${endpoint.method}-${endpoint.path}`}
                type="button"
                onClick={() => setSelectedEndpoint(endpoint)}
                className={`w-full rounded-[20px] border px-4 py-4 text-left transition-all duration-300 ${
                  isActive
                    ? "border-[#202A31] bg-white shadow-[0_14px_28px_rgba(20,31,37,0.08)]"
                    : "border-[#E3E7EC] bg-white/72 hover:border-[#CBD2D9] hover:bg-white"
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex min-w-[68px] items-center justify-center rounded-full px-3 py-1.5 text-[12px] font-bold ${methodClasses(endpoint.method)}`}
                  >
                    {endpoint.method}
                  </span>
                  <span className="text-[14px] font-medium text-[#30383F]">{endpoint.path}</span>
                </div>
                <p className="mt-3 text-[13px] leading-6 text-[#6A7178]">{endpoint.description}</p>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="space-y-5">
        <div className="rounded-[24px] border border-[#E3E7EC] bg-[linear-gradient(180deg,#FBFCFD_0%,#F6F8FA_100%)] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex min-w-[76px] items-center justify-center rounded-full px-4 py-2 text-[13px] font-bold ${methodClasses(selectedEndpoint.method)}`}
                >
                  {selectedEndpoint.method}
                </span>
                <code className="text-[18px] font-medium text-[#202A31]">{selectedEndpoint.path}</code>
              </div>
              <p className="mt-4 text-[16px] leading-7 text-[#6A7178]">{selectedEndpoint.description}</p>
            </div>

            <div className="rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[#404040] shadow-[0_8px_20px_rgba(20,31,37,0.04)]">
              Playground visual
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[24px] border border-[#E3E7EC] bg-white p-5 shadow-[0_16px_38px_rgba(20,31,37,0.05)]">
            <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Request</p>

            <div className="mt-4 rounded-[18px] bg-[#F6F8FA] px-4 py-4">
              <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#8E8E8E]">HTTP URL</p>
              <code className="mt-2 block break-all text-[13px] leading-6 text-[#30383F]">
                {selectedEndpoint.playground.httpUrl}
              </code>
            </div>

            <div className="mt-4">
              <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Parametros</p>
              <div className="mt-3 space-y-3">
                {selectedEndpoint.playground.parameters.map((parameter) => (
                  <div key={`${parameter.location}-${parameter.name}`} className="rounded-[18px] border border-[#E7EAEE] bg-[#FCFCFD] px-4 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-semibold text-[#202A31]">{parameter.name}</span>
                      <span className="rounded-full bg-[#F2F3F5] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#6A7178]">
                        {parameter.location}
                      </span>
                      <span className="rounded-full bg-[#F2F3F5] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#6A7178]">
                        {parameter.type}
                      </span>
                      {parameter.required ? (
                        <span className="rounded-full bg-[#FFEAEA] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#A11B1B]">
                          Required
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-[13px] leading-6 text-[#6A7178]">{parameter.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Request body</p>
                <span className="rounded-full bg-[#F2F3F5] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#6A7178]">
                  {selectedEndpoint.playground.contentType}
                </span>
              </div>
              <textarea
                value={requestBody}
                onChange={(event) => setRequestBody(event.target.value)}
                className="mt-3 min-h-[220px] w-full rounded-[20px] border border-[#E3E7EC] bg-[#FCFCFD] px-4 py-4 font-mono text-[13px] leading-6 text-[#30383F] outline-none transition-colors duration-300 focus:border-[#CBD2D9]"
              />
            </div>
          </div>

          <div className="rounded-[24px] border border-[#E3E7EC] bg-white p-5 shadow-[0_16px_38px_rgba(20,31,37,0.05)]">
            <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Response</p>

            <div className="mt-4 rounded-[18px] bg-[#F6F8FA] px-4 py-4">
              <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#8E8E8E]">Credenciales</p>
              <input
                value={credentialValue}
                onChange={(event) => setCredentialValue(event.target.value)}
                className="mt-3 h-11 w-full rounded-[14px] border border-[#E3E7EC] bg-white px-4 text-[14px] text-[#30383F] outline-none transition-colors duration-300 focus:border-[#CBD2D9]"
              />
              <p className="mt-2 text-[13px] leading-6 text-[#6A7178]">
                Referencia visual para {selectedEndpoint.playground.credentialsLabel}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setExecuted(true)}
              className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-5 text-[13px] font-semibold text-white transition-colors duration-300 hover:bg-[#E1111C]"
            >
              Execute
            </button>

            <div className="mt-4 overflow-hidden rounded-[20px] border border-[#E3E7EC]">
              <div
                className={`px-4 py-3 text-[13px] font-semibold ${
                  executed ? "bg-[#FFE9E9] text-[#A11B1B]" : "bg-[#F2F3F5] text-[#6A7178]"
                }`}
              >
                {executed ? selectedEndpoint.playground.responseStatus : "Simulacion lista para ejecutarse"}
              </div>
              <pre className="overflow-x-auto bg-[#141F25] px-4 py-4 text-[13px] leading-6 text-white">
                <code>{executed ? selectedEndpoint.playground.responseBody : requestBody}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
