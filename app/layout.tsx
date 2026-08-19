import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import { AuthProvider } from "@/components/auth/auth-provider";
import { MarketplaceAssistant } from "@/components/assistant/marketplace-assistant";

import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Davivienda API Marketplace",
  description:
    "Marketplace de APIs de Davivienda para explorar productos de open banking y casos de uso.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
          <MarketplaceAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
