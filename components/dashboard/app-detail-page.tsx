"use client";

import Link from "next/link";
import { useState } from "react";

import { apiCatalogItems, getApiDetailBySlug } from "@/components/catalog/content/apis";
import { BreakablePath } from "@/components/ui/breakable-path";
import { CredentialField } from "@/components/ui/credential-field";
import { appUsageStats, formatMoneyCop } from "@/lib/developer-apps/factory";
import { formatAppDate, formatAppDateTime } from "@/lib/developer-apps/labels";

import { AppDeleteControl, AppEditForm } from "./app-edit-form";
import { AppStatusBadge } from "./app-status-badge";
import { useDeveloperApps } from "./apps-provider";

export function AppDetailPage({ appId }: { appId: string }) {
  const { getApp, ready } = useDeveloperApps();
  const [isEditing, setIsEditing] = useState(false);

  if (!ready) {
    return <div className="h-64 animate-pulse rounded-[24px] bg-white" />;
  }

  const app = getApp(appId);

  if (!app) {
    return (
      <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-6 py-8">
        <h1 className="text-[26px] font-bold text-[#404040] sm:text-[32px]">No encontramos esta aplicación</h1>
        <p className="mt-3 text-[16px] leading-7 text-[#707070]">
          Puede que haya iniciado sesión con otra cuenta o que la app se haya creado en otro navegador.
        </p>
        <Link
          href="/dashboard"
          className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white"
        >
          Volver al dashboard
        </Link>
      </div>
    );
  }

  const products = apiCatalogItems.filter((item) => app.productSlugs.includes(item.slug));
  const stats = appUsageStats(app);
  const productionHref = `/solicitud-contratacion?app=${app.id}&producto=${app.productSlugs[0] ?? ""}`;

  return (
    <div>
      <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#707070]">Aplicación</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-[26px] font-bold tracking-[0.3px] text-[#404040] sm:text-[32px]">{app.name}</h1>
              <AppStatusBadge status={app.status} />
            </div>
          </div>
          {!isEditing ? (
            <div className="flex flex-wrap items-center gap-2">
              {app.status === "sandbox" ? (
                <Link
                  href={productionHref}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#C01F16]"
                >
                  Solicitar producción
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#D5DAE0] bg-white px-5 text-[14px] font-medium text-[#404040] transition-colors hover:border-[#E1251B] hover:text-[#E1251B]"
              >
                Editar
              </button>
              <AppDeleteControl appId={app.id} appName={app.name} />
            </div>
          ) : null}
        </div>
        {isEditing ? (
          <AppEditForm app={app} onCancel={() => setIsEditing(false)} />
        ) : (
          <p className="mt-3 max-w-[720px] text-[15px] leading-6 text-[#707070]">
            {app.description || "Esta aplicación todavía no tiene una descripción."}
          </p>
        )}
        {app.status === "contracting" ? (
          <p className="mt-3 text-[14px] leading-6 text-[#707070]">
            Hay una solicitud de contratación en revisión para esta app.
          </p>
        ) : null}
        {app.status === "production" ? (
          <p className="mt-3 text-[14px] leading-6 text-[#707070]">Esta aplicación ya tiene acceso de producción.</p>
        ) : null}
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-[#E7EAEE] bg-white">
        <div className="grid md:grid-cols-3">
          <MetricCard label="Llamadas / 30 días" value={stats.callsLast30Days.toLocaleString("es-CO")} />
          <MetricCard label="Tasa de error" value={`${stats.errorRate.toFixed(1)}%`} />
          <div className="border-t border-[#E7EAEE] px-5 py-5 md:border-t-0 md:border-l md:px-6">
            <p className="text-[13px] text-[#707070]">Estimado del mes</p>
            <p className="mt-2 text-[22px] font-bold tracking-[0.2px] text-[#404040] sm:text-[26px]">
              {formatMoneyCop(stats.consumedCop)}
            </p>
            <p className="mt-2 text-[13px] leading-5 text-[#707070]">
              de {formatMoneyCop(stats.budgetCop)} · sandbox no se factura
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] border border-[#E7EAEE] bg-white p-6 sm:p-7">
          <h2 className="text-[22px] font-bold text-[#404040]">Credenciales de sandbox</h2>
          <p className="mt-2 text-[14px] leading-6 text-[#707070]">
            Use el consumer key en la cabecera <span className="font-mono text-[#404040]">x-api-key</span>. El secret se
            muestra en esta vista; no lo comparta.
          </p>
          <div className="mt-5 space-y-3">
            <CredentialField label="Consumer key / API key" value={app.consumerKey} secret />
            <CredentialField label="Consumer secret" value={app.consumerSecret} secret />
            <CredentialField label="Base URL" value={app.baseUrl} />
            <p className="-mt-1 px-1 text-[13px] leading-5 text-[#707070]">
              Host de sandbox de esta app. El path del endpoint está en Documentación.
            </p>
            <CredentialField label="Expira" value={formatAppDateTime(app.expiresAt)} />
          </div>
        </div>

        <div className="rounded-[24px] border border-[#E7EAEE] bg-white p-6 sm:p-7">
          <h2 className="text-[22px] font-bold text-[#404040]">API vinculada</h2>
          <div className="mt-4 space-y-3">
            {products.map((product) => {
              const detail = getApiDetailBySlug(product.slug);
              const endpoint = detail?.endpoints[0];

              return (
                <div key={product.slug} className="rounded-[16px] border border-[#E7EAEE] bg-white px-4 py-4">
                  <p className="text-[18px] font-semibold text-[#404040]">{product.name}</p>
                  <p className="mt-1 text-[13px] text-[#707070]">{product.category}</p>
                  {endpoint ? (
                    <div className="mt-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex min-w-14 items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            endpoint.method === "POST" ? "bg-[#E1251B] text-white" : "bg-[#EFFCF5] text-[#347659]"
                          }`}
                        >
                          {endpoint.method}
                        </span>
                        <code className="min-w-0 text-[13px] text-[#404040]">
                          <BreakablePath value={endpoint.path} />
                        </code>
                      </div>
                      <p className="mt-2 text-[13px] leading-5 text-[#707070]">{endpoint.description}</p>
                    </div>
                  ) : null}
                  {detail?.useCases.length ? (
                    <ul className="mt-4 space-y-2">
                      {detail.useCases.map((useCase, index) => (
                        <li key={useCase} className="flex gap-3 text-[13px] leading-5 text-[#404040]">
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#202A31] text-[10px] font-bold text-white">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="pt-0.5">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <Link
                      href={`/catalogo-apis/${product.slug}`}
                      className="inline-flex h-10 items-center justify-center rounded-[20px] border border-[#D5DAE0] px-4 text-[13px] font-medium text-[#404040] transition-colors hover:border-[#E1251B] hover:text-[#E1251B]"
                    >
                      Ver ficha
                    </Link>
                    <Link
                      href={`/catalogo-apis/${product.slug}/detalle-tecnico`}
                      className="inline-flex h-10 items-center justify-center rounded-[20px] bg-[#E1251B] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#C01F16]"
                    >
                      Consola técnica
                    </Link>
                  </div>
                  <Link
                    href={`/documentacion?api=${product.slug}`}
                    className="mt-4 inline-flex text-[13px] font-semibold text-[#E1251B] transition-colors hover:text-[#C01F16]"
                  >
                    Ver documentación de esta API →
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-[13px] text-[#707070]">Creada {formatAppDate(app.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-[#E7EAEE] px-5 py-5 first:border-t-0 md:border-t-0 md:border-l md:first:border-l-0 md:px-6">
      <p className="text-[13px] text-[#707070]">{label}</p>
      <p className="mt-2 text-[24px] font-bold tracking-[0.2px] text-[#404040] sm:text-[28px]">{value}</p>
    </div>
  );
}
