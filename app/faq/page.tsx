import type { Metadata } from "next";

import { SupportPage } from "@/components/support/support-page";

export const metadata: Metadata = {
  title: "FAQ | Davivienda API Marketplace",
  description:
    "Encuentre respuestas, hable con nuestro equipo o abra un caso. Soporte técnico y comercial para todo su ciclo de integración.",
};

export default function FaqRoute() {
  return <SupportPage />;
}
