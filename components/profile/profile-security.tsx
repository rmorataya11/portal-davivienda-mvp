"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { getAuthErrorMessage } from "@/lib/firebase/errors";

export function ProfileSecurity() {
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
      await sendPasswordResetEmail(getFirebaseAuth(), user.email);
      setResetState("sent");
    } catch (error) {
      setResetError(getAuthErrorMessage(error));
      setResetState("error");
    }
  }

  async function handleSignOutEverywhere() {
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
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-[22px] border border-[#E7EAEE] bg-[#FCFCFD] px-5 py-6 sm:px-6">
        <h3 className="text-[18px] font-bold tracking-[0.2px] text-[#141F25]">Cambiar contraseña</h3>
        <p className="mt-2 text-[15px] leading-7 text-[#6A7178]">
          Le enviaremos un enlace a {user?.email ?? "su correo"} para crear una nueva contraseña.
        </p>
        <button
          type="button"
          onClick={handlePasswordReset}
          disabled={resetState === "sending" || !user?.email}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-5 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C] disabled:translate-y-0 disabled:bg-[#C9CED4]"
        >
          {resetState === "sending" ? "Enviando..." : "Cambiar contraseña"}
        </button>
        {resetState === "sent" ? (
          <p className="mt-3 text-[14px] text-[#347659]">Revise su bandeja. El enlace ya fue enviado.</p>
        ) : null}
        {resetError ? <p className="mt-3 text-[14px] text-[#E1251B]">{resetError}</p> : null}
      </section>

      <section className="rounded-[22px] border border-[#E7EAEE] bg-[#FCFCFD] px-5 py-6 sm:px-6">
        <h3 className="text-[18px] font-bold tracking-[0.2px] text-[#141F25]">Cerrar sesión en todos los dispositivos</h3>
        <p className="mt-2 text-[15px] leading-7 text-[#6A7178]">
          Cierra la sesión en este navegador. La invalidación de todas las sesiones activas se habilitará con el
          backend.
        </p>
        <button
          type="button"
          onClick={handleSignOutEverywhere}
          disabled={signingOut}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full border border-[#D5DAE0] bg-white px-5 text-[14px] font-semibold text-[#404040] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E1251B] hover:text-[#E1251B] disabled:opacity-60"
        >
          {signingOut ? "Cerrando..." : "Cerrar sesión en todos los dispositivos"}
        </button>
      </section>
    </div>
  );
}
