import type { Metadata } from "next";

import { AppDetailPage } from "@/components/dashboard/app-detail-page";

export const metadata: Metadata = {
  title: "Detalle de aplicación | Davivienda API Marketplace",
  description: "Credenciales, APIs vinculadas y estado de contratación de su aplicación.",
};

export default async function AppDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <AppDetailPage appId={id} />;
}
