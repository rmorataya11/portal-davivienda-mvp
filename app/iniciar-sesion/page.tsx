import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { LoginPage } from "@/components/auth/login-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth.metadata");

  return {
    title: t("loginTitle"),
    description: t("loginDescription"),
  };
}

export default function IniciarSesionRoute() {
  return <LoginPage />;
}
