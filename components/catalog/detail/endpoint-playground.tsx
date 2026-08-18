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
    <div className="overflow-hidden rounded-[24px] border border-[#E3E7EC] bg-white shadow-[0_18px_44px_rgba(20,31,37,0.05)]">
      <div className="grid xl:grid-cols-[220px_minmax(0,1fr)_340px]">
        <aside className="border-b border-[#E7EAEE] bg-[#FAFBFC] xl:border-b-0 xl:border-r">
          <div className="px-4 py-4">
            <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#6A7178]">Paths</p>
            <div className="mt-3 space-y-2">
              {endpoints.map((endpoint) => {
                const isActive = endpoint.path === selectedEndpoint.path && endpoint.method === selectedEndpoint.method;

                return (
                  <button
                    key={`${endpoint.method}-${endpoint.path}`}
                    type="button"
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className={`flex w-full items-center gap-2 rounded-[14px] px-3 py-2 text-left text-[13px] transition-colors duration-300 ${
                      isActive ? "bg-[#FF4545] text-white" : "bg-transparent text-[#30383F] hover:bg-[#F1F4F7]"
                    }`}
                  >
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${methodClasses(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <span className="truncate">{endpoint.path}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="border-b border-[#E7EAEE] bg-white xl:border-b-0 xl:border-r">
          <div className="border-b border-[#EEF1F4] px-6 py-6">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex min-w-[76px] items-center justify-center rounded-full px-4 py-2 text-[13px] font-bold ${methodClasses(selectedEndpoint.method)}`}
              >
                {selectedEndpoint.method}
              </span>
              <code className="text-[28px] font-medium tracking-[0.1px] text-[#202A31]">{selectedEndpoint.path}</code>
            </div>
          </div>

          <div className="px-6 py-6">
            <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">HTTP URL</p>
            <code className="mt-3 block rounded-[14px] bg-[#F7F8FA] px-4 py-3 text-[13px] leading-6 text-[#30383F]">
              {selectedEndpoint.playground.httpUrl}
            </code>

            <div className="mt-6">
              <p className="text-[20px] font-medium text-[#202A31]">Descripción</p>
              <p className="mt-3 text-[15px] leading-7 text-[#6A7178]">{selectedEndpoint.description}</p>
            </div>

            <div className="mt-6">
              <p className="text-[20px] font-medium text-[#202A31]">Parámetros</p>
              <div className="mt-3 overflow-hidden rounded-[18px] border border-[#E7EAEE]">
                {selectedEndpoint.playground.parameters.map((parameter, index) => (
                  <div
                    key={`${parameter.location}-${parameter.name}`}
                    className={`grid gap-2 px-4 py-4 md:grid-cols-[1.1fr_0.7fr_1.8fr] ${index !== 0 ? "border-t border-[#EEF1F4]" : ""}`}
                  >
                    <div>
                      <p className="text-[14px] font-semibold text-[#202A31]">{parameter.name}</p>
                      <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-[#8E8E8E]">{parameter.location}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#F2F3F5] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#6A7178]">
                        {parameter.type}
                      </span>
                      {parameter.required ? (
                        <span className="rounded-full bg-[#FFEAEA] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#A11B1B]">
                          Required
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[13px] leading-6 text-[#6A7178]">{parameter.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F7F7F8] px-5 py-6">
          <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Request body</p>
          <div className="mt-3 rounded-[14px] border border-[#E3E7EC] bg-white px-4 py-3 text-[13px] text-[#6A7178]">
            {selectedEndpoint.playground.contentType}
          </div>
          <textarea
            value={requestBody}
            onChange={(event) => setRequestBody(event.target.value)}
            className="mt-3 min-h-[210px] w-full rounded-[16px] border border-[#E3E7EC] bg-white px-4 py-4 font-mono text-[13px] leading-6 text-[#30383F] outline-none transition-colors duration-300 focus:border-[#CBD2D9]"
          />

          <div className="mt-5">
            <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Credentials</p>
            <input
              value={credentialValue}
              onChange={(event) => setCredentialValue(event.target.value)}
              className="mt-3 h-11 w-full rounded-[14px] border border-[#E3E7EC] bg-white px-4 text-[14px] text-[#30383F] outline-none transition-colors duration-300 focus:border-[#CBD2D9]"
            />
            <p className="mt-2 text-[12px] leading-6 text-[#6A7178]">Referencia visual para {selectedEndpoint.playground.credentialsLabel}.</p>
          </div>

          <button
            type="button"
            onClick={() => setExecuted(true)}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-[8px] bg-[#FF3B30] px-5 text-[13px] font-semibold text-white transition-colors duration-300 hover:bg-[#E1251B]"
          >
            EXECUTE
          </button>

          <div className="mt-5 overflow-hidden rounded-[16px] border border-[#E3E7EC]">
            <div className={`px-4 py-3 text-[13px] font-semibold ${executed ? "bg-[#FF4545] text-white" : "bg-[#ECEFF2] text-[#6A7178]"}`}>
              {executed ? selectedEndpoint.playground.responseStatus : "Listo para ejecutar"}
            </div>
            <pre className="overflow-x-auto bg-[#141F25] px-4 py-4 text-[13px] leading-6 text-white">
              <code>{executed ? selectedEndpoint.playground.responseBody : requestBody}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
