"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useDeveloperApps } from "@/components/dashboard/apps-provider";
import { SlidingIndicator, useSlidingIndicator } from "@/components/ui/sliding-indicator";
import { hasProductionApps } from "@/lib/developer-apps/labels";

import { ProfileBilling } from "./profile-billing";
import { ProfileDataForm } from "./profile-data-form";
import { ProfilePasswordCard } from "./profile-password-card";
import { ProfileRequests } from "./profile-requests";

type TabId = "datos" | "solicitudes" | "facturacion";

export function ProfilePage() {
  const t = useTranslations("Profile");
  const { apps, ready: appsReady } = useDeveloperApps();
  const [activeTab, setActiveTab] = useState<TabId>("datos");
  const showBillingTab = appsReady && hasProductionApps(apps);
  const tabs: Array<{ id: TabId; label: string }> = [
    { id: "datos", label: t("tabs.data") },
    { id: "solicitudes", label: t("tabs.requests") },
    ...(showBillingTab ? [{ id: "facturacion" as const, label: t("tabs.billing") }] : []),
  ];
  const resolvedTab = tabs.some((tab) => tab.id === activeTab) ? activeTab : "datos";
  const { listRef, rect, ready } = useSlidingIndicator<HTMLDivElement>(resolvedTab, {
    deps: [tabs.map((tab) => tab.label).join()],
  });

  return (
    <div>
      <h1 className="text-[28px] font-bold tracking-[0.3px] text-[#404040] sm:text-[36px]">{t("title")}</h1>

      <div className="mt-6 overflow-x-auto">
        <div ref={listRef} className="relative flex w-max min-w-full gap-1 border-b border-[#E7EAEE]">
          {tabs.map((tab) => {
            const isActive = tab.id === resolvedTab;

            return (
              <button
                key={tab.id}
                type="button"
                data-tab={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-11 shrink-0 px-4 text-[14px] font-medium transition-colors duration-200 ${
                  isActive ? "text-[#404040]" : "text-[#8E8E8E] hover:text-[#404040]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
          <SlidingIndicator rect={rect} ready={ready} className="bg-[#E1251B]" />
        </div>
      </div>

      <div key={resolvedTab} className="tab-panel-in mt-6">
        {resolvedTab === "datos" ? (
          <div className="space-y-5">
            <ProfileDataForm />
            <div className="grid gap-5 lg:grid-cols-2">
              <ProfilePasswordCard />
            </div>
          </div>
        ) : null}
        {resolvedTab === "solicitudes" ? <ProfileRequests /> : null}
        {resolvedTab === "facturacion" && showBillingTab ? <ProfileBilling /> : null}
      </div>
    </div>
  );
}
