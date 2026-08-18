import type { Metadata } from "next";

import { LoginPage } from "@/components/auth/login-page";

export const metadata: Metadata = {
  title: "Iniciar sesión | Davivienda API Marketplace",
  description: "Ingrese a su cuenta de desarrollador para continuar en el marketplace de APIs Davivienda.",
};

export default function IniciarSesionRoute() {
  return <LoginPage />;
}
