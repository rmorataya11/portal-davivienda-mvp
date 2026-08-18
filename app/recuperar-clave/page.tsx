import type { Metadata } from "next";

import { RecoverPasswordPage } from "@/components/auth/recover-password-page";

export const metadata: Metadata = {
  title: "Recuperar contraseña | Davivienda API Marketplace",
  description: "Solicite un enlace para restablecer la contraseña de su cuenta de desarrollador.",
};

export default function RecuperarClaveRoute() {
  return <RecoverPasswordPage />;
}
