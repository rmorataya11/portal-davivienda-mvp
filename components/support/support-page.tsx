"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { localizeGuide } from "@/components/guides/localize-guide";
import { SupportFeedback } from "@/components/support/support-feedback";
import { SupportCaseModal } from "@/components/support/support-case-modal";
import { SupportChangelog } from "@/components/support/support-changelog";
import { GuideList } from "@/components/guides/guide-list";
import { SectionContainer } from "@/components/ui/layout";
import { getGuideBySlug } from "@/lib/guides/guides-content";

type QuestionDefinition = {
  id: string;
  guideSlug?: string;
  sourceQuestion: string;
  sourceAnswer: string;
};

const questionDefinitions: QuestionDefinition[] = [
  {
    id: "sandbox",
    sourceQuestion: "¿Cómo obtengo acceso al entorno Sandbox?",
    sourceAnswer:
      "Cree una cuenta de desarrollador, verifique su identidad y genere sus credenciales de Sandbox desde la consola. El acceso es inmediato y sin costo.",
  },
  {
    id: "produccion",
    guideSlug: "paso-a-produccion",
    sourceQuestion: "¿Qué necesito para pasar a Producción?",
    sourceAnswer:
      "Valide la integración en Sandbox, cree o seleccione la aplicación en Mis apps y envíe la solicitud de contratación. El equipo revisa la empresa, el caso de uso y, si aplica, la whitelist de IPs antes de emitir credenciales de producción.",
  },
  {
    id: "rate-limits",
    sourceQuestion: "¿Cuáles son los límites de uso (rate limits)?",
    sourceAnswer:
      "Los límites dependen del ambiente y del plan acordado. En Sandbox son más conservadores, pensados para pruebas. En Producción se definen en la solicitud de contratación y quedan sujetos al acuerdo de nivel de servicio.",
  },
  {
    id: "incidente",
    sourceQuestion: "¿Cómo reporto un incidente en una API?",
    sourceAnswer:
      "Abra un caso desde esta página e incluya el nombre de la API, el ambiente, la fecha y hora, el identificador de la solicitud y un ejemplo del error. Así el equipo de integraciones puede rastrear el evento con mayor rapidez.",
  },
  {
    id: "credenciales",
    guideSlug: "autenticacion-mtls-oauth",
    sourceQuestion: "¿Las credenciales de Sandbox sirven en Producción?",
    sourceAnswer:
      "No. Sandbox y Producción son ambientes separados. Las llaves de prueba no autentican llamadas productivas; cuando la solicitud se apruebe, recibirá credenciales nuevas desde la consola.",
  },
];

const serviceNames = ["API Tesorería", "API OAuth", "Sandbox"] as const;

const quickAccess = [
  { id: "ayuda", href: "#preguntas-frecuentes", icon: "/soporte/icons_soporte/ayuda.svg" },
  { id: "experto", href: "#soporte-prioritario", icon: "/soporte/icons_soporte/soporte.svg" },
  { id: "caso", href: "#abrir-caso", icon: "/soporte/icons_soporte/caso.svg" },
  { id: "guias", href: "#guias-integracion", icon: "/soporte/icons_soporte/guias.svg" },
] as const;

function withoutTrailingArrow(value: string) {
  return value.replace(/\s*→\s*$/, "");
}

function QuestionGuideLink({ slug }: { slug: string }) {
  const t = useTranslations("Support");
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return null;
  }

  const localized = localizeGuide(guide, t);

  return (
    <p className="mt-4">
      <Link
        href={`#guia-${guide.slug}`}
        className="text-[14px] font-semibold text-[#E1251B] transition-colors hover:text-[#E1111C]"
      >
        {t("questions.seeGuide", { title: localized.title })}
      </Link>
    </p>
  );
}

