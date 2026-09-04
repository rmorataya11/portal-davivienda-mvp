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
    icon: UserIcon,
  },
  {
    id: 2,
    title: "Genere sus credenciales",
    description: "Cree una aplicación en Mis apps y copie las llaves de Sandbox desde la consola.",
    currentHref: "/dashboard/apps/nueva",
    currentLabel: "Abrir consola →",
    doneLabel: "Completado",
    icon: KeyIcon,
  },
  {
    id: 3,
    title: "Configure la seguridad",
    description: "Deje mTLS y OAuth 2.0 listos para que el resto de las integraciones simplemente funcione.",
    currentHref: "#guia-01",
    currentLabel: "Ver guía de seguridad →",
    doneLabel: "Completado",
    icon: ShieldIcon,
  },
  {
    id: 4,
    title: "Haga su primera llamada",
    description: "Dispare el primer 200 OK contra Sandbox y confirme que el canal responde.",
    currentHref: "/catalogo-apis",
    currentLabel: "Ver referencia →",
    doneLabel: "Completado",
    icon: CallIcon,
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
    <section id="ruta-recomendada" className="scroll-mt-36 bg-white py-10 sm:py-14">
      <SectionContainer>
        <p className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#E1251B]">
          <BoltIcon />
          Ruta recomendada
        </p>
        <h2 className="mt-3 text-[24px] font-bold tracking-[0.2px] text-[#141F25] sm:text-[32px]">Su primera integración</h2>
        <p className="mt-3 max-w-[560px] text-[15px] leading-7 text-[#6A7178] sm:text-[16px]">
          Cuatro pasos en orden para pasar de cero a su primera llamada. Le acompañamos en cada uno.
        </p>

        <ol className="mt-8 flex items-center" aria-label="Progreso de la ruta recomendada">
          {waiting
            ? [0, 1, 2, 3].map((index) => (
                <li key={index} className="flex flex-1 items-center last:flex-none">
                  <span className="block h-4 w-4 shrink-0 rounded-full bg-[#E7EAEE]" />
                  {index < 3 ? <span className="mx-2 h-px min-w-4 flex-1 bg-[#E7EAEE] sm:mx-3" /> : null}
                </li>
              ))
            : steps.map((item, index) => {
                const filled = states[index] !== "locked";

                return (
                  <li key={item.id} className="flex flex-1 items-center last:flex-none">
                    <span
                      className={`block h-4 w-4 shrink-0 rounded-full ${
                        filled ? "bg-[#E1251B]" : "border-2 border-[#E1251B] bg-white"
                      }`}
                      aria-current={states[index] === "current" ? "step" : undefined}
                    >
                      <span className="sr-only">
                        Paso {item.id} de 4
                        {states[index] === "current"
                          ? ", actual"
                          : states[index] === "completed"
                            ? ", completado"
                            : ", bloqueado"}
                      </span>
                    </span>
                    {index < steps.length - 1 ? (
                      <span className="mx-2 h-px min-w-4 flex-1 bg-[#E7B8B5] sm:mx-3" aria-hidden="true" />
                    ) : null}
                  </li>
                );
              })}
        </ol>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {waiting
            ? [0, 1, 2, 3].map((index) => (
                <div key={index} className="h-52 animate-pulse rounded-[22px] bg-[#F2F3F5]" />
              ))
            : steps.map((item, index) => {
            const Icon = item.icon;
            const state = states[index];
            const locked = state === "locked";
            const completedStep = state === "completed";
            const tone = locked ? "text-[#B4B9BF]" : "text-[#E1251B]";
            const titleTone = locked ? "text-[#8E8E8E]" : "text-[#141F25]";
            const bodyTone = locked ? "text-[#B4B9BF]" : "text-[#6A7178]";

            return (
              <article key={item.id} className="flex h-full flex-col rounded-[22px] border border-[#E7EAEE] bg-white px-5 py-5">
                <div className={`flex items-center gap-2 ${tone}`}>
                  <Icon className="h-4 w-4" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Paso {item.id} de 4</p>
                </div>
                <h3 className={`mt-4 text-[16px] font-bold leading-6 tracking-[0.2px] ${titleTone}`}>{item.title}</h3>
                <p className={`mt-2 flex-1 text-[14px] leading-6 ${bodyTone}`}>{item.description}</p>
                {locked ? (
                  <p className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#C9CED4]">
                    <LockIcon />
                    {item.currentLabel}
                  </p>
                ) : completedStep ? (
                  <p className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#347659]">
                    <CheckIcon />
                    {item.doneLabel}
                  </p>
                ) : (
                  <Link
                    href={item.currentHref}
                    onClick={() => handleStepAction(item.id)}
                    className="mt-4 inline-flex text-[14px] font-semibold text-[#E1251B] transition-colors hover:text-[#E1111C]"
                  >
                    {item.currentLabel}
                  </Link>
                )}
              </article>
            );
          })}
        </div>

        {waiting || user ? null : (
          <div className="mt-6 flex flex-col gap-4 rounded-[22px] bg-[#FFF1F0] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex gap-3">
              <span className="mt-0.5 text-[#E1251B]">
                <LockIcon />
              </span>
              <div>
                <p className="text-[15px] font-bold text-[#141F25]">Los pasos técnicos necesitan una sesión iniciada</p>
                <p className="mt-1 text-[14px] leading-6 text-[#6A7178]">
                  Cree su cuenta gratis y desbloquee las credenciales de Sandbox al instante.
                </p>
              </div>
            </div>
            <Link
              href="/crear-cuenta"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-[#E1251B] bg-white px-5 text-[14px] font-semibold text-[#E1251B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFF8F8]"
            >
              Crear cuenta
            </Link>
          </div>
        )}

        {!waiting && user && apps.length === 0 ? (
          <div className="mt-6 flex flex-col gap-4 rounded-[22px] bg-[#FFF1F0] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex gap-3">
              <span className="mt-0.5 text-[#E1251B]">
                <LockIcon />
              </span>
              <div>
                <p className="text-[15px] font-bold text-[#141F25]">El siguiente paso es crear una app en Sandbox</p>
                <p className="mt-1 text-[14px] leading-6 text-[#6A7178]">
                  Con la aplicación obtiene las credenciales y se desbloquea la guía de seguridad.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/apps/nueva"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-[#E1251B] bg-white px-5 text-[14px] font-semibold text-[#E1251B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFF8F8]"
            >
              Crear app
            </Link>
          </div>
        ) : null}
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

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <rect x="3.2" y="7.2" width="9.6" height="6.4" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.2 7.2V5.4a2.8 2.8 0 0 1 5.6 0v1.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
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

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5.5 18.5c1.2-3 3.5-4.5 6.5-4.5s5.3 1.5 6.5 4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="8.5" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M11.5 12h8.2m-2.4-2.2V12m0 0v2.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 4 6 6.5v5.2c0 3.6 2.3 6.2 6 7.8 3.7-1.6 6-4.2 6-7.8V6.5L12 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CallIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M5 12h9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 8.5 16.5 12 12 15.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4.5" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
