"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { ProfileBilling } from "./profile-billing";
import { ProfileDangerZone } from "./profile-danger-zone";
import { ProfileDataForm } from "./profile-data-form";
import { ProfilePasswordCard } from "./profile-password-card";
import { ProfileRequests } from "./profile-requests";

type TabId = "datos" | "solicitudes" | "facturacion";

export function ProfilePage() {
  const t = useTranslations("Profile");
  const [activeTab, setActiveTab] = useState<TabId>("datos");
  const tabs: Array<{ id: TabId; label: string }> = [
    { id: "datos", label: t("tabs.data") },
    { id: "solicitudes", label: t("tabs.requests") },
    { id: "facturacion", label: t("tabs.billing") },
  ];

  return (
    <div>
      <h1 className="text-[28px] font-bold tracking-[0.3px] text-[#404040] sm:text-[36px]">{t("title")}</h1>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-[#E7EAEE]">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`h-11 shrink-0 border-b-2 px-4 text-[14px] font-medium transition-colors ${
                isActive
                  ? "border-[#E1251B] text-[#404040]"
                  : "border-transparent text-[#8E8E8E] hover:text-[#404040]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {activeTab === "datos" ? (
          <div className="space-y-5">
            <ProfileDataForm />
            <div className="grid gap-5 lg:grid-cols-2">
              <ProfilePasswordCard />
              <ProfileDangerZone />
            </div>
          </div>
        ) : null}
        {activeTab === "solicitudes" ? <ProfileRequests /> : null}
        {activeTab === "facturacion" ? <ProfileBilling /> : null}
      </div>
    </div>
  );
}
