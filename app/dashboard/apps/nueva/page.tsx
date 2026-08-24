import type { Metadata } from "next";
import { Suspense } from "react";

import { CreateAppForm } from "@/components/dashboard/create-app-form";

export const metadata: Metadata = {
  title: "Crear aplicación | Davivienda API Marketplace",
  description: "Cree una aplicación de sandbox y vincule las APIs que va a integrar.",
};

export default function CreateAppRoute() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-[24px] bg-white" />}>
      <CreateAppForm />
    </Suspense>
  );
}
