import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { ProfilePage } from "@/components/profile/profile-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Profile.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ProfileRoute() {
  return (
    <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-white" />}>
      <ProfilePage />
    </Suspense>
  );
}
