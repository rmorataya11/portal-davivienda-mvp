import type { Metadata } from "next";

import { ProfilePage } from "@/components/profile/profile-page";

export const metadata: Metadata = {
  title: "Mi perfil | Davivienda API Marketplace",
  description: "Administre sus datos, seguridad, aplicaciones, solicitudes y facturación.",
};

export default function ProfileRoute() {
  return <ProfilePage />;
}
