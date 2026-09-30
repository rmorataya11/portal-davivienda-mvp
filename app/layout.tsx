import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";

import { AuthProvider } from "@/components/auth/auth-provider";
import { CatalogProvider } from "@/components/catalog/catalog-provider";
import { AppsProvider } from "@/components/dashboard/apps-provider";
import { loadMessages, localeCookieName, resolveLocale } from "@/i18n/config";
import { getCatalogApis, type CatalogApi } from "@/lib/catalog/queries";

import "./globals.css";

async function loadCatalog(): Promise<CatalogApi[]> {
  try {
    return await getCatalogApis();
  } catch (error) {
    console.error("No se pudo cargar el catálogo.", error);
    return [];
  }
}

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metadata");

  return {
    title: t("title"),
    description: t("description"),
    icons: {
      icon: [{ url: "/icon.png", type: "image/png" }, { url: "/favicon.ico" }],
      apple: "/icon.png",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(localeCookieName)?.value);
  const messages = await loadMessages(locale);
  const catalog = await loadCatalog();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CatalogProvider apis={catalog}>
            <AuthProvider>
              <AppsProvider>
                {children}
              </AppsProvider>
            </AuthProvider>
          </CatalogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
