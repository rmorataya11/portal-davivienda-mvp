import type { Metadata } from "next";

import { DashboardHome } from "@/components/dashboard/dashboard-home";

export const metadata: Metadata = {
  title: "Mis aplicaciones | Davivienda API Marketplace",
  description: "Administre sus aplicaciones, credenciales de sandbox y el paso a producción.",
};

export default function DashboardRoute() {
  return <DashboardHome />;
}
