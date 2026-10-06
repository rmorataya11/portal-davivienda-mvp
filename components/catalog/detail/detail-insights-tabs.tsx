"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { SectionContainer } from "@/components/ui/layout";

import type { CatalogView } from "@/lib/catalog/present";
import { DetailSectionCard, ItemGrid } from "./detail-primitives";

type TabId = "value" | "use-cases" | "integration" | "journey";

export function DetailInsightsTabs({ api }: { api: CatalogView }) {
  const t = useTranslations("Catalog.detail");
  const [activeTab, setActiveTab] = useState<TabId>("value");

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: "value", label: t("tabs.value") },
    { id: "use-cases", label: t("tabs.useCases") },
    { id: "integration", label: t("tabs.integration") },
    { id: "journey", label: t("tabs.journey") },
  ];

  return (
    <section id="value" className="scroll-anchor pt-10 pb-16">
      <SectionContainer>
        <DetailSectionCard title={t("insightsTitle")}>
          <div className="rounded-[24px] bg-[linear-gradient(180deg,#F8F9FB_0%,#F3F5F7_100%)] p-4">
            <p className="max-w-[720px] text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">
              {t("insightsDescription")}
            </p>
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
                  <h3 className="text-[24px] font-bold tracking-[0.4px] text-[#30383F] sm:text-[30px]">{t("valueTitle")}</h3>
                  <div className="mt-4 h-1.5 w-10 rounded-full bg-[#E1251B]" />
                  <p className="mt-5 text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">
                    {t("valueDescription")}
                  </p>
                </div>
                <ItemGrid items={api.valor} />
              </div>
            ) : null}

            {activeTab === "use-cases" ? (
              <div className="grid gap-5 lg:grid-cols-[0.28fr_0.72fr]">
                <div className="rounded-[22px] bg-[linear-gradient(180deg,#FCFCFD_0%,#F6F8FA_100%)] p-6">
                  <h3 className="text-[24px] font-bold tracking-[0.4px] text-[#30383F] sm:text-[30px]">{t("useCasesTitle")}</h3>
                  <div className="mt-4 h-1.5 w-10 rounded-full bg-[#E1251B]" />
                  <p className="mt-5 text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">
                    {t("useCasesDescription")}
                  </p>
                </div>
                <ItemGrid items={api.casosDeUso} />
              </div>
            ) : null}

            {activeTab === "integration" ? (
              <div className="grid gap-5 lg:grid-cols-[0.32fr_0.68fr]">
                <div className="rounded-[22px] bg-[linear-gradient(180deg,#FCFCFD_0%,#F6F8FA_100%)] p-6">
                  <h3 className="text-[24px] font-bold tracking-[0.4px] text-[#30383F] sm:text-[30px]">{t("integrationTitle")}</h3>
                  <div className="mt-4 h-1.5 w-10 rounded-full bg-[#E1251B]" />
                  <p className="mt-5 text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">
                    {t("integrationDescription")}
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-[22px] border border-[#E3E7EC] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FB_100%)] px-6 py-5">
                    <h4 className="text-[16px] font-semibold tracking-[0.2px] text-[#404040]">{t("authenticationEyebrow")}</h4>
                    <p className="mt-3 text-[18px] font-medium tracking-[0.24px] text-[#30383F]">
                      {api.authentication.title}
                    </p>
                    <p className="mt-3 text-[15px] leading-7 tracking-[0.24px] text-[#5F676E]">
                      {api.authentication.description}
                    </p>
                    {api.authentication.headers.length ? (
                      <div className="mt-4">
                        <p className="text-[14px] font-semibold tracking-[0.2px] text-[#404040]">
                          {t("headersEyebrow")}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {api.authentication.headers.map((header) => (
                            <code
                              key={header}
                              className="inline-flex items-center rounded-full border border-[#E5E8ED] bg-white px-4 py-2 text-[13px] text-[#404040]"
                            >
                              {header}
                            </code>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="rounded-[22px] border border-[#E3E7EC] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FB_100%)] px-6 py-5">
                    <h4 className="text-[16px] font-semibold tracking-[0.2px] text-[#404040]">{t("environmentsEyebrow")}</h4>
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
                  <div className="rounded-[22px] border border-[#E3E7EC] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FB_100%)] px-6 py-5">
                    <h4 className="text-[16px] font-semibold tracking-[0.2px] text-[#404040]">{t("requirementsEyebrow")}</h4>
                    <ol className="mt-4 space-y-3">
                      {api.requirements.map((requirement, index) => (
                        <li key={requirement} className="flex items-start gap-3">
                          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#E1251B]/24 bg-[#FFF1F0] text-[12px] font-bold text-[#E1251B]">
                            {index + 1}
                          </span>
                          <p className="pt-0.5 text-[15px] leading-7 tracking-[0.24px] text-[#3C444B]">{requirement}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "journey" ? (
              <div className="grid gap-5 lg:grid-cols-[0.32fr_0.68fr]">
                <div className="rounded-[22px] bg-[linear-gradient(180deg,#FCFCFD_0%,#F6F8FA_100%)] p-6">
                  <h3 className="text-[24px] font-bold tracking-[0.4px] text-[#30383F] sm:text-[30px]">
                    {t("journeyTitle")}
                  </h3>
                  <div className="mt-4 h-1.5 w-10 rounded-full bg-[#E1251B]" />
                  <p className="mt-5 text-[16px] leading-7 tracking-[0.24px] text-[#6A7178]">
                    {t("journeyDescription")}
                  </p>
                </div>
                <div className="grid gap-4">
                  {(api.journeySteps?.length
                    ? api.journeySteps
                    : [t("journeySteps.0"), t("journeySteps.1"), t("journeySteps.2")]
                  ).map((step, index) => (
                    <div
                      key={step}
                      className="flex gap-4 rounded-[22px] border border-[#E3E7EC] bg-[#F7F8FA] px-5 py-5"
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
