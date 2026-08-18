"use client";

import { useState } from "react";

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
    <section id="value" className="pb-16">
      <div className="mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-[56px]">
        <DetailSectionCard eyebrow="Insights" title="Explore cómo aprovechar esta API">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex h-11 items-center justify-center rounded-full px-5 text-[14px] font-medium transition-all duration-300 ease-out ${
                    isActive
                      ? "bg-[#E1251B] text-white shadow-[0_12px_28px_rgba(225,37,27,0.18)]"
                      : "bg-[#F2F3F5] text-[#404040] hover:-translate-y-0.5 hover:bg-[#E9ECEF]"
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
                <div className="rounded-[20px] bg-[#FCFCFD] p-5">
                  <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-[#8E8E8E]">Valor</p>
                  <h3 className="mt-2 text-[30px] font-bold tracking-[0.56px] text-[#404040]">Qué puede lograr</h3>
                  <div className="mt-4 h-1.5 w-10 rounded-full bg-[#E1251B]" />
                </div>
                <ItemGrid items={api.benefits} />
              </div>
            ) : null}

            {activeTab === "use-cases" ? (
              <div className="grid gap-5 lg:grid-cols-[0.28fr_0.72fr]">
                <div className="rounded-[20px] bg-[#FCFCFD] p-5">
                  <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-[#8E8E8E]">Aplicación</p>
                  <h3 className="mt-2 text-[30px] font-bold tracking-[0.56px] text-[#404040]">Casos de uso</h3>
                  <div className="mt-4 h-1.5 w-10 rounded-full bg-[#E1251B]" />
                </div>
                <ItemGrid items={api.useCases} />
              </div>
            ) : null}

            {activeTab === "integration" ? (
              <div className="grid gap-5 lg:grid-cols-[0.32fr_0.68fr]">
                <div className="rounded-[20px] bg-[#FCFCFD] p-5">
                  <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-[#8E8E8E]">Integración</p>
                  <h3 className="mt-2 text-[30px] font-bold tracking-[0.56px] text-[#404040]">Cómo empezar</h3>
                  <div className="mt-4 h-1.5 w-10 rounded-full bg-[#E1251B]" />
                  <p className="mt-5 text-[16px] leading-7 tracking-[0.32px] text-[#707070]">
                    Todo lo necesario para preparar su primer consumo de la API y pasar de exploración a integración
                    real.
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-[22px] bg-[#F2F3F5] px-6 py-5">
                    <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#8E8E8E]">Autenticación</p>
                    <p className="mt-3 text-[18px] font-medium tracking-[0.36px] text-[#404040]">
                      {api.authentication.title}
                    </p>
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
                      Equipos que necesitan liquidez visible, conciliación rápida y automatización en sus flujos
                      internos.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "journey" ? (
              <div className="grid gap-5 lg:grid-cols-[0.32fr_0.68fr]">
                <div className="rounded-[20px] bg-[#FCFCFD] p-5">
                  <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-[#8E8E8E]">Journey</p>
                  <h3 className="mt-2 text-[30px] font-bold tracking-[0.56px] text-[#404040]">
                    Ruta de integración sugerida
                  </h3>
                  <div className="mt-4 h-1.5 w-10 rounded-full bg-[#E1251B]" />
                  <p className="mt-5 text-[16px] leading-7 tracking-[0.32px] text-[#707070]">
                    Una secuencia simple para validar la API, probar su flujo y dejar lista la salida a producción.
                  </p>
                </div>
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
              </div>
            ) : null}
          </div>
        </DetailSectionCard>
      </div>
    </section>
  );
}
