import Link from "next/link";
import type { ReactNode } from "react";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";

import type { ApiDetail, ApiEndpoint, ApiError } from "./content/apis";

function methodClasses(method: ApiEndpoint["method"]) {
  if (method === "POST") {
    return "bg-[#E1251B] text-white";
  }

  if (method === "PUT") {
    return "bg-[#FFF4E8] text-[#8A4B00]";
  }

  if (method === "DELETE") {
    return "bg-[#FFE9E9] text-[#A11B1B]";
  }

  return "bg-[#EFFCF5] text-[#347659]";
}

function DetailList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[16px] leading-7 tracking-[0.32px] text-[#404040]">
          <span className="mt-[11px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#E1251B]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionCard({
  title,
  children,
}: Readonly<{
  title: string;
  children: ReactNode;
}>) {
  return (
    <section className="rounded-[24px] bg-white px-8 py-8 shadow-[0_18px_50px_rgba(20,31,37,0.06)]">
      <h2 className="text-[28px] font-bold tracking-[0.56px] text-[#404040]">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function EndpointCard({ endpoint }: { endpoint: ApiEndpoint }) {
  return (
    <div className="rounded-[20px] border border-[#D8DCE1] bg-[#FCFCFD] px-6 py-5">
      <div className="flex flex-wrap items-center gap-4">
        <span
          className={`inline-flex min-w-[78px] items-center justify-center rounded-full px-4 py-2 text-[13px] font-bold tracking-[0.26px] ${methodClasses(endpoint.method)}`}
        >
          {endpoint.method}
        </span>
        <code className="text-[16px] font-medium tracking-[0.16px] text-[#0D0D0D]">{endpoint.path}</code>
      </div>
      <p className="mt-4 text-[16px] leading-7 tracking-[0.32px] text-[#707070]">{endpoint.description}</p>
    </div>
  );
}

function ErrorCard({ error }: { error: ApiError }) {
  return (
    <div className="rounded-[20px] border border-[#D8DCE1] bg-white px-6 py-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-[#F2F3F5] px-3 text-[14px] font-bold text-[#404040]">
          {error.code}
        </span>
        <h3 className="text-[18px] font-medium tracking-[0.36px] text-[#404040]">{error.title}</h3>
      </div>
      <p className="mt-4 text-[16px] leading-7 tracking-[0.32px] text-[#707070]">{error.description}</p>
    </div>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#141F25] bg-[#141F25]">
      <div className="border-b border-white/10 px-6 py-4 text-[13px] font-medium uppercase tracking-[0.24em] text-white/72">
        {title}
      </div>
      <pre className="overflow-x-auto px-6 py-6 text-[14px] leading-7 text-white">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ApiDetailPage({ api }: { api: ApiDetail }) {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/catalogo-apis" />

      <section className="pt-[152px]">
        <div className="mx-auto max-w-[1366px] px-[56px]">
          <Link
            href="/catalogo-apis"
            className="inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.28px] text-[#707070] transition-colors duration-300 hover:text-[#E1251B]"
          >
            <span aria-hidden="true">←</span>
            Volver al catálogo
          </Link>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-[32px] bg-white px-8 py-8 shadow-[0_18px_60px_rgba(20,31,37,0.08)]">
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#D8DCE1] bg-[#F2F3F5]" />
                <span className="inline-flex items-center gap-2 rounded-full bg-[#EFFCF5] px-5 py-2 text-[14px] font-medium text-[#347659]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#55B685]" />
                  {api.status}
                </span>
                <span className="inline-flex items-center rounded-full bg-[#F2F3F5] px-5 py-2 text-[14px] font-medium text-[#404040]">
                  {api.category}
                </span>
              </div>

              <h1 className="mt-8 max-w-[720px] text-[48px] font-bold leading-[52px] tracking-[0.96px] text-[#404040]">
                {api.name}
              </h1>
              <p className="mt-6 max-w-[760px] text-[22px] leading-8 tracking-[0.44px] text-[#404040]">
                {api.heroDescription}
              </p>
              <p className="mt-8 max-w-[770px] text-[18px] leading-8 tracking-[0.36px] text-[#707070]">{api.intro}</p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="#request"
                  className="inline-flex h-12 min-w-[226px] items-center justify-center rounded-[30px] bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_38px_rgba(225,37,27,0.24)]"
                >
                  Ver ejemplo técnico
                </Link>
                <Link
                  href="#contacto-api"
                  className="inline-flex h-12 min-w-[210px] items-center justify-center rounded-[30px] border border-[#2C2C2C] bg-white px-7 text-[15px] font-medium text-[#2C2C2C] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#F7F7F7] hover:shadow-[0_14px_30px_rgba(20,31,37,0.1)]"
                >
                  Solicitar acceso
                </Link>
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-[32px] bg-white px-8 py-8 shadow-[0_18px_60px_rgba(20,31,37,0.08)]">
                <p className="text-[14px] font-medium uppercase tracking-[0.26em] text-[#8E8E8E]">Resumen rápido</p>
                <div className="mt-6 space-y-6">
                  <div>
                    <h2 className="text-[18px] font-medium tracking-[0.36px] text-[#404040]">Autenticación</h2>
                    <p className="mt-2 text-[16px] leading-7 tracking-[0.32px] text-[#707070]">
                      {api.authentication.title}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-[18px] font-medium tracking-[0.36px] text-[#404040]">Ambientes</h2>
                    <ul className="mt-2 space-y-2 text-[16px] leading-7 tracking-[0.32px] text-[#707070]">
                      {api.environments.map((environment) => (
                        <li key={environment}>{environment}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-[18px] font-medium tracking-[0.36px] text-[#404040]">Pensada para</h2>
                    <p className="mt-2 text-[16px] leading-7 tracking-[0.32px] text-[#707070]">
                      Equipos de tesorería, finanzas corporativas y plataformas que integran banca empresarial.
                    </p>
                  </div>
                </div>
              </div>

              <div id="contacto-api" className="rounded-[32px] bg-[#141F25] px-8 py-8 text-white shadow-[0_18px_60px_rgba(20,31,37,0.12)]">
                <p className="text-[14px] font-medium uppercase tracking-[0.26em] text-white/66">Siguiente paso</p>
                <h2 className="mt-4 text-[32px] font-bold leading-9 tracking-[0.64px]">Empiece su integración</h2>
                <p className="mt-4 text-[16px] leading-7 tracking-[0.32px] text-white/80">{api.supportNote}</p>
                <div className="mt-8 flex flex-col gap-3">
                  <Link
                    href="#"
                    className="inline-flex h-12 items-center justify-center rounded-[30px] bg-white px-6 text-[15px] font-semibold text-[#141F25] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#F2F3F5]"
                  >
                    Acceder a sandbox
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-12 items-center justify-center rounded-[30px] border border-white/30 px-6 text-[15px] font-medium text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white hover:bg-white/6"
                  >
                    Hablar con un experto
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-[1366px] gap-5 px-[56px] lg:grid-cols-2">
          <SectionCard title="Qué puede lograr">
            <DetailList items={api.benefits} />
          </SectionCard>

          <SectionCard title="Casos de uso">
            <DetailList items={api.useCases} />
          </SectionCard>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto grid max-w-[1366px] gap-5 px-[56px] lg:grid-cols-[1.05fr_0.95fr]">
          <SectionCard title="Cómo integrarla">
            <p className="text-[16px] leading-7 tracking-[0.32px] text-[#707070]">{api.authentication.description}</p>
            <div className="mt-8">
              <h3 className="text-[18px] font-medium tracking-[0.36px] text-[#404040]">Cabeceras clave</h3>
              <ul className="mt-4 space-y-3">
                {api.authentication.headers.map((header) => (
                  <li key={header} className="rounded-[16px] bg-[#F2F3F5] px-4 py-3 font-mono text-[14px] text-[#404040]">
                    {header}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <h3 className="text-[18px] font-medium tracking-[0.36px] text-[#404040]">Requisitos previos</h3>
              <div className="mt-4">
                <DetailList items={api.requirements} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Endpoints principales">
            <div className="space-y-4">
              {api.endpoints.map((endpoint) => (
                <EndpointCard key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} />
              ))}
            </div>
          </SectionCard>
        </div>
      </section>

      <section id="request" className="pb-16">
        <div className="mx-auto grid max-w-[1366px] gap-5 px-[56px] lg:grid-cols-2">
          <CodeBlock title="Request de ejemplo" code={api.sampleRequest} />
          <CodeBlock title="Response de ejemplo" code={api.sampleResponse} />
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-[1366px] px-[56px]">
          <SectionCard title="Errores comunes">
            <div className="grid gap-4 lg:grid-cols-2">
              {api.errors.map((error) => (
                <ErrorCard key={error.code} error={error} />
              ))}
            </div>
          </SectionCard>
        </div>
      </section>

      <MarketplaceFooter />
    </main>
  );
}
