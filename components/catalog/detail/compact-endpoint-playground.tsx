"use client";

import { useState } from "react";

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

const featuredPaths = ["/treasury/v1/balances", "/treasury/v1/movements"];

export function selectSummaryEndpoints(endpoints: ApiEndpoint[]) {
  const preferred = featuredPaths
    .map((path) => endpoints.find((endpoint) => endpoint.path === path))
    .filter((endpoint): endpoint is ApiEndpoint => Boolean(endpoint));

  if (preferred.length >= 2) {
    return preferred.slice(0, 3);
  }

  return endpoints.slice(0, 3);
}

function keyParameters(endpoint: ApiEndpoint) {
  const candidates = endpoint.playground.parameters.filter((parameter) => parameter.name !== "Authorization");
  const required = candidates.filter((parameter) => parameter.required);
  return (required.length > 0 ? required : candidates).slice(0, 2);
}

function CompactEndpointCard({ endpoint }: { endpoint: ApiEndpoint }) {
  const [executed, setExecuted] = useState(false);
  const parameters = keyParameters(endpoint);

  return (
    <article className="rounded-[22px] border border-[#E7EAEE] bg-white p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`inline-flex min-w-[64px] items-center justify-center rounded-full px-3 py-1 text-[12px] font-bold ${methodClasses(endpoint.method)}`}>
          {endpoint.method}
        </span>
        <code className="min-w-0 break-all text-[16px] font-medium text-[#202A31]">{endpoint.path}</code>
      </div>
      <p className="mt-3 text-[15px] leading-6 text-[#6A7178]">{endpoint.description}</p>

      {parameters.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {parameters.map((parameter) => (
            <li
              key={`${parameter.location}-${parameter.name}`}
              className="rounded-full bg-[#F3F5F7] px-3 py-1 text-[12px] text-[#404040]"
            >
              <span className="font-semibold">{parameter.name}</span>
              <span className="text-[#8E8E8E]"> · {parameter.location}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <pre className="mt-4 max-h-32 overflow-auto rounded-[14px] bg-[#141F25] px-4 py-3 font-mono text-[12px] leading-5 text-white">
        <code>{endpoint.playground.requestBody}</code>
      </pre>

      <button
        type="button"
        onClick={() => setExecuted(true)}
        className="mt-4 inline-flex h-10 items-center justify-center rounded-[8px] bg-[#FF3B30] px-5 text-[13px] font-semibold text-white transition-colors duration-300 hover:bg-[#E1251B]"
      >
        EXECUTE
      </button>

      {executed ? (
        <div className="mt-4 overflow-hidden rounded-[14px] border border-[#E3E7EC]">
          <div className="bg-[#FF4545] px-4 py-2 text-[12px] font-semibold text-white">{endpoint.playground.responseStatus}</div>
          <pre className="max-h-40 overflow-auto bg-[#141F25] px-4 py-3 font-mono text-[12px] leading-5 text-white">
            <code>{endpoint.playground.responseBody}</code>
          </pre>
        </div>
      ) : null}
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
