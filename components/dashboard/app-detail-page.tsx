"use client";

import Link from "next/link";

import { apiCatalogItems } from "@/components/catalog/content/apis";
import { CredentialField } from "@/components/ui/credential-field";
import { appUsageStats, formatMoneyCop } from "@/lib/developer-apps/factory";
import { formatAppDate, formatAppDateTime } from "@/lib/developer-apps/labels";

import { AppStatusBadge } from "./app-status-badge";
import { useDeveloperApps } from "./apps-provider";

export function AppDetailPage({ appId }: { appId: string }) {
  const { getApp, ready } = useDeveloperApps();

  if (!ready) {
    return <div className="h-64 animate-pulse rounded-[24px] bg-white" />;
  }

  const app = getApp(appId);

  if (!app) {
    return (
      <div className="rounded-[32px] border border-[#E7EAEE] bg-white px-6 py-8">
        <h1 className="text-[26px] font-bold text-[#141F25] sm:text-[32px]">No encontramos esta aplicación</h1>
        <p className="mt-3 text-[16px] leading-7 text-[#6A7178]">
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

  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.28px] text-[#707070] transition-colors duration-300 hover:text-[#E1251B]"
      >
        Volver al dashboard
      </Link>

      <div className="mt-6 rounded-[32px] border border-[#E7EAEE] bg-white px-6 py-7 shadow-[0_18px_50px_rgba(20,31,37,0.06)] sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#8E8E8E]">Aplicación</p>
            <h1 className="mt-3 text-[26px] font-bold tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]">{app.name}</h1>
            <div className="mt-4 h-1.5 w-14 rounded-full bg-[#E1251B]" />
          </div>
          <AppStatusBadge status={app.status} />
        </div>
        <p className="mt-4 max-w-[720px] text-[16px] leading-7 text-[#6A7178]">
          {app.description || "Esta aplicación todavía no tiene una descripción."}
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-[28px] border border-[#E7EAEE] bg-white">
        <div className="grid md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="px-5 py-5 sm:px-6">
            <p className="text-[13px] text-[#8E8E8E]">Consumido este mes</p>
            <p className="mt-2 text-[28px] font-bold tracking-[0.2px] text-[#141F25] sm:text-[32px]">
              {formatMoneyCop(stats.consumedCop)}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F2F3F5]">
              <div
                className="h-full rounded-full bg-[#E1251B]"
                style={{ width: `${Math.min((stats.consumedCop / stats.budgetCop) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-[13px] text-[#8E8E8E]">
              de {formatMoneyCop(stats.budgetCop)} estimados · sandbox aún no se factura
            </p>
          </div>
          <MetricCard label="Llamadas / 30 días" value={stats.callsLast30Days.toLocaleString("es-CO")} />
          <MetricCard label="Tasa de error" value={`${stats.errorRate.toFixed(1)}%`} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[#E7EAEE] bg-white p-6 sm:p-7">
          <h2 className="text-[22px] font-bold text-[#141F25]">Credenciales de sandbox</h2>
          <p className="mt-2 text-[14px] leading-6 text-[#6A7178]">
            Use el consumer key en la cabecera x-api-key. El secret se muestra una sola vez en esta vista; no lo
            comparta.
          </p>
          <div className="mt-5 space-y-3">
            <CredentialField label="Consumer key / API key" value={app.consumerKey} secret />
            <CredentialField label="Consumer secret" value={app.consumerSecret} secret />
            <CredentialField label="Base URL" value={app.baseUrl} />
            <CredentialField label="Expira" value={formatAppDateTime(app.expiresAt)} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-[#E7EAEE] bg-white p-6 sm:p-7">
            <h2 className="text-[22px] font-bold text-[#141F25]">APIs vinculadas</h2>
            <div className="mt-4 space-y-3">
              {products.map((product) => (
                <div key={product.slug} className="rounded-[16px] border border-[#E7EAEE] bg-[#F8F9FB] px-4 py-4">
                  <p className="font-semibold text-[#141F25]">{product.name}</p>
                  <p className="mt-1 text-[13px] text-[#6A7178]">{product.category}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Link href={`/catalogo-apis/${product.slug}`} className="text-[13px] font-medium text-[#E1251B]">
                      Ver detalle
                    </Link>
                    <Link
                      href={`/catalogo-apis/${product.slug}/detalle-tecnico`}
                      className="text-[13px] font-medium text-[#E1251B]"
                    >
                      Consola técnica
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#E7EAEE] bg-white p-6 sm:p-7">
            <h2 className="text-[22px] font-bold text-[#141F25]">Producción</h2>
            {app.status === "sandbox" ? (
              <>
                <p className="mt-2 text-[14px] leading-6 text-[#6A7178]">
                  Cuando haya validado el flujo en sandbox, solicite contratación para esta misma aplicación.
                </p>
                <Link
                  href={`/solicitud-contratacion?app=${app.id}&producto=${app.productSlugs[0] ?? ""}`}
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-5 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
                >
                  Solicitar producción
                </Link>
              </>
            ) : null}
            {app.status === "contracting" ? (
              <p className="mt-2 text-[14px] leading-6 text-[#6A7178]">
                Hay una solicitud de contratación en revisión para esta app. Le contactaremos para continuar.
              </p>
            ) : null}
            {app.status === "production" ? (
              <p className="mt-2 text-[14px] leading-6 text-[#6A7178]">
                Esta aplicación ya tiene acceso de producción.
              </p>
            ) : null}
            <p className="mt-4 text-[13px] text-[#8E8E8E]">Creada {formatAppDate(app.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-[#E7EAEE] px-5 py-5 md:border-t-0 md:border-l md:px-6">
      <p className="text-[13px] text-[#8E8E8E]">{label}</p>
      <p className="mt-2 text-[24px] font-bold tracking-[0.2px] text-[#141F25] sm:text-[28px]">{value}</p>
    </div>
  );
}
