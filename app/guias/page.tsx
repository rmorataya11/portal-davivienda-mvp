import type { Metadata } from "next";

import { GuidesPage } from "@/components/guides/guides-page";

export const metadata: Metadata = {
  title: "Guías de Uso | Davivienda API Marketplace",
  description:
    "Tutoriales prácticos y rutas de aprendizaje para llevar su integración de Sandbox a Producción con buenas prácticas.",
};

export default function GuidesRoute() {
  return <GuidesPage />;
}
