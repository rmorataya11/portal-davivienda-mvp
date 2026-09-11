"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { resetPassword } from "@/lib/auth/session";
import { getAuthErrorMessage } from "@/lib/firebase/errors";

export function ProfilePasswordCard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [resetState, setResetState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [resetError, setResetError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  async function handlePasswordReset() {
    if (!user?.email) {
      return;
    }

    setResetError("");
    setResetState("sending");

    try {
      await resetPassword(user.email);
      setResetState("sent");
    } catch (error) {
      setResetError(getAuthErrorMessage(error));
      setResetState("error");
    }
  }

  async function handleSignOut() {
    // La invalidación real de todas las sesiones requiere backend admin
    // (Firebase Auth Admin SDK / revokeRefreshTokens). Por ahora solo cierra
    // la sesión de este dispositivo.
    setSigningOut(true);

    try {
      await signOut();
      router.push("/");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <section className="flex h-full flex-col rounded-[24px] border border-[#E7EAEE] bg-white px-5 py-6 sm:px-6">
      <h3 className="text-[18px] font-bold tracking-[0.2px] text-[#404040]">Cambiar contraseña</h3>
      <p className="mt-2 text-[15px] leading-7 text-[#707070]">
        Le enviaremos un enlace a {user?.email ?? "su correo"} para crear una nueva contraseña.
      </p>
      <div className="mt-auto pt-5">
        <button
          type="button"
          onClick={handlePasswordReset}
          disabled={resetState === "sending" || !user?.email}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#C01F16] disabled:bg-[#C9CED4]"
        >
          {resetState === "sending" ? "Enviando..." : "Cambiar contraseña"}
        </button>
        {resetState === "sent" ? (
          <p className="mt-3 text-[14px] text-[#347659]">Revise su bandeja. El enlace ya fue enviado.</p>
        ) : null}
        {resetError ? <p className="mt-3 text-[14px] text-[#E1251B]">{resetError}</p> : null}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="mt-4 block text-[13px] font-medium text-[#6A7178] transition-colors hover:text-[#E1251B] disabled:opacity-60"
        >
          {signingOut ? "Cerrando sesión..." : "Cerrar sesión en este dispositivo"}
        </button>
      </div>
    </section>
  );
}
