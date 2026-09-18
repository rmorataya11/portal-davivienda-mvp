"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { FaqFeedback } from "@/components/support/faq-feedback";
import { SupportCaseModal } from "@/components/support/support-case-modal";
import { SupportChangelog } from "@/components/support/support-changelog";
import { SectionContainer } from "@/components/ui/layout";
import { getGuideBySlug } from "@/lib/guides/guides-content";

function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

type SupportFaq = {
  id: string;
  question: string;
  answer: string;
  guideSlug?: string;
};

function FaqGuideLink({ slug }: { slug: string }) {
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return null;
  }

  return (
    <p className="mt-4">
      <Link
        href={`/guias/${guide.slug}`}
        className="text-[14px] font-semibold text-[#E1251B] transition-colors hover:text-[#E1111C]"
      >
        Ver guía completa: {guide.title} →
      </Link>
    </p>
  );
}

const faqs: SupportFaq[] = [
  {
    id: "sandbox",
    question: "¿Cómo obtengo acceso al entorno Sandbox?",
    answer:
      "Cree una cuenta de desarrollador, verifique su identidad y genere sus credenciales de Sandbox desde la consola. El acceso es inmediato y sin costo.",
  },
  {
    id: "produccion",
    question: "¿Qué necesito para pasar a Producción?",
    answer:
      "Valide la integración en Sandbox, cree o seleccione la aplicación en Mis apps y envíe la solicitud de contratación. El equipo revisa la empresa, el caso de uso y, si aplica, la whitelist de IPs antes de emitir credenciales de producción.",
    guideSlug: "paso-a-produccion",
  },
  {
    id: "rate-limits",
    question: "¿Cuáles son los límites de uso (rate limits)?",
    answer:
      "Los límites dependen del ambiente y del plan acordado. En Sandbox son más conservadores, pensados para pruebas. En Producción se definen en la solicitud de contratación y quedan sujetos al acuerdo de nivel de servicio.",
  },
  {
    id: "incidente",
    question: "¿Cómo reporto un incidente en una API?",
    answer:
      "Abra un caso desde esta página e incluya el nombre de la API, el ambiente, la fecha y hora, el identificador de la solicitud y un ejemplo del error. Así el equipo de integraciones puede rastrear el evento con mayor rapidez.",
  },
  {
    id: "credenciales",
    question: "¿Las credenciales de Sandbox sirven en Producción?",
    answer:
      "No. Sandbox y Producción son ambientes separados. Las llaves de prueba no autentican llamadas productivas; cuando la solicitud se apruebe, recibirá credenciales nuevas desde la consola.",
    guideSlug: "autenticacion-mtls-oauth",
  },
];

const serviceStatus = [
  { name: "API Tesorería", status: "Operativo" },
  { name: "API OAuth", status: "Operativo" },
  { name: "Sandbox", status: "Operativo" },
];

const quickAccess = [
  {
    id: "ayuda",
    title: "Centro de ayuda",
    description: "Preguntas frecuentes y solución de problemas comunes.",
    href: "#preguntas-frecuentes",
    linkLabel: "Ver preguntas →",
    icon: BookIcon,
  },
  {
    id: "experto",
    title: "Soporte prioritario",
    description: "Para clientes en Producción con acuerdo de nivel de servicio.",
    href: "#soporte-prioritario",
    linkLabel: "Conocer el acceso →",
    icon: ClockIcon,
  },
  {
    id: "caso",
    title: "Abra un caso",
    description: "Cree una solicitud de soporte técnico o comercial.",
    href: "#abrir-caso",
    linkLabel: "Crear solicitud →",
    icon: TicketIcon,
  },
];

