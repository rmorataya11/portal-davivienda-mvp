import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { ResetPasswordPage } from "@/components/auth/reset-password-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth.metadata");

  return {
    title: t("resetTitle"),
    description: t("resetDescription"),
  };
}

export default function RestablecerClaveRoute() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F2F3F5]">
          <div className="mx-auto max-w-[760px] px-4 pt-16 sm:px-6">
            <div className="h-64 animate-pulse rounded-[24px] bg-white" />
          </div>
        </main>
      }
    >
      <ResetPasswordPage />
    </Suspense>
  );
}
