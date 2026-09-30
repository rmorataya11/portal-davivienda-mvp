import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CreateAccountPage } from "@/components/auth/create-account-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth.metadata");

  return {
    title: t("signupTitle"),
    description: t("signupDescription"),
  };
}

export default function CrearCuentaRoute() {
  return <CreateAccountPage />;
}
