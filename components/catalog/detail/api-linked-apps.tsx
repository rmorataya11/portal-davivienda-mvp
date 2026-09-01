"use client";

import Link from "next/link";

import { AuthReturnLink } from "@/components/auth/auth-return-link";
import { useAuth } from "@/components/auth/auth-provider";
import { AppStatusBadge } from "@/components/dashboard/app-status-badge";
import { useDeveloperApps } from "@/components/dashboard/apps-provider";
import { appUsageStats, formatMoneyCop } from "@/lib/developer-apps/factory";
import { getLoginHref, getSignupHref } from "@/lib/navigation/safe-path";
import type { DeveloperApp } from "@/lib/developer-apps/types";

export function ApiLinkedApps({
  slug,
  apiName,
  returnTo,
}: {
  slug: string;
  apiName: string;
  returnTo: string;
}) {
  const { user, loading } = useAuth();
  const { apps, ready, linkProduct } = useDeveloperApps();

  if (loading || !ready) {
    return <div className="h-40 animate-pulse rounded-[24px] bg-white" />;
  }

  if (!user) {
    return (
      <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-6 py-7">
        <p className="max-w-[560px] text-[16px] leading-7 text-[#6A7178]">
          Inicie sesión para ver las aplicaciones que ya usa con {apiName}, o cree una para obtener credenciales de
          sandbox.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <AuthReturnLink
            href={getSignupHref(returnTo)}
            returnTo={returnTo}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
          >
            Crear cuenta
          </AuthReturnLink>
          <AuthReturnLink
            href={getLoginHref(returnTo)}
            returnTo={returnTo}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#E1251B] bg-white px-7 text-[15px] font-semibold text-[#E1251B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFF8F8]"
          >
            Iniciar sesión
          </AuthReturnLink>
        </div>
      </div>
    );
  }

  const linkedApps = apps.filter((app) => app.productSlugs.includes(slug));
  const otherApps = apps.filter((app) => !app.productSlugs.includes(slug));

  return (
    <div className="space-y-4">
      {linkedApps.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-[#D5DAE0] bg-white px-6 py-8">
          <p className="text-[16px] leading-7 text-[#6A7178]">
            Todavía no tiene una aplicación en {apiName}. Créela aquí; también aparecerá en Mis apps.
          </p>
          <Link
            href={`/dashboard/apps/nueva?producto=${slug}`}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
          >
            Crear aplicación
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {linkedApps.map((app) => (
            <ApiAppRow key={app.id} app={app} />
          ))}
        </div>
      )}

      {linkedApps.length > 0 ? (
        <Link
          href={`/dashboard/apps/nueva?producto=${slug}`}
          className="inline-flex h-11 items-center justify-center rounded-full border border-[#E1251B] bg-white px-5 text-[14px] font-semibold text-[#E1251B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFF8F8]"
        >
          Crear otra para esta API
        </Link>
      ) : null}

      {otherApps.length > 0 ? (
        <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-5 py-5">
          <p className="text-[14px] font-semibold text-[#141F25]">Usar una app que ya tiene</p>
          <p className="mt-1 text-[13px] leading-6 text-[#6A7178]">
            La vincula a {apiName} con las mismas credenciales. Seguirá viéndose en Mis apps.
          </p>
          <div className="mt-3 space-y-2">
            {otherApps.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => linkProduct(app.id, slug)}
                className="flex w-full items-center justify-between gap-3 rounded-[14px] border border-[#E7EAEE] px-4 py-3 text-left text-[14px] text-[#141F25] transition-colors hover:border-[#E1251B]"
              >
                <span className="min-w-0 truncate">{app.name}</span>
                <span className="shrink-0 text-[13px] font-medium text-[#E1251B]">Vincular a esta API</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ApiAppRow({ app }: { app: DeveloperApp }) {
  const stats = appUsageStats(app);

  return (
    <div className="rounded-[22px] border border-[#E7EAEE] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[18px] font-bold text-[#141F25]">{app.name}</h3>
        <AppStatusBadge status={app.status} />
      </div>
      <p className="mt-3 text-[20px] font-bold text-[#141F25]">{formatMoneyCop(stats.consumedCop)}</p>
      <p className="mt-1 text-[13px] text-[#8E8E8E]">{stats.callsLast30Days.toLocaleString("es-CO")} llamadas · 30 días</p>
      <div className="mt-4">
        <Link href={`/dashboard/apps/${app.id}`} className="text-[13px] font-medium text-[#E1251B]">
          Abrir app
        </Link>
      </div>
    </div>
  );
}
