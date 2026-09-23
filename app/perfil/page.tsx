import type { Metadata } from "next";
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
  return <ProfilePage />;
}
