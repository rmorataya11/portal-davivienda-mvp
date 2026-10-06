"use client";

import { useTranslations } from "next-intl";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { SectionContainer } from "@/components/ui/layout";
import { SlidingIndicator, useSlidingIndicator } from "@/components/ui/sliding-indicator";

import type { CatalogView } from "@/lib/catalog/present";
import { ItemGrid } from "./detail-primitives";

type TabId = "value" | "use-cases" | "integration";

export function DetailInsightsTabs({ api }: { api: CatalogView }) {
  const t = useTranslations("Catalog.detail");
  const [activeTab, setActiveTab] = useState<TabId>("value");
  const journeySteps = api.journeySteps?.length
    ? api.journeySteps
    : [t("journeySteps.0"), t("journeySteps.1"), t("journeySteps.2")];

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: "value", label: t("tabs.value") },
    { id: "use-cases", label: t("tabs.useCases") },
    { id: "integration", label: t("tabs.integration") },
  ];
  const { listRef, rect, ready } = useSlidingIndicator<HTMLDivElement>(activeTab, {
    deps: [tabs.map((tab) => tab.label).join()],
  });

  const measureRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number>();

  useLayoutEffect(() => {
    const node = measureRef.current;

    function updateHeight() {
      if (!node) {
        return;
      }

      setPanelHeight(Math.round(node.getBoundingClientRect().height));
    }

    updateHeight();
    if (!node) {
      return;
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    window.addEventListener("resize", updateHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [api.valor, t("valueTitle"), t("valueDescription")]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  return (
    <section id="value" className="scroll-anchor pt-10 pb-16">
      <SectionContainer>
        <div className="rounded-2xl border border-[#E7EAEE] bg-white px-6 py-6 sm:px-8 sm:py-8">
          <h2 className="text-[22px] font-bold tracking-[0.2px] text-[#404040]">{t("insightsTitle")}</h2>

          <div ref={listRef} className="relative mt-5 flex flex-wrap gap-8 border-b border-[#E7EAEE]">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;

              return (
                <button
                  key={tab.id}
                  type="button"
                  data-tab={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex min-h-[44px] items-center text-[14px] leading-none transition-colors duration-200 ${
                    isActive
                      ? "font-semibold text-[#404040]"
                      : "font-medium text-[#8E8E8E] hover:text-[#404040]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
            <SlidingIndicator rect={rect} ready={ready} className="bg-[#E1251B]" />
          </div>

          <div className="relative mt-8">
            <div
              ref={measureRef}
              className="pointer-events-none invisible absolute inset-x-0 top-0"
              aria-hidden="true"
            >
              <ValuePanel api={api} />
            </div>

            <div
              ref={scrollRef}
              className="overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:#D0D4D8_transparent]"
              style={panelHeight ? { height: panelHeight } : undefined}
            >
              <div key={activeTab} className="tab-panel-in">
                {activeTab === "value" ? <ValuePanel api={api} /> : null}
                {activeTab === "use-cases" ? <UseCasesPanel api={api} /> : null}
                {activeTab === "integration" ? <IntegrationPanel api={api} journeySteps={journeySteps} /> : null}
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

function ValuePanel({ api }: { api: CatalogView }) {
  const t = useTranslations("Catalog.detail");

  return (
    <div>
      <h3 className="text-[18px] font-bold tracking-[0.2px] text-[#404040]">{t("valueTitle")}</h3>
      <p className="mt-2 text-[15px] leading-7 text-[#707070]">{t("valueDescription")}</p>
      <ItemGrid items={api.valor} />
    </div>
  );
}

function UseCasesPanel({ api }: { api: CatalogView }) {
  const t = useTranslations("Catalog.detail");

  return (
    <div>
      <h3 className="text-[18px] font-bold tracking-[0.2px] text-[#404040]">{t("useCasesTitle")}</h3>
      <p className="mt-2 text-[15px] leading-7 text-[#707070]">{t("useCasesDescription")}</p>
      <ItemGrid items={api.casosDeUso} />
    </div>
  );
}

function IntegrationPanel({ api, journeySteps }: { api: CatalogView; journeySteps: string[] }) {
  const t = useTranslations("Catalog.detail");

  return (
    <div className="grid gap-6">
      <div>
        <h3 className="text-[18px] font-bold tracking-[0.2px] text-[#404040]">{t("integrationTitle")}</h3>
        <p className="mt-2 text-[15px] leading-7 text-[#707070]">{t("integrationDescription")}</p>
      </div>

      <div className="grid gap-4">
        <div className="rounded-2xl border border-[#E7EAEE] bg-white px-5 py-5">
          <h4 className="text-[16px] font-semibold tracking-[0.2px] text-[#404040]">{t("authenticationEyebrow")}</h4>
          <p className="mt-2 text-[16px] font-medium text-[#404040]">{api.authentication.title}</p>
          <p className="mt-2 text-[15px] leading-7 text-[#707070]">{api.authentication.description}</p>
          {api.authentication.headers.length ? (
            <div className="mt-4">
              <p className="text-[14px] font-semibold text-[#404040]">{t("headersEyebrow")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {api.authentication.headers.map((header) => (
                  <code
                    key={header}
                    className="inline-flex items-center rounded-full border border-[#E7EAEE] bg-[#F2F3F5] px-3 py-1.5 text-[13px] text-[#404040]"
                  >
                    {header}
                  </code>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-[#E7EAEE] bg-white px-5 py-5">
          <h4 className="text-[16px] font-semibold tracking-[0.2px] text-[#404040]">{t("environmentsEyebrow")}</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {api.environments.map((environment) => (
              <span
                key={environment}
                className="inline-flex items-center rounded-full border border-[#E7EAEE] px-3 py-1.5 text-[14px] text-[#404040]"
              >
                {environment}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E7EAEE] bg-white px-5 py-5">
          <h4 className="text-[16px] font-semibold tracking-[0.2px] text-[#404040]">{t("requirementsEyebrow")}</h4>
          <ol className="mt-3 space-y-3">
            {api.requirements.map((requirement, index) => (
              <li key={requirement} className="flex items-start gap-3">
                <span className="w-6 shrink-0 pt-0.5 text-[12px] font-medium text-[#8E8E8E]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-[15px] leading-7 text-[#404040]">{requirement}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div>
        <h4 className="text-[16px] font-semibold tracking-[0.2px] text-[#404040]">{t("journeyTitle")}</h4>
        <p className="mt-2 text-[15px] leading-7 text-[#707070]">{t("journeyDescription")}</p>
        <ItemGrid items={journeySteps} />
      </div>
    </div>
  );
}
