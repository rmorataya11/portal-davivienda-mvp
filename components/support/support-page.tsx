"use client";

import Link from "next/link";
import { useState } from "react";

import { SectionContainer } from "@/components/ui/layout";

const faqs = [
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
  },
];

const serviceStatus = [
  { name: "API Pagos", status: "Operativo" },
  { name: "API Cuentas", status: "Operativo" },
  { name: "API OAuth", status: "Operativo" },
  { name: "Sandbox", status: "Operativo" },
];

const quickAccess = [
  {
    id: "ayuda",
    title: "Centro de ayuda",
    description: "Artículos, preguntas frecuentes y solución de problemas comunes.",
    href: "#preguntas-frecuentes",
    linkLabel: "Explorar artículos →",
    icon: BookIcon,
  },
  {
    id: "experto",
    title: "Hable con un experto",
    description: "Agende una sesión con nuestro equipo de integraciones.",
    href: "#soporte-prioritario",
    linkLabel: "Agendar sesión →",
    icon: CalendarIcon,
  },
  {
    id: "caso",
    title: "Abra un caso",
    description: "Cree una solicitud de soporte técnico o comercial.",
    href: "#soporte-prioritario",
    linkLabel: "Crear solicitud →",
    icon: TicketIcon,
  },
];

export function SupportPage() {
  const [openFaqId, setOpenFaqId] = useState(faqs[0]?.id ?? "");

  return (
    <>
      <section className="bg-white pt-6 pb-12 sm:pt-8 sm:pb-16">
        <SectionContainer>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF1F0] px-3 py-1.5 text-[13px] font-semibold text-[#E1251B]">
            <LifeRingIcon />
            Soporte
          </div>
          <h1 className="mt-5 max-w-[720px] text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]">
            Estamos para ayudarle a integrar
          </h1>
          <p className="mt-4 max-w-[640px] text-[16px] leading-7 tracking-[0.24px] text-[#6A7178] sm:text-[18px] sm:leading-8">
            Encuentre respuestas, hable con nuestro equipo o abra un caso. Soporte técnico y comercial para todo su
            ciclo de integración.
          </p>
        </SectionContainer>
      </section>

      <section className="bg-white py-10 sm:py-14">
        <SectionContainer>
          <div className="grid gap-4 md:grid-cols-3">
            {quickAccess.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.id}
                  className="rounded-[22px] border border-[#E7EAEE] bg-white px-5 py-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(20,31,37,0.08)] sm:px-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#E1251B] text-white">
                    <Icon />
                  </div>
                  <h2 className="mt-5 text-[20px] font-bold tracking-[0.2px] text-[#141F25]">{item.title}</h2>
                  <p className="mt-2 text-[15px] leading-7 text-[#6A7178]">{item.description}</p>
                  <Link
                    href={item.href}
                    className="mt-5 inline-flex text-[14px] font-semibold text-[#E1251B] transition-colors hover:text-[#E1111C]"
                  >
                    {item.linkLabel}
                  </Link>
                </article>
              );
            })}
          </div>
        </SectionContainer>
      </section>

      <section id="preguntas-frecuentes" className="scroll-mt-36 bg-white py-12 sm:py-16">
        <SectionContainer>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.85fr)] lg:items-start lg:gap-10">
            <div>
              <h2 className="text-[24px] font-bold tracking-[0.2px] text-[#141F25] sm:text-[32px]">
                Preguntas frecuentes
              </h2>
              <div className="mt-6 overflow-hidden rounded-[22px] border border-[#E7EAEE] bg-white">
                {faqs.map((item, index) => {
                  const isOpen = openFaqId === item.id;

                  return (
                    <div key={item.id} className={index > 0 ? "border-t border-[#E7EAEE]" : ""}>
                      <h3>
                        <button
                          type="button"
                          id={`faq-button-${item.id}`}
                          aria-expanded={isOpen}
                          aria-controls={`faq-panel-${item.id}`}
                          onClick={() => setOpenFaqId(isOpen ? "" : item.id)}
                          className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                        >
                          <span className="text-[16px] font-semibold tracking-[0.2px] text-[#141F25]">{item.question}</span>
                          <ChevronIcon open={isOpen} />
                        </button>
                      </h3>
                      {isOpen ? (
                        <div
                          id={`faq-panel-${item.id}`}
                          role="region"
                          aria-labelledby={`faq-button-${item.id}`}
                          className="px-5 pb-5 sm:px-6"
                        >
                          <p className="max-w-[640px] text-[15px] leading-7 text-[#6A7178]">{item.answer}</p>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="grid gap-4">
              <section className="rounded-[22px] border border-[#E7EAEE] bg-white px-5 py-6 sm:px-6">
                <h2 className="text-[18px] font-bold tracking-[0.2px] text-[#141F25]">Estado del servicio</h2>
                <ul className="mt-5 space-y-4">
                  {serviceStatus.map((item) => (
                    <li key={item.name} className="flex items-center justify-between gap-3 text-[14px]">
                      <span className="text-[#404040]">{item.name}</span>
                      <span className="inline-flex items-center gap-2 font-medium text-[#347659]">
                        <span className="h-2 w-2 rounded-full bg-[#347659]" aria-hidden="true" />
                        {item.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                id="soporte-prioritario"
                className="scroll-mt-36 rounded-[22px] bg-[linear-gradient(180deg,#1B2833_0%,#0D1418_100%)] px-5 py-6 sm:px-6"
              >
                <h2 className="text-[18px] font-bold tracking-[0.2px] text-white">Soporte prioritario 24/7</h2>
                <p className="mt-3 text-[15px] leading-7 text-white/75">
                  Disponible para clientes en Producción con acuerdo de nivel de servicio.
                </p>
                <Link
                  href="/solicitud-contratacion"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-5 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
                >
                  Solicitar acceso
                </Link>
              </section>
            </aside>
          </div>
        </SectionContainer>
      </section>
    </>
  );
}

function LifeRingIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 1.8v3M8 11.2v3M1.8 8h3M11.2 8h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
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

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 10h16M8 4v3.5M16 4v3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
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
