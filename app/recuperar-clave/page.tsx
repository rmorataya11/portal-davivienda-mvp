import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { RecoverPasswordPage } from "@/components/auth/recover-password-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth.metadata");

  return {
    title: t("recoverTitle"),
    description: t("recoverDescription"),
  };
}

export default function RecuperarClaveRoute() {
  return <RecoverPasswordPage />;
}
