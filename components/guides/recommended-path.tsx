"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { useDeveloperApps } from "@/components/dashboard/apps-provider";
import { SectionContainer } from "@/components/ui/layout";
import { loadGuidesPathProgress, saveGuidesPathProgress } from "@/lib/guides/path-progress";

type StepState = "locked" | "current" | "completed";

const steps = [
  {
    id: 1,
    title: "Cree su cuenta de desarrollador",
    description: "Registre su empresa, confirme el correo y entre a la consola. El Sandbox queda listo sin costo.",
    currentHref: "/crear-cuenta",
    currentLabel: "Crear cuenta →",
    doneLabel: "Completado",
  },
  {
    id: 2,
    title: "Genere sus credenciales",
    description: "Cree una aplicación en Mis apps y copie las llaves de Sandbox desde la consola.",
    currentHref: "/dashboard/apps/nueva",
    currentLabel: "Abrir consola →",
    doneLabel: "Completado",
  },
  {
    id: 3,
    title: "Configure la seguridad",
    description: "Deje mTLS y OAuth 2.0 listos para que el resto de las integraciones simplemente funcione.",
    currentHref: "/guias/autenticacion-mtls-oauth",
    currentLabel: "Ver guía de seguridad →",
    doneLabel: "Completado",
  },
  {
    id: 4,
    title: "Haga su primera llamada",
    description: "Dispare el primer 200 OK contra Sandbox y confirme que el canal responde.",
    currentHref: "/catalogo-apis",
    currentLabel: "Ver referencia →",
    doneLabel: "Completado",
  },
];

export function RecommendedPath() {
  const { user, loading } = useAuth();
  const { apps, ready } = useDeveloperApps();
  const [manual, setManual] = useState({ securityDone: false, firstCallDone: false });

  useEffect(() => {
    if (!user) {
      setManual({ securityDone: false, firstCallDone: false });
      return;
    }

    setManual(loadGuidesPathProgress(user.uid));
  }, [user]);

  const waiting = loading || !ready;
  const hasAccount = Boolean(user);
  const hasCredentials = apps.length > 0;
  const hasSecurity = hasCredentials && manual.securityDone;
  const hasFirstCall = hasSecurity && manual.firstCallDone;
  const completed = waiting ? [false, false, false, false] : [hasAccount, hasCredentials, hasSecurity, hasFirstCall];

  const states: StepState[] = steps.map((_, index) => {
    if (completed[index]) {
      return "completed";
    }

    const previousDone = index === 0 || completed[index - 1];
    return previousDone ? "current" : "locked";
  });

  function persistManual(next: { securityDone: boolean; firstCallDone: boolean }) {
    if (!user) {
      return;
    }

    setManual(next);
    saveGuidesPathProgress(user.uid, next);
  }

  function handleStepAction(stepId: number) {
    if (stepId === 3 && states[2] === "current") {
      persistManual({ ...manual, securityDone: true });
    }

    if (stepId === 4 && states[3] === "current") {
      persistManual({ ...manual, firstCallDone: true });
    }
  }

  return (
    <section id="ruta-recomendada" className="scroll-anchor pb-6">
      <SectionContainer>
        <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-5 py-6 sm:px-8 sm:py-8">
        <p className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#E1251B]">
          <BoltIcon />
          Ruta recomendada
        </p>
        <h2 className="mt-3 text-[24px] font-bold tracking-[0.2px] text-[#404040] sm:text-[28px]">Su primera integración</h2>
        <p className="mt-2 max-w-[560px] text-[15px] leading-7 text-[#707070]">
          Cuatro pasos en orden para pasar de cero a su primera llamada.
        </p>

        <ol className="mt-6">
          {waiting
            ? [0, 1, 2, 3].map((index) => (
                <li key={index} className="h-16 animate-pulse rounded-[16px] bg-[#F2F3F5] not-last:mb-3" />
              ))
            : steps.map((item, index) => {
                const state = states[index];
                const locked = state === "locked";
                const completedStep = state === "completed";
                const current = state === "current";
                const last = index === steps.length - 1;

                return (
                  <li key={item.id} className="flex gap-4">
                    <div className="flex w-10 shrink-0 flex-col items-center">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-bold ${
                          completedStep
                            ? "bg-[#347659] text-white"
                            : current
                              ? "bg-[#E1251B] text-white"
                              : "bg-[#F2F3F5] text-[#8E8E8E]"
                        }`}
                      >
                        {completedStep ? <CheckIcon /> : String(item.id).padStart(2, "0")}
                      </span>
                      {last ? null : <span className="w-px flex-1 bg-[#E7EAEE]" />}
                    </div>
                    <div className={`min-w-0 flex-1 ${last ? "pb-0" : "pb-6"}`}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className={`text-[16px] font-bold tracking-[0.2px] ${locked ? "text-[#8E8E8E]" : "text-[#404040]"}`}>
                            {item.title}
                          </h3>
                          <p className={`mt-1 text-[14px] leading-6 ${locked ? "text-[#B4B9BF]" : "text-[#707070]"}`}>
                            {item.description}
                          </p>
                        </div>
                        {completedStep ? (
                          <p className="shrink-0 text-[13px] font-semibold text-[#347659]">{item.doneLabel}</p>
                        ) : current ? (
                          <Link
                            href={item.currentHref}
                            onClick={() => handleStepAction(item.id)}
                            className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#E1251B] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#C01F16]"
                          >
                            {item.currentLabel}
                          </Link>
                        ) : (
                          <p className="shrink-0 text-[13px] text-[#8E8E8E]">Siguiente</p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
        </ol>
        </div>
      </SectionContainer>
    </section>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
      <path d="M9.2 1.5 3.8 8.6h3.3L6.6 14.5l5.6-7.4H8.8L9.2 1.5Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path d="M3.5 8.2 6.4 11.2 12.5 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

