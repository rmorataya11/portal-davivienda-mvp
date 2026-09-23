import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";

import { AuthProvider } from "@/components/auth/auth-provider";
import { AppsProvider } from "@/components/dashboard/apps-provider";
import { loadMessages, localeCookieName, resolveLocale } from "@/i18n/config";

import "./globals.css";

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

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <AppsProvider>
              {children}
            </AppsProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
