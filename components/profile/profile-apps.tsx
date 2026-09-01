"use client";

import Link from "next/link";

import { AppCard } from "@/components/dashboard/app-card";
import { useDeveloperApps } from "@/components/dashboard/apps-provider";

export function ProfileApps() {
  const { apps, ready } = useDeveloperApps();

  if (!ready) {
    return <div className="h-48 animate-pulse rounded-[18px] bg-[#F2F3F5]" />;
  }

  if (apps.length === 0) {
    return (
      <div className="rounded-[22px] border border-[#E7EAEE] bg-[#FCFCFD] px-6 py-10 text-center">
        <h3 className="text-[20px] font-bold text-[#141F25]">Aún no tiene aplicaciones</h3>
        <p className="mx-auto mt-2 max-w-[440px] text-[15px] leading-7 text-[#6A7178]">
          Cree una app para obtener credenciales de sandbox. El listado es el mismo de Mis apps.
        </p>
        <Link
          href="/dashboard/apps/nueva"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
        >
          Crear aplicación
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-[#6A7178]">{apps.length} en sandbox y producción</p>
        <Link href="/dashboard" className="text-[14px] font-medium text-[#E1251B] transition-colors hover:text-[#E1111C]">
          Abrir Mis apps
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}
