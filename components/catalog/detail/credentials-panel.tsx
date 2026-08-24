"use client";

import Link from "next/link";

import { ApiLinkedApps } from "./api-linked-apps";

export function CredentialsPanel({ slug, apiName }: { slug: string; apiName: string }) {
  const returnTo = `/catalogo-apis/${slug}/detalle-tecnico`;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#EFFCF5] px-4 py-2 text-[13px] font-medium text-[#347659]">
            <span className="h-2 w-2 rounded-full bg-[#55B685]" />
            Sandbox
          </span>
          <p className="text-[14px] text-[#6A7178]">Las apps de esta API y sus credenciales.</p>
        </div>
        <ApiLinkedApps slug={slug} apiName={apiName} returnTo={returnTo} showKeys />
      </div>

      <div className="rounded-[22px] bg-[linear-gradient(180deg,#FCFCFD_0%,#F6F8FA_100%)] p-6">
        <h3 className="text-[22px] font-bold tracking-[0.24px] text-[#30383F]">Cómo usarlas</h3>
        <ul className="mt-4 space-y-4 text-[16px] leading-7 tracking-[0.24px] text-[#3C444B]">
          <li className="flex gap-3">
            <span className="mt-[11px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#E1251B]" />
            Use el consumer key en la cabecera <span className="font-mono text-[14px]">x-api-key</span>.
          </li>
          <li className="flex gap-3">
            <span className="mt-[11px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#E1251B]" />
            Llame el proxy en la URL base de la aplicación.
          </li>
          <li className="flex gap-3">
            <span className="mt-[11px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#E1251B]" />
            Estas credenciales solo aplican a sandbox. Para producción, solicite contratación desde la app.
          </li>
        </ul>
        <Link href="/dashboard" className="mt-6 inline-flex text-[14px] font-medium text-[#E1251B]">
          Ir a Mis apps
        </Link>
      </div>
    </div>
  );
}
