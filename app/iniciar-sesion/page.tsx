import type { Metadata } from "next";

import { LoginPage } from "@/components/auth/login-page";
import { getSafeInternalPath } from "@/lib/navigation/safe-path";

export const metadata: Metadata = {
  title: "Iniciar sesión | Davivienda API Marketplace",
  description: "Ingrese a su cuenta de desarrollador para continuar en el marketplace de APIs Davivienda.",
};

export default async function IniciarSesionRoute({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedNext = Array.isArray(params.next) ? params.next[0] : params.next;

  return <LoginPage nextPath={getSafeInternalPath(requestedNext)} />;
}
