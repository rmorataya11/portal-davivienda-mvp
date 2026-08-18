"use client";

import { useState } from "react";

import { SectionContainer } from "@/components/ui/layout";

import type { ApiDetail } from "../content/apis";
import { DetailSectionCard, ItemGrid } from "./detail-primitives";

type TabId = "value" | "use-cases" | "integration" | "journey";

export function DetailInsightsTabs({ api }: { api: ApiDetail }) {
  const [activeTab, setActiveTab] = useState<TabId>("value");

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: "value", label: "Valor" },
    { id: "use-cases", label: "Casos de uso" },
    { id: "integration", label: "Integración" },
    { id: "journey", label: "Journey" },
  ];

  return (
    <section id="value" className="pt-10 pb-16">
      <SectionContainer>
        <DetailSectionCard eyebrow="Insights" title="Explore cómo aprovechar esta API">
          <div className="rounded-[24px] bg-[linear-gradient(180deg,#F8F9FB_0%,#F3F5F7_100%)] p-4">
            <div>
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Vista de negocio</p>
                <p className="mt-2 max-w-[720px] text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">
                  Cambie entre valor, aplicación, preparación técnica y journey recomendado desde un mismo bloque.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex h-11 items-center justify-center rounded-full px-5 text-[14px] font-medium transition-all duration-300 ease-out ${
                    isActive
                      ? "bg-[#202A31] text-white shadow-[0_12px_28px_rgba(20,31,37,0.14)]"
                      : "bg-[#F3F5F7] text-[#5F676E] hover:-translate-y-0.5 hover:bg-[#EAEDF0] hover:text-[#30383F]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            {activeTab === "value" ? (
              <div className="grid gap-5 lg:grid-cols-[0.28fr_0.72fr]">
                <div className="rounded-[22px] bg-[linear-gradient(180deg,#FCFCFD_0%,#F6F8FA_100%)] p-6">
                  <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Valor</p>
                  <h3 className="mt-2 text-[30px] font-bold tracking-[0.4px] text-[#30383F]">Qué puede lograr</h3>
                  <div className="mt-4 h-1.5 w-10 rounded-full bg-[#E1251B]" />
                  <p className="mt-5 text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">
                    Beneficios directos para equipos que priorizan visibilidad, conciliación y agilidad operativa.
                  </p>
                </div>
                <ItemGrid items={api.benefits} />
              </div>
            ) : null}

            {activeTab === "use-cases" ? (
              <div className="grid gap-5 lg:grid-cols-[0.28fr_0.72fr]">
                <div className="rounded-[22px] bg-[linear-gradient(180deg,#FCFCFD_0%,#F6F8FA_100%)] p-6">
                  <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Aplicación</p>
                  <h3 className="mt-2 text-[30px] font-bold tracking-[0.4px] text-[#30383F]">Casos de uso</h3>
                  <div className="mt-4 h-1.5 w-10 rounded-full bg-[#E1251B]" />
                  <p className="mt-5 text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">
                    Escenarios concretos donde esta API agrega valor en backoffice, reporting y operación diaria.
                  </p>
                </div>
                <ItemGrid items={api.useCases} />
              </div>
            ) : null}

            {activeTab === "integration" ? (
              <div className="grid gap-5 lg:grid-cols-[0.32fr_0.68fr]">
                <div className="rounded-[22px] bg-[linear-gradient(180deg,#FCFCFD_0%,#F6F8FA_100%)] p-6">
                  <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Integración</p>
                  <h3 className="mt-2 text-[30px] font-bold tracking-[0.4px] text-[#30383F]">Cómo empezar</h3>
                  <div className="mt-4 h-1.5 w-10 rounded-full bg-[#E1251B]" />
                  <p className="mt-5 text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">
                    Todo lo necesario para preparar su primer consumo de la API y pasar de exploración a integración
                    real.
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-[22px] border border-[#E3E7EC] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FB_100%)] px-6 py-5">
                    <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Autenticación</p>
                    <p className="mt-3 text-[18px] font-medium tracking-[0.24px] text-[#30383F]">
                      {api.authentication.title}
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-[#E3E7EC] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FB_100%)] px-6 py-5">
                    <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Ambientes</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {api.environments.map((environment) => (
                        <span
                          key={environment}
                          className="inline-flex items-center rounded-full border border-[#E5E8ED] bg-white px-4 py-2 text-[14px] font-medium text-[#404040]"
                        >
                          {environment}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[22px] bg-[linear-gradient(135deg,#202A31_0%,#334049_100%)] px-6 py-5 text-white shadow-[0_18px_40px_rgba(20,31,37,0.12)]">
                    <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-white/58">Ideal para</p>
                    <p className="mt-3 text-[18px] leading-8 tracking-[0.24px] text-white/88">
                      Equipos que necesitan liquidez visible, conciliación rápida y automatización en sus flujos
                      internos.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "journey" ? (
              <div className="grid gap-5 lg:grid-cols-[0.32fr_0.68fr]">
                <div className="rounded-[22px] bg-[linear-gradient(180deg,#FCFCFD_0%,#F6F8FA_100%)] p-6">
                  <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Journey</p>
                  <h3 className="mt-2 text-[30px] font-bold tracking-[0.4px] text-[#30383F]">
                    Ruta de integración sugerida
                  </h3>
                  <div className="mt-4 h-1.5 w-10 rounded-full bg-[#E1251B]" />
                  <p className="mt-5 text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">
                    Una secuencia simple para validar la API, probar su flujo y dejar lista la salida a producción.
                  </p>
                </div>
                <div className="grid gap-4">
                  {[
                    "Solicite acceso y configure las credenciales del ambiente inicial.",
                    "Valide saldos y movimientos en Sandbox usando los endpoints base.",
                    "Integre trazabilidad, monitoreo y paso controlado a Producción.",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="flex gap-4 rounded-[22px] border border-[#E3E7EC] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FB_100%)] px-5 py-5 shadow-[0_12px_30px_rgba(20,31,37,0.04)]"
                    >
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E1251B] text-[14px] font-bold text-white">
                        {index + 1}
                      </span>
                      <p className="pt-1 text-[16px] leading-7 tracking-[0.24px] text-[#3C444B]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </DetailSectionCard>
      </SectionContainer>
    </section>
  );
}
