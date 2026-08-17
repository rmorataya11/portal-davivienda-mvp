import Link from "next/link";
import type { ReactNode } from "react";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";

import type { ApiDetail } from "./content/apis";
import { DetailNav } from "./detail/detail-nav";
import { TechnicalTabs } from "./detail/technical-tabs";

const detailSections = [
  { id: "overview", label: "Resumen" },
  { id: "value", label: "Valor" },
  { id: "integration", label: "Integración" },
  { id: "technical", label: "Técnico" },
  { id: "next-steps", label: "Siguiente paso" },
];

function ItemGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <div
          key={item}
          className="group rounded-[22px] border border-[#D8DCE1] bg-[linear-gradient(180deg,#FCFCFD_0%,#F7F8FA_100%)] px-6 py-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#E1251B]/30 hover:shadow-[0_16px_36px_rgba(20,31,37,0.08)]"
        >
          <div className="flex items-start gap-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#141F25] text-[14px] font-bold text-white transition-colors duration-300 group-hover:bg-[#E1251B]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-[16px] leading-7 tracking-[0.32px] text-[#404040]">{item}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickMetric({
  label,
  value,
  tone = "light",
}: Readonly<{
  label: string;
  value: string;
  tone?: "light" | "dark";
}>) {
  return (
    <div
      className={`rounded-[22px] px-5 py-5 transition-all duration-300 ease-out hover:-translate-y-0.5 ${
        tone === "dark"
          ? "border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] shadow-[0_14px_36px_rgba(0,0,0,0.12)]"
          : "border border-[#D8DCE1] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FB_100%)] shadow-[0_14px_36px_rgba(20,31,37,0.06)]"
      }`}
    >
      <p
        className={`text-[13px] font-medium uppercase tracking-[0.18em] ${
          tone === "dark" ? "text-white/62" : "text-[#8E8E8E]"
        }`}
      >
        {label}
      </p>
      <p className={`mt-3 text-[24px] font-bold tracking-[0.48px] ${tone === "dark" ? "text-white" : "text-[#404040]"}`}>
        {value}
      </p>
    </div>
  );
}

