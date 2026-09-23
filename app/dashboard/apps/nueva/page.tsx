import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { CreateAppForm } from "@/components/dashboard/create-app-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Dashboard.metadata");

  return {
    title: t("createTitle"),
    description: t("createDescription"),
  };
}

export default function CreateAppRoute() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-[24px] bg-white" />}>
      <CreateAppForm />
    </Suspense>
  );
}
