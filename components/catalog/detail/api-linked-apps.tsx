"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthReturnLink } from "@/components/auth/auth-return-link";
import { useAuth } from "@/components/auth/auth-provider";
import { AppStatusBadge } from "@/components/dashboard/app-status-badge";
import { useDeveloperApps } from "@/components/dashboard/apps-provider";
import { CredentialField } from "@/components/ui/credential-field";
import { appUsageStats, formatMoneyCop } from "@/lib/developer-apps/factory";
import { getLoginHref, getSignupHref } from "@/lib/navigation/safe-path";
import type { DeveloperApp } from "@/lib/developer-apps/types";

export function ApiLinkedApps({
  slug,
  apiName,
  returnTo,
  showKeys = false,
}: {
  slug: string;
  apiName: string;
  returnTo: string;
  showKeys?: boolean;
}) {
  const { user, loading } = useAuth();
  const { apps, ready, linkProduct } = useDeveloperApps();
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
  const selected = linkedApps.find((app) => app.id === selectedId) ?? linkedApps[0];

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
            <ApiAppRow
              key={app.id}
              app={app}
              selected={showKeys && selected?.id === app.id}
              onSelect={showKeys ? () => setSelectedId(app.id) : undefined}
            />
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {linkedApps.length > 0 ? (
          <Link
            href={`/dashboard/apps/nueva?producto=${slug}`}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#E1251B] bg-white px-5 text-[14px] font-semibold text-[#E1251B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFF8F8]"
          >
            Crear otra para esta API
          </Link>
        ) : null}
        <Link href="/dashboard" className="text-[14px] font-medium text-[#E1251B]">
          Ver todas en Mis apps
        </Link>
      </div>

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
                className="flex w-full items-center justify-between rounded-[14px] border border-[#E7EAEE] px-4 py-3 text-left text-[14px] text-[#141F25] transition-colors hover:border-[#E1251B]"
              >
                <span>{app.name}</span>
                <span className="text-[13px] font-medium text-[#E1251B]">Vincular a esta API</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {showKeys && selected ? (
        <div className="space-y-3">
          <p className="text-[13px] text-[#6A7178]">
            Credenciales de <span className="font-semibold text-[#141F25]">{selected.name}</span>
          </p>
          <CredentialField label="Consumer key / API key" value={selected.consumerKey} secret />
          <CredentialField label="Base URL" value={selected.baseUrl} />
        </div>
      ) : null}
    </div>
  );
}

function ApiAppRow({
  app,
  selected,
  onSelect,
}: {
  app: DeveloperApp;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const stats = appUsageStats(app);

  return (
    <div
      className={`rounded-[22px] border bg-white p-5 ${
        selected ? "border-[#E1251B] shadow-[0_12px_28px_rgba(225,37,27,0.08)]" : "border-[#E7EAEE]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {onSelect ? (
          <button type="button" onClick={onSelect} className="text-left">
            <h3 className="text-[18px] font-bold text-[#141F25]">{app.name}</h3>
          </button>
        ) : (
          <h3 className="text-[18px] font-bold text-[#141F25]">{app.name}</h3>
        )}
        <AppStatusBadge status={app.status} />
      </div>
      <p className="mt-3 text-[20px] font-bold text-[#141F25]">{formatMoneyCop(stats.consumedCop)}</p>
      <p className="mt-1 text-[13px] text-[#8E8E8E]">{stats.callsLast30Days.toLocaleString("es-CO")} llamadas · 30 días</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {onSelect ? (
          <button type="button" onClick={onSelect} className="text-[13px] font-medium text-[#E1251B]">
            Ver credenciales
          </button>
        ) : null}
        <Link href={`/dashboard/apps/${app.id}`} className="text-[13px] font-medium text-[#E1251B]">
          Abrir app
        </Link>
      </div>
    </div>
  );
}
