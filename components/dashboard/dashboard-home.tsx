"use client";

import Link from "next/link";

import { useAuth } from "@/components/auth/auth-provider";
import { appUsageStats, formatMoneyCop } from "@/lib/developer-apps/factory";

import { AppCard } from "./app-card";
import { useDeveloperApps } from "./apps-provider";
import { WeekActivityChart } from "./week-activity-chart";

export function DashboardHome() {
  const { user } = useAuth();
  const { apps, ready } = useDeveloperApps();

  if (!ready) {
    return <div className="h-64 animate-pulse rounded-[24px] bg-white" />;
  }

  const greetingName = displayNameFromEmail(user?.email);
  const stats = apps.map((app) => appUsageStats(app));
  const totalCalls = stats.reduce((sum, item) => sum + item.callsLast30Days, 0);
  const consumedCop = stats.reduce((sum, item) => sum + item.consumedCop, 0);
  const budgetCop = apps.length > 0 ? Math.max(...stats.map((item) => item.budgetCop)) : 2_500_000;
  const consumedRatio = Math.min(consumedCop / budgetCop, 1);
  const weekActivity =
    stats.length > 0
      ? [0, 1, 2, 3, 4, 5, 6].map((index) =>
          stats.reduce((sum, item) => sum + item.weekActivity[index], 0),
        )
      : [0, 0, 0, 0, 0, 0, 0];
  const sandboxCount = apps.filter((app) => app.status === "sandbox").length;

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[15px] text-[#6A7178]">Hola{greetingName ? `, ${greetingName}` : ""}</p>
          <h1 className="mt-1 text-[28px] font-bold tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]">
            Su espacio de trabajo
          </h1>
          <p className="mt-3 max-w-[560px] text-[16px] leading-7 text-[#6A7178]">
            Revise el consumo, abra una app o cree una nueva para obtener credenciales de sandbox.
          </p>
        </div>
        <Link
          href="/dashboard/apps/nueva"
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[#E1251B] px-6 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
        >
          Crear aplicación
        </Link>
      </div>

      <section className="mt-8 overflow-hidden rounded-[32px] border border-[#E7EAEE] bg-white shadow-[0_18px_50px_rgba(20,31,37,0.06)]">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <p className="text-[13px] font-medium text-[#8E8E8E]">Consumo de los últimos 30 días</p>
            <p className="mt-3 text-[34px] font-bold leading-none tracking-[0.2px] text-[#141F25] sm:text-[42px] lg:text-[48px]">
              {formatMoneyCop(consumedCop)}
            </p>
            <p className="mt-3 text-[15px] text-[#6A7178]">
              de un estimado de {formatMoneyCop(budgetCop)}
            </p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#F2F3F5]">
              <div
                className="h-full rounded-full bg-[#E1251B] transition-[width] duration-500"
                style={{ width: `${Math.max(consumedRatio * 100, apps.length ? 4 : 0)}%` }}
              />
            </div>
            <p className="mt-2 text-[13px] text-[#8E8E8E]">
              {apps.length === 0
                ? "Cuando empiece a consumir APIs, el monto aparecerá aquí."
                : `${Math.round(consumedRatio * 100)}% del estimado del mes · sandbox aún no se factura`}
            </p>
          </div>

          <div className="border-t border-[#E7EAEE] bg-[#F8F9FB] px-6 py-7 sm:px-8 lg:border-t-0 lg:border-l">
            <WeekActivityChart values={weekActivity} />
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <MiniStat label="Aplicaciones" value={String(apps.length)} />
        <MiniStat label="En sandbox" value={String(sandboxCount)} />
        <MiniStat label="Llamadas / 30 días" value={totalCalls.toLocaleString("es-CO")} />
      </div>

      {apps.length === 0 ? (
        <div className="mt-8 rounded-[32px] border border-[#E7EAEE] bg-white px-6 py-12 text-center shadow-[0_18px_50px_rgba(20,31,37,0.06)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1F0] text-[28px] font-bold text-[#E1251B]">
            +
          </div>
          <h2 className="mt-5 text-[24px] font-bold text-[#141F25]">Empiece con su primera app</h2>
          <p className="mx-auto mt-3 max-w-[480px] text-[16px] leading-7 text-[#6A7178]">
            En un minuto obtiene credenciales de sandbox y puede probar una API del catálogo.
          </p>
          <Link
            href="/dashboard/apps/nueva"
            className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
          >
            Crear aplicación
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="text-[22px] font-bold text-[#141F25]">Sus aplicaciones</h2>
            <p className="text-[13px] text-[#8E8E8E]">{apps.length} en total</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-[#E7EAEE] bg-white px-5 py-4">
      <p className="text-[13px] text-[#8E8E8E]">{label}</p>
      <p className="mt-1 text-[22px] font-bold text-[#141F25]">{value}</p>
    </div>
  );
}

function displayNameFromEmail(email: string | null | undefined) {
  if (!email) {
    return "";
  }

  const local = email.split("@")[0] ?? "";
  const first = local.split(/[._-]/)[0] ?? "";
  if (!first) {
    return "";
  }

  return first.charAt(0).toUpperCase() + first.slice(1);
}
