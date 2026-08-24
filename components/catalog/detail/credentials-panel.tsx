"use client";

import Link from "next/link";

import { AppStatusBadge } from "@/components/dashboard/app-status-badge";
import { useDeveloperApps } from "@/components/dashboard/apps-provider";
import { CredentialField } from "@/components/ui/credential-field";

export function CredentialsPanel({ slug, apiName }: { slug: string; apiName: string }) {
  const { apps, ready, linkProduct } = useDeveloperApps();

  if (!ready) {
    return <div className="h-40 animate-pulse rounded-[18px] bg-[#F2F3F5]" />;
  }

  const linkedApps = apps.filter((app) => app.productSlugs.includes(slug));
  const otherApps = apps.filter((app) => !app.productSlugs.includes(slug));
  const primary = linkedApps[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#EFFCF5] px-4 py-2 text-[13px] font-medium text-[#347659]">
            <span className="h-2 w-2 rounded-full bg-[#55B685]" />
            Sandbox
          </span>
          <p className="text-[14px] text-[#6A7178]">Las credenciales viven en sus aplicaciones, no en esta ficha.</p>
        </div>

        {primary ? (
          <>
            <div className="rounded-[18px] border border-[#E3E7EC] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FB_100%)] px-5 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Aplicación</p>
                  <p className="mt-2 text-[18px] font-semibold text-[#141F25]">{primary.name}</p>
                </div>
                <AppStatusBadge status={primary.status} />
              </div>
              <Link
                href={`/dashboard/apps/${primary.id}`}
                className="mt-4 inline-flex text-[14px] font-medium text-[#E1251B]"
              >
                Abrir en el dashboard
              </Link>
            </div>
            <CredentialField label="Consumer key / API key" value={primary.consumerKey} secret />
            <CredentialField label="Base URL" value={primary.baseUrl} />
            {linkedApps.length > 1 ? (
              <p className="text-[13px] text-[#6A7178]">
                Hay {linkedApps.length} apps con esta API. Vea todas en{" "}
                <Link href="/dashboard" className="font-medium text-[#E1251B]">
                  Mis aplicaciones
                </Link>
                .
              </p>
            ) : null}
          </>
        ) : (
          <div className="rounded-[18px] border border-dashed border-[#D5DAE0] bg-white px-5 py-5">
            <p className="text-[15px] leading-7 text-[#3C444B]">
              Todavía no hay una aplicación con {apiName}. Cree una para obtener credenciales de sandbox.
            </p>
            <Link
              href={`/dashboard/apps/nueva?producto=${slug}`}
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
            >
              Crear aplicación
            </Link>
          </div>
        )}

        {otherApps.length > 0 ? (
          <div className="rounded-[18px] border border-[#E3E7EC] bg-white px-5 py-5">
            <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Vincular a una app existente</p>
            <div className="mt-3 space-y-2">
              {otherApps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => linkProduct(app.id, slug)}
                  className="flex w-full items-center justify-between rounded-[12px] border border-[#E7EAEE] px-4 py-3 text-left text-[14px] text-[#141F25] transition-colors hover:border-[#E1251B]"
                >
                  <span>{app.name}</span>
                  <span className="text-[13px] font-medium text-[#E1251B]">Vincular</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
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
          Ir a Mis aplicaciones
        </Link>
      </div>
    </div>
  );
}