export function SupportPage() {
  const [openFaqId, setOpenFaqId] = useState(faqs[0]?.id ?? "");
  const [faqQuery, setFaqQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusUpdatedLabel, setStatusUpdatedLabel] = useState("");
  const [caseModalOpen, setCaseModalOpen] = useState(false);

  useEffect(() => {
    // TODO: reemplazar con timestamp real cuando el monitoreo de Apigee esté conectado.
    const checkedAt = new Date();
    const time = checkedAt.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
    setStatusUpdatedLabel(`Actualizado ahora · ${time}`);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(faqQuery);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [faqQuery]);

  const filteredFaqs = useMemo(() => {
    const term = normalizeSearch(debouncedQuery);

    if (!term) {
      return faqs;
    }

    return faqs.filter((item) => normalizeSearch(`${item.question} ${item.answer}`).includes(term));
  }, [debouncedQuery]);

  useEffect(() => {
    if (filteredFaqs.length === 0) {
      setOpenFaqId("");
      return;
    }

    if (openFaqId && !filteredFaqs.some((item) => item.id === openFaqId)) {
      setOpenFaqId(filteredFaqs[0]?.id ?? "");
    }
  }, [filteredFaqs, openFaqId]);

  return (
    <>
      <section className="pt-6 pb-8 sm:pt-8 sm:pb-10">
        <SectionContainer>
          <h1 className="max-w-[720px] text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#404040] sm:text-[36px]">
            Estamos para ayudarle a integrar
          </h1>
          <p className="mt-3 max-w-[640px] text-[16px] leading-7 tracking-[0.24px] text-[#707070]">
            Encuentre respuestas, hable con nuestro equipo o abra un caso.
          </p>
        </SectionContainer>
      </section>

      <section className="pb-8">
        <SectionContainer>
          <div className="grid gap-5 md:grid-cols-3">
            {quickAccess.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.id}
                  className="flex h-full flex-col rounded-[24px] border border-[#E7EAEE] bg-white p-5 transition-colors hover:border-[#E1251B]/40"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#FFF1F0] text-[#E1251B]">
                    <Icon />
                  </div>
                  <h2 className="mt-4 text-[18px] font-bold tracking-[0.2px] text-[#404040]">{item.title}</h2>
                  <p className="mt-2 text-[14px] leading-6 text-[#707070]">{item.description}</p>
                  {item.id === "caso" ? (
                    <button
                      type="button"
                      onClick={() => setCaseModalOpen(true)}
                      className="mt-auto inline-flex pt-4 text-left text-[14px] font-semibold text-[#E1251B] transition-colors hover:text-[#C01F16]"
                    >
                      {item.linkLabel}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="mt-auto inline-flex pt-4 text-[14px] font-semibold text-[#E1251B] transition-colors hover:text-[#C01F16]"
                    >
                      {item.linkLabel}
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </SectionContainer>
      </section>

      <section id="preguntas-frecuentes" className="scroll-anchor pb-8 pt-2">
        <SectionContainer>
          <h2 className="mb-4 text-[22px] font-bold tracking-[0.2px] text-[#404040]">Preguntas frecuentes</h2>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
            <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-5 py-6 sm:px-8 sm:py-7">

              <label className="flex h-11 items-center rounded-[12px] border border-[#E7EAEE] bg-[#F8F9FB] px-3 text-[#8E8E8E] transition-colors focus-within:border-[#CBD2D9] focus-within:bg-white">
                <SearchIcon />
                <span className="sr-only">Buscar en preguntas frecuentes</span>
                <input
                  type="search"
                  value={faqQuery}
                  onChange={(event) => setFaqQuery(event.target.value)}
                  placeholder="Buscar en preguntas y respuestas..."
                  className="ml-2 h-full w-full bg-transparent text-[14px] text-[#404040] outline-none placeholder:text-[#8E8E8E] [&::-webkit-search-cancel-button]:hidden"
                />
                {faqQuery ? (
                  <button
                    type="button"
                    onClick={() => setFaqQuery("")}
                    className="ml-2 inline-flex h-7 w-7 shrink-0 items-center justify-center text-[#8E8E8E] transition-colors hover:text-[#404040]"
                    aria-label="Limpiar búsqueda"
                  >
                    <ClearIcon />
                  </button>
                ) : null}
              </label>

              {filteredFaqs.length === 0 ? (
                <p className="mt-6 text-[15px] leading-7 text-[#707070]">
                  No encontramos preguntas sobre “{debouncedQuery.trim()}”. Pruebe con otras palabras o{" "}
                  <button
                    type="button"
                    onClick={() => setCaseModalOpen(true)}
                    className="font-semibold text-[#E1251B] hover:text-[#C01F16]"
                  >
                    abra un caso
                  </button>
                  .
                </p>
              ) : (
                <div className="mt-6 border-t border-[#E7EAEE]">
                  {filteredFaqs.map((item) => {
                    const isOpen = openFaqId === item.id;

                    return (
                      <div key={item.id} className="border-b border-[#E7EAEE]">
                        <h3>
                          <button
                            type="button"
                            id={`faq-button-${item.id}`}
                            aria-expanded={isOpen}
                            aria-controls={`faq-panel-${item.id}`}
                            onClick={() => setOpenFaqId(isOpen ? "" : item.id)}
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
                            id={`faq-panel-${item.id}`}
                            role="region"
                            aria-labelledby={`faq-button-${item.id}`}
                            className="pb-5"
                          >
                            <p className="text-[15px] leading-7 text-[#707070]">{item.answer}</p>
                            {item.guideSlug ? <FaqGuideLink slug={item.guideSlug} /> : null}
                            <FaqFeedback questionId={item.id} onOpenCase={() => setCaseModalOpen(true)} />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <aside className="space-y-5">
              <section className="rounded-[24px] border border-[#E7EAEE] bg-white px-5 py-6 sm:px-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h2 className="text-[18px] font-bold tracking-[0.2px] text-[#404040]">Estado del servicio</h2>
                  {statusUpdatedLabel ? (
                    <p className="text-[12px] text-[#8E8E8E]">{statusUpdatedLabel}</p>
                  ) : null}
                </div>
                <ul className="mt-5 space-y-4">
                  {serviceStatus.map((item) => (
                    <li key={item.name} className="flex items-center justify-between gap-3 text-[14px]">
                      <span className="min-w-0 text-[#404040]">{item.name}</span>
                      <span className="inline-flex shrink-0 items-center justify-end gap-2 font-medium text-[#347659]">
                        <span className="h-2 w-2 rounded-full bg-[#347659]" aria-hidden="true" />
                        {item.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                id="soporte-prioritario"
                className="scroll-anchor rounded-[24px] border border-[#E7EAEE] bg-white px-5 py-6 sm:px-6"
              >
                <h2 className="text-[18px] font-bold tracking-[0.2px] text-[#404040]">Soporte prioritario 24/7</h2>
                <p className="mt-3 text-[15px] leading-7 text-[#707070]">
                  Disponible para clientes en Producción con acuerdo de nivel de servicio.
                </p>
                <Link
                  href="/solicitud-contratacion"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#C01F16]"
                >
                  Solicitar acceso
                </Link>
              </section>
            </aside>
          </div>
        </SectionContainer>
      </section>

      <SupportChangelog />

      <SupportCaseModal open={caseModalOpen} onClose={() => setCaseModalOpen(false)} />
    </>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12.4 12.4 16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path d="M4 4 12 12M12 4 4 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M6 5.5h9.5A2.5 2.5 0 0 1 18 8v11.5H8A2 2 0 0 1 6 17.5v-12Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M6 5.5A2 2 0 0 0 4 7.5V18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9 9h6M9 12.5h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 8.5V12l2.5 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M4.5 8.5A2.5 2.5 0 0 1 7 6h10a2.5 2.5 0 0 1 2.5 2.5v1.2a2.2 2.2 0 1 0 0 4.4v1.4A2.5 2.5 0 0 1 17 18H7a2.5 2.5 0 0 1-2.5-2.5v-1.4a2.2 2.2 0 1 0 0-4.4V8.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M12 8.5v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeDasharray="1.8 2.2" />
    </svg>
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
