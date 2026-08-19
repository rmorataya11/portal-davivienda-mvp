"use client";

import { useSearchParams } from "next/navigation";

import { readReturnPath } from "@/lib/navigation/safe-path";

export function useAuthReturnPath(fallback = "/") {
  const searchParams = useSearchParams();
  const fromQuery = searchParams.get("returnTo") ?? searchParams.get("next");

  return readReturnPath(fromQuery) ?? fallback;
}
