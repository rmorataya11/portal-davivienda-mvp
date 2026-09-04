import Link from "next/link";

import { SectionContainer } from "@/components/ui/layout";

import { RecommendedPath } from "./recommended-path";

const guides = [
  {
    id: "guia-01",
    number: "01",
    title: "Autenticación mTLS + OAuth 2.0",
    category: "SEGURIDAD",
    level: "intermedio",
    minutes: 15,
    endpoint: "POST /oauth/token",
    description:
      "La base de todo. Dejamos su certificado y sus llaves bien puestos para que el resto de las integraciones simplemente funcione.",
    topics: ["generar el CSR y cargar el certificado", "solicitar la llave de acceso", "renovar y revocar llaves"],
    icon: ShieldIcon,
  },
  {
    id: "guia-02",
    number: "02",
    title: "Consentimiento y acceso a cuentas",
    category: "OPEN BANKING",
    level: "intermedio",
    minutes: 20,
    endpoint: "POST /consents",
    description:
      "Cómo pedirle permiso al cliente —con todas las de la ley— para poder leer sus saldos y movimientos.",
    topics: ["crear la solicitud de permiso", "redirigir y autorizar al usuario", "consultar saldos y movimientos"],
    icon: BankIcon,
  },
  {
    id: "guia-03",
    number: "03",
    title: "Webhooks y notificaciones",
    category: "EVENTOS",
    level: "intermedio",
    minutes: 12,
    endpoint: "POST /webhooks",
    description: "Deje de preguntarle al banco a cada rato: que él le avise. Montamos los webhooks de punta a punta.",
    topics: ["registrar su dirección receptora", "validar la firma HMAC", "manejar reintentos e idempotencia"],
    icon: BellIcon,
  },
  {
    id: "guia-04",
    number: "04",
    title: "Idempotencia y reintentos",
    category: "OPERACIÓN",
    level: "básico",
    minutes: 8,
    endpoint: null,
    description: "El truco para que un reintento nunca se convierta en un pago doble. Corto y al grano.",
    topics: ["generar marcas únicas", "reintentar de forma segura", "interpretar respuestas 409"],
    icon: RetryIcon,
  },
  {
    id: "guia-05",
    number: "05",
    title: "Paso a Producción",
    category: "PRODUCCIÓN",
    level: "avanzado",
    minutes: 18,
    endpoint: null,
    description:
      "La lista de chequeo final antes de salir en vivo: seguridad, acuerdos y monitoreo, sin sorpresas.",
    topics: ["completar la certificación de seguridad", "firmar el acuerdo de servicio", "homologar y monitorear"],
    icon: RocketIcon,
  },
  {
    id: "guia-06",
    number: "06",
    title: "Manejo de errores y cierre de sesión",
    category: "OPERACIÓN",
    level: "básico",
    minutes: 10,
    endpoint: "POST /oauth/revoke",
    description:
      "Cuando una llamada falla o el token se vence, hay que leer el error, no duplicar la operación y cortar las llaves que ya no sirven.",
    topics: ["interpretar 4xx y 5xx", "renovar o revocar el token", "registrar el incidente sin perder el rastro"],
    icon: AlertIcon,
  },
];

export function GuidesPage() {
  return (
    <>
      <section className="bg-white pt-6 pb-12 sm:pt-8 sm:pb-16">
        <SectionContainer>
          <h1 className="max-w-[720px] text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]">
            Aprenda a integrar, paso a paso
          </h1>
          <p className="mt-4 max-w-[680px] text-[16px] leading-7 tracking-[0.24px] text-[#6A7178] sm:text-[18px] sm:leading-8">
            Tutoriales prácticos y rutas de aprendizaje para llevar su integración de Sandbox a Producción con buenas
            prácticas. Vamos a su ritmo.
          </p>
        </SectionContainer>
      </section>

      <RecommendedPath />

      <section id="listado-guias" className="scroll-mt-36 bg-white pb-16 pt-4 sm:pb-20">
        <SectionContainer>
          <p className="text-[13px] font-medium text-[#8E8E8E]">{guides.length} guías</p>
          <div className="mt-4 grid gap-4">
            {guides.map((guide) => {
              const Icon = guide.icon;

              return (
                <article
                  key={guide.id}
                  id={guide.id}
                  className="group scroll-mt-36 flex gap-4 rounded-[22px] border border-[#E7EAEE] border-l-4 border-l-[#E7EAEE] bg-white px-4 py-5 transition-all duration-300 hover:border-l-[#E1251B] hover:shadow-[0_18px_50px_rgba(20,31,37,0.1)] sm:gap-5 sm:px-6 sm:py-6"
                >
                  <p className="hidden w-12 shrink-0 text-[32px] font-bold leading-none tracking-[0.04em] text-[#D5DAE0] sm:block lg:w-14 lg:text-[40px]">
                    {guide.number}
                  </p>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#FFF1F0] text-[#E1251B]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] leading-5 text-[#8E8E8E]">
                            <span className="font-semibold uppercase tracking-[0.14em] text-[#E1251B]">
                              {guide.category}
                            </span>
                            <span> · Nivel {guide.level}</span>
                            <span> · {guide.minutes} min de lectura</span>
                          </p>
                          <h3 className="mt-1 text-[18px] font-bold tracking-[0.2px] text-[#141F25] sm:text-[20px]">
                            {guide.title}
                          </h3>
                        </div>
                      </div>
                      {guide.endpoint ? (
                        <span className="hidden shrink-0 rounded-full bg-[#EFFCF5] px-3 py-1 font-mono text-[11px] font-medium text-[#347659] sm:inline-flex">
                          {guide.endpoint}
                        </span>
                      ) : null}
                    </div>
                    {guide.endpoint ? (
                      <span className="mt-3 inline-flex rounded-full bg-[#EFFCF5] px-3 py-1 font-mono text-[11px] font-medium text-[#347659] sm:hidden">
                        {guide.endpoint}
                      </span>
                    ) : null}
                    <p className="mt-3 max-w-[720px] text-[15px] leading-7 text-[#6A7178]">{guide.description}</p>
                    <p className="mt-3 text-[13px] leading-6 text-[#6A7178] sm:text-[14px]">
                      <span className="font-semibold text-[#141F25]">En esta guía:</span> {guide.topics.join(" · ")}
                    </p>
                    <div className="mt-4 flex justify-end">
                      <Link
                        href={`#${guide.id}`}
                        className="text-[14px] font-semibold text-[#E1251B] transition-colors hover:text-[#E1111C]"
                      >
                        Empezar →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </SectionContainer>
      </section>
    </>
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

function BankIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 10h16M12 5 4.8 10h14.4L12 5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M6.5 10v6.5M10.5 10v6.5M13.5 10v6.5M17.5 10v6.5M4.5 16.5h15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M6.5 16.5h11S16.5 13 16.5 10.5a4.5 4.5 0 1 0-9 0C7.5 13 6.5 16.5 6.5 16.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M10 18.2a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function RetryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M7 8.5A6 6 0 1 1 6 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M7 4.8V8.5H3.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M14 6c2.2 1 4.2 3 5.2 5.2-2.2 1-4.2 3-5.2 5.2-2.2-1-4.2-3-5.2-5.2C10 9 12 7 14 6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="11.2" r="1.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.8 15.2 6 18.5M8.2 17.8 5.5 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 5 4.8 18.5h14.4L12 5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 10v4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="16.4" r="0.8" fill="currentColor" />
    </svg>
  );
}