function SectionCard({
  title,
  eyebrow,
  children,
}: Readonly<{
  title: string;
  eyebrow?: string;
  children: ReactNode;
}>) {
  return (
    <section className="rounded-[24px] border border-[#E7EAEE] bg-white px-8 py-8 shadow-[0_18px_50px_rgba(20,31,37,0.06)]">
      {eyebrow ? <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-[#8E8E8E]">{eyebrow}</p> : null}
      <h2 className="text-[28px] font-bold tracking-[0.56px] text-[#404040]">{title}</h2>
      <div className="mt-4 h-1.5 w-14 rounded-full bg-[#E1251B]" />
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function ApiDetailPage({ api }: { api: ApiDetail }) {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/catalogo-apis" />

      <section className="pt-[152px]">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-[56px]">
          <Link
            href="/catalogo-apis"
            className="inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.28px] text-[#707070] transition-colors duration-300 hover:text-[#E1251B]"
          >
            <span aria-hidden="true">←</span>
            Volver al catálogo
          </Link>

          <section
            id="overview"
            className="relative mt-6 overflow-hidden rounded-[32px] bg-[linear-gradient(125deg,#141F25_0%,#2A3239_52%,#870412_100%)] px-4 py-4 text-white shadow-[0_24px_70px_rgba(20,31,37,0.14)] sm:px-8 sm:py-8"
          >
            <div className="absolute -right-20 top-[-40px] h-[240px] w-[240px] rounded-full border border-white/10" />
            <div className="absolute right-16 top-16 h-[110px] w-[110px] rounded-full bg-[#E1251B]/14 blur-3xl" />

            <div className="relative grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
              <div className="h-full rounded-[28px] border border-white/10 bg-white/3 px-1 py-1">
                <div className="flex h-full flex-col rounded-[24px] px-4 pb-4 pt-7 sm:px-5 sm:pb-5 sm:pt-8">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/14 bg-white/10" />
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#EFFCF5] px-5 py-2 text-[14px] font-medium text-[#347659]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#55B685]" />
                      {api.status}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white/10 px-5 py-2 text-[14px] font-medium text-white">
                      {api.category}
                    </span>
                  </div>

                  <h1 className="mt-7 max-w-[760px] text-[40px] font-bold leading-[44px] tracking-[0.8px] text-white sm:mt-8 sm:text-[52px] sm:leading-[56px] sm:tracking-[1.04px]">
                    {api.name}
                  </h1>
                  <p className="mt-5 max-w-[760px] text-[18px] leading-7 tracking-[0.36px] text-white/90 sm:mt-6 sm:text-[22px] sm:leading-8 sm:tracking-[0.44px]">
                    {api.heroDescription}
                  </p>
                  <p className="mt-6 max-w-[760px] text-[16px] leading-7 tracking-[0.32px] text-white/72 sm:mt-8 sm:text-[18px] sm:leading-8 sm:tracking-[0.36px]">
                    {api.intro}
                  </p>

                  <div className="mt-auto pt-8 flex flex-wrap gap-3 sm:pt-10 sm:gap-4">
                    <Link
                      href="#technical"
                      className="inline-flex h-11 min-w-[190px] items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_38px_rgba(225,37,27,0.24)] sm:h-12 sm:min-w-[226px] sm:px-7 sm:text-[15px]"
                    >
                      Ver ejemplo técnico
                    </Link>
                    <Link
                      href="#next-steps"
                      className="inline-flex h-11 min-w-[170px] items-center justify-center rounded-[30px] border border-white/24 bg-white/6 px-6 text-[14px] font-medium text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/10 sm:h-12 sm:min-w-[210px] sm:px-7 sm:text-[15px]"
                    >
                      Solicitar acceso
                    </Link>
                  </div>
                </div>
              </div>

              <aside>
                <div className="rounded-[28px] border border-white/12 bg-white/8 px-7 py-7 backdrop-blur-[2px]">
                  <p className="text-[14px] font-medium uppercase tracking-[0.26em] text-white/64">Resumen rápido</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <QuickMetric label="Auth" value="Segura" tone="dark" />
                    <QuickMetric label="Endpoints" value={String(api.endpoints.length)} tone="dark" />
                    <div className="sm:col-span-2">
                      <QuickMetric label="Primera llamada" value="Rápida" tone="dark" />
                    </div>
                  </div>
                  <div className="mt-3 rounded-[20px] border border-white/12 bg-white/6 px-5 py-5">
                    <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-white/62">Ambientes</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {api.environments.map((environment) => (
                        <span
                          key={environment}
                          className="inline-flex items-center rounded-full border border-white/12 bg-white/10 px-3 py-2 text-[13px] font-medium text-white"
                        >
                          {environment.replace(" para pruebas funcionales", "").replace(" para operaciones autorizadas", "")}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-6 text-[16px] leading-7 tracking-[0.32px] text-white/74">
                    Diseñada para equipos de tesorería, finanzas corporativas y plataformas que integran banca
                    empresarial.
                  </p>
                </div>
              </aside>

              <div className="grid gap-4 sm:grid-cols-2 xl:col-span-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_1.75fr]">
                <QuickMetric label="Producto" value="Tesorería" />
                <QuickMetric label="Uso ideal" value="B2B" />
                <QuickMetric label="Cobertura" value="Saldos + movimientos" />
                <QuickMetric label="Valor" value="Liquidez en tiempo real" />
                <div className="rounded-[24px] bg-white px-6 py-5 text-[#404040] shadow-[0_18px_50px_rgba(20,31,37,0.08)]">
                  <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-[#8E8E8E]">Qué encontrará aquí</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#F2F3F5] px-3 py-2 text-[13px] font-medium text-[#404040]">Casos de uso reales</span>
                    <span className="rounded-full bg-[#F2F3F5] px-3 py-2 text-[13px] font-medium text-[#404040]">Requisitos de integración</span>
                    <span className="rounded-full bg-[#F2F3F5] px-3 py-2 text-[13px] font-medium text-[#404040]">Request y response</span>
                  </div>
                </div>
              </div>
            </div>

          </section>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-[56px]">
          <DetailNav sections={detailSections} />
        </div>
      </section>

      <section id="value" className="pb-16">
        <div className="mx-auto grid max-w-[1366px] gap-5 px-4 sm:px-6 lg:px-[56px] lg:grid-cols-2">
          <SectionCard eyebrow="Valor" title="Qué puede lograr">
            <ItemGrid items={api.benefits} />
          </SectionCard>

          <SectionCard eyebrow="Aplicación" title="Casos de uso">
            <ItemGrid items={api.useCases} />
          </SectionCard>
        </div>
      </section>

      <section id="integration" className="pb-16">
        <div className="mx-auto grid max-w-[1366px] gap-5 px-4 sm:px-6 lg:px-[56px] lg:grid-cols-[0.9fr_1.1fr]">
          <SectionCard eyebrow="Integración" title="Cómo empezar">
            <p className="text-[16px] leading-7 tracking-[0.32px] text-[#707070]">
              Todo lo necesario para preparar su primer consumo de la API y pasar de exploración a integración real.
            </p>
            <div className="grid gap-4">
              <div className="rounded-[22px] bg-[#F2F3F5] px-6 py-5">
                <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#8E8E8E]">Autenticación</p>
                <p className="mt-3 text-[18px] font-medium tracking-[0.36px] text-[#404040]">{api.authentication.title}</p>
              </div>
              <div className="rounded-[22px] bg-[#F2F3F5] px-6 py-5">
                <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#8E8E8E]">Ambientes</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {api.environments.map((environment) => (
                    <span
                      key={environment}
                      className="inline-flex items-center rounded-full bg-white px-4 py-2 text-[14px] font-medium text-[#404040]"
                    >
                      {environment}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[22px] bg-[#141F25] px-6 py-5 text-white">
                <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-white/60">Ideal para</p>
                <p className="mt-3 text-[18px] leading-8 tracking-[0.36px] text-white/88">
                  Equipos que necesitan liquidez visible, conciliación rápida y automatización en sus flujos internos.
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard eyebrow="Journey" title="Ruta de integración sugerida">
            <p className="text-[16px] leading-7 tracking-[0.32px] text-[#707070]">
              Una secuencia simple para validar la API, probar su flujo y dejar lista la salida a producción.
            </p>
            <div className="grid gap-4">
              {[
                "Solicite acceso y configure las credenciales del ambiente inicial.",
                "Valide saldos y movimientos en Sandbox usando los endpoints base.",
                "Integre trazabilidad, monitoreo y paso controlado a Producción.",
              ].map((step, index) => (
                <div key={step} className="flex gap-4 rounded-[22px] border border-[#D8DCE1] bg-[#FCFCFD] px-5 py-5">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E1251B] text-[14px] font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-[16px] leading-7 tracking-[0.32px] text-[#404040]">{step}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </section>

      <section id="technical" className="pb-16">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-[56px]">
          <SectionCard eyebrow="Técnico" title="Explore la integración">
            <TechnicalTabs
              authentication={api.authentication}
              requirements={api.requirements}
              endpoints={api.endpoints}
              sampleRequest={api.sampleRequest}
              sampleResponse={api.sampleResponse}
              errors={api.errors}
            />
          </SectionCard>
        </div>
      </section>

      <section id="next-steps" className="pb-16">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-[56px]">
          <div className="rounded-[32px] bg-[linear-gradient(90deg,#404040_0%,#0D0D0D_100%)] px-5 py-6 text-white shadow-[0_24px_70px_rgba(20,31,37,0.12)] sm:px-8 sm:py-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-[14px] font-medium uppercase tracking-[0.26em] text-white/64">Siguiente paso</p>
                <h2 className="mt-4 text-[36px] font-bold tracking-[0.72px]">Empiece su integración con esta API</h2>
                <p className="mt-5 max-w-[860px] text-[18px] leading-8 tracking-[0.36px] text-white/78">
                  {api.supportNote}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/14 bg-white/6 px-4 py-2 text-[14px] font-medium text-white/88">
                    Sandbox guiado
                  </span>
                  <span className="rounded-full border border-white/14 bg-white/6 px-4 py-2 text-[14px] font-medium text-white/88">
                    Soporte de integración
                  </span>
                  <span className="rounded-full border border-white/14 bg-white/6 px-4 py-2 text-[14px] font-medium text-white/88">
                    Paso a producción
                  </span>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/12 bg-white/6 p-4 backdrop-blur-[2px]">
                <div className="flex flex-col gap-3">
                  <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-white/60">Comience hoy</p>
                <Link
                  href="#"
                  className="inline-flex h-12 min-w-[220px] items-center justify-center rounded-[30px] bg-white px-6 text-[15px] font-semibold text-[#141F25] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#F2F3F5]"
                >
                  Acceder a sandbox
                </Link>
                <Link
                  href="#"
                  className="inline-flex h-12 min-w-[220px] items-center justify-center rounded-[30px] border border-white/30 px-6 text-[15px] font-medium text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white hover:bg-white/6"
                >
                  Hablar con un experto
                </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketplaceFooter />
    </main>
  );
}
