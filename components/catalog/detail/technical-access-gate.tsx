"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";

import type { ApiDetail } from "../content/apis";
import { DetailSectionCard } from "./detail-primitives";

export function TechnicalAccessGate({ api, children }: { api: ApiDetail; children: ReactNode }) {
  const { user, loading } = useAuth();
  const nextPath = `/catalogo-apis/${api.slug}/detalle-tecnico`;

  if (loading) {
    return (
      <DetailSectionCard eyebrow="Técnico" title="Detalle técnico de esta API">
        <div className="h-48 animate-pulse rounded-[18px] bg-[#F2F3F5]" />
      </DetailSectionCard>
    );
  }

  if (!user) {
    return (
      <DetailSectionCard eyebrow="Acceso requerido" title="Inicie sesión para ver el detalle técnico">
        <p className="max-w-[640px] text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">
          Para consultar endpoints, ejemplos y la consola de {api.name} necesita una cuenta de desarrollador. Puede
          crear una ahora o iniciar sesión si ya la tiene.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/crear-cuenta?producto=${encodeURIComponent(api.slug)}`}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
          >
            Crear cuenta
          </Link>
          <Link
            href={`/iniciar-sesion?next=${encodeURIComponent(nextPath)}`}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#E1251B] bg-white px-7 text-[15px] font-semibold text-[#E1251B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFF8F8]"
          >
            Iniciar sesión
          </Link>
        </div>
      </DetailSectionCard>
    );
  }

  return children;
}