export function SupportPage() {
  const t = useTranslations("Support");
  const locale = useLocale();
  const questions = useMemo(
    () =>
      questionDefinitions.map((item) => ({
        ...item,
        question: t(`questions.items.${item.id}.question`),
        answer: t(`questions.items.${item.id}.answer`),
      })),
    [t],
  );
  const [openQuestionId, setOpenQuestionId] = useState(questionDefinitions[0]?.id ?? "");
  const [statusUpdatedLabel, setStatusUpdatedLabel] = useState("");
  const [caseModalOpen, setCaseModalOpen] = useState(false);

  useEffect(() => {
    // TODO: reemplazar con timestamp real cuando el monitoreo de Apigee esté conectado.
    const checkedAt = new Date();
    const time = checkedAt.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    setStatusUpdatedLabel(t("status.updated", { time }));
  }, [locale, t]);

  return (
    <>
      <section className="pt-6 pb-8 sm:pt-8 sm:pb-10">
        <SectionContainer>
          <h1 className="max-w-[720px] text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#404040] sm:text-[36px]">
            {t("hero.title")}
          </h1>
          <p className="mt-3 max-w-[640px] text-[16px] leading-7 tracking-[0.24px] text-[#707070]">
            {t("hero.description")}
          </p>
        </SectionContainer>
      </section>

      <section className="bg-white py-8 sm:py-10">
        <SectionContainer>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickAccess.map((item) => {
              return (
                <article
                  key={item.id}
                  className="flex h-[307px] flex-col rounded-[16px] border border-[#8E8E8E] bg-white px-4 pt-6 pb-10"
                >
                  <img src={item.icon} alt="" className="h-[46px] w-[46px]" />
                  <h2 className="mt-5 text-[20px] font-medium leading-[28px] tracking-[0.4px] text-[#404040]">
                    {t(`cards.${item.id}.title`)}
                  </h2>
                  <p className="mt-6 text-[16px] font-normal leading-[24px] tracking-[0.32px] text-[#8E8E8E]">
                    {t(`cards.${item.id}.description`)}
                  </p>
                  {item.id === "caso" ? (
                    <button
                      type="button"
                      onClick={() => setCaseModalOpen(true)}
                      className="mt-[38px] inline-flex h-10 w-fit shrink-0 items-center justify-center rounded-[20px] border border-black px-5 text-[14px] font-semibold whitespace-nowrap text-[#141F25] transition-colors hover:bg-[#141F25] hover:text-white self-start"
                    >
                      {withoutTrailingArrow(t(`cards.${item.id}.link`))}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="mt-[38px] inline-flex h-10 w-fit shrink-0 items-center justify-center rounded-[20px] border border-black px-5 text-[14px] font-semibold whitespace-nowrap text-[#141F25] transition-colors hover:bg-[#141F25] hover:text-white self-start"
                    >
                      {withoutTrailingArrow(t(`cards.${item.id}.link`))}
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </SectionContainer>
      </section>

      <section id="preguntas-frecuentes" className="scroll-anchor pb-8 pt-12">
        <SectionContainer>
          <div className="mb-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_408px]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[22px] font-bold tracking-[0.2px] text-[#404040]">{t("questions.title")}</h2>
              <ChevronIcon open={false} />
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_408px]">
            <div className="rounded-2xl border border-[#E7EAEE] bg-white px-6 py-4">
                <div className="border-t border-[#D0D4D8]">
                  {questions.map((item) => {
                    const isOpen = openQuestionId === item.id;

                    return (
                      <div key={item.id} className="border-b border-[#D0D4D8]">
                        <h3>
                          <button
                            type="button"
                            id={`support-button-${item.id}`}
                            aria-expanded={isOpen}
                            aria-controls={`support-panel-${item.id}`}
                            onClick={() => setOpenQuestionId(isOpen ? "" : item.id)}
                            className="flex w-full items-center justify-between gap-4 py-5 text-left"
                          >
                            <span className="text-[16px] font-semibold tracking-[0.2px] text-[#404040]">
                              {item.question}
                            </span>
                            <ChevronIcon open={isOpen} />
                          </button>
                        </h3>
                        {isOpen ? (
                          <div
                            id={`support-panel-${item.id}`}
                            role="region"
                            aria-labelledby={`support-button-${item.id}`}
                            className="pb-5"
                          >
                            <p className="text-[15px] leading-7 text-[#707070]">{item.answer}</p>
                            {item.guideSlug ? <QuestionGuideLink slug={item.guideSlug} /> : null}
                            <SupportFeedback questionId={item.id} onOpenCase={() => setCaseModalOpen(true)} />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
            </div>

            <aside className="grid content-start gap-4">
              <section className="rounded-2xl border border-[#E7EAEE] bg-white px-5 py-8 sm:px-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h2 className="text-[18px] font-bold tracking-[0.2px] text-[#404040]">{t("status.title")}</h2>
                  {statusUpdatedLabel ? (
                    <p className="text-[12px] text-[#8E8E8E]">{statusUpdatedLabel}</p>
                  ) : null}
                </div>
                <ul className="mt-6 space-y-4">
                  {serviceNames.map((name) => (
                    <li key={name} className="flex items-center justify-between gap-3 text-[14px]">
                      <span className="min-w-0 text-[#8E8E8E]">{name}</span>
                      <span className="inline-flex h-7 shrink-0 items-center justify-center gap-2 rounded-full bg-[#EFFCF5] px-3 text-[12px] font-medium text-[#347659]">
                        <span className="h-2 w-2 rounded-full bg-[#55B685]" aria-hidden="true" />
                        {t("status.operational")}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                id="soporte-prioritario"
                className="scroll-anchor relative overflow-hidden rounded-2xl border border-[#E7EAEE] bg-white px-5 py-6 sm:px-6 lg:h-[240px]"
              >
                <div className="support-priority-wave" aria-hidden="true" />
                <h2 className="relative z-10 text-[18px] font-bold tracking-[0.2px] text-[#404040]">{t("priority.title")}</h2>
                <p className="relative z-10 mt-3 text-[15px] leading-7 text-[#707070]">{t("priority.description")}</p>
                <Link
                  href="/solicitud-contratacion"
                  className="relative z-10 mt-6 inline-flex h-12 w-full max-w-[231px] items-center justify-center rounded-[30px] bg-[#E1251B] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#C01F16]"
                >
                  {t("priority.cta")}
                </Link>
              </section>
            </aside>
          </div>
        </SectionContainer>
      </section>

      <section id="guias-integracion" className="scroll-anchor pb-16 pt-[13px] sm:pb-[125px]">
        <SectionContainer>
          <h2 className="text-[22px] font-bold tracking-[0.2px] text-[#404040]">{t("guides.sectionTitle")}</h2>
          <p className="mt-3 mb-5 max-w-[720px] text-[15px] leading-7 text-[#707070]">
            {t("guides.sectionDescription")}
          </p>
          <GuideList />
        </SectionContainer>
      </section>

      <SupportChangelog />

      <SupportCaseModal open={caseModalOpen} onClose={() => setCaseModalOpen(false)} />
    </>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-5 w-5 shrink-0 text-[#8E8E8E] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
