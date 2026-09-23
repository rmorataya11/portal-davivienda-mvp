"use server";

import { cookies } from "next/headers";

import { isLocale, localeCookieName, type Locale } from "@/i18n/config";

const oneYearInSeconds = 60 * 60 * 24 * 365;

export async function setUserLocale(locale: Locale) {
  if (!isLocale(locale)) {
    throw new Error("Unsupported locale");
  }

  const cookieStore = await cookies();
  cookieStore.set(localeCookieName, locale, {
    httpOnly: true,
    maxAge: oneYearInSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
