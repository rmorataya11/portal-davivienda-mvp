"use client";

import { useState } from "react";

import { ProfileApps } from "./profile-apps";
import { ProfileBilling } from "./profile-billing";
import { ProfileDataForm } from "./profile-data-form";
import { ProfileRequests } from "./profile-requests";
import { ProfileSecurity } from "./profile-security";

type TabId = "datos" | "seguridad" | "apps" | "solicitudes" | "facturacion";

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "datos", label: "Datos de perfil" },
  { id: "seguridad", label: "Seguridad" },
  { id: "apps", label: "Mis Apps" },
  { id: "solicitudes", label: "Solicitudes" },
  { id: "facturacion", label: "Facturación" },
];

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>("datos");

  return (
    <div>
      <h1 className="text-[28px] font-bold tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]">Mi perfil</h1>

      <div className="mt-8 rounded-[28px] bg-white px-5 py-6 shadow-[0_18px_50px_rgba(20,31,37,0.06)] sm:px-8 sm:py-8">
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
          {activeTab === "datos" ? <ProfileDataForm /> : null}
          {activeTab === "seguridad" ? <ProfileSecurity /> : null}
          {activeTab === "apps" ? <ProfileApps /> : null}
          {activeTab === "solicitudes" ? <ProfileRequests /> : null}
          {activeTab === "facturacion" ? <ProfileBilling /> : null}
        </div>
      </div>
    </div>
  );
}
