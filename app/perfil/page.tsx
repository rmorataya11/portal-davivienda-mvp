import type { Metadata } from "next";

import { ProfilePage } from "@/components/profile/profile-page";

export const metadata: Metadata = {
  title: "Mi perfil | Davivienda API Marketplace",
  description: "Administre sus datos, solicitudes y facturación.",
};

export default function ProfileRoute() {
  return <ProfilePage />;
}
