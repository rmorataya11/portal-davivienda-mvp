"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { SurfaceCard } from "@/components/ui/layout";

import { TextField } from "./auth-form-fields";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RecoverPasswordPage() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();

    if (!email) {
      setError("Ingrese su correo electrónico.");
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setError("Ingrese un correo válido, por ejemplo nombre@empresa.com.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  }

  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader />

      <section className="pt-[132px] pb-16">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6">
          <SurfaceCard className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            {submitted ? (
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.24em] text-[#E1251B]">Correo enviado</p>
                <h1 className="mt-3 text-[32px] font-bold tracking-[0.3px] text-[#141F25] sm:text-[36px]">
                  Revise su bandeja
                </h1>
                <p className="mt-4 text-[16px] leading-7 text-[#6A7178]">
                  Si el correo está registrado, le enviaremos un enlace para restablecer su contraseña. Esto es un mock:
                  todavía no se dispara un correo real.
                </p>
                <Link
                  href="/iniciar-sesion"
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
                >
                  Volver a iniciar sesión
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-[34px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[40px]">
                  Recuperar contraseña
                </h1>
                <p className="mt-4 text-[16px] leading-7 text-[#6A7178]">
                  Ingrese el correo de su cuenta y le enviaremos un enlace para crear una nueva contraseña.
                </p>
                <form className="mt-8 space-y-6" noValidate onSubmit={handleSubmit}>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    label="Correo electrónico"
                    required
                    autoComplete="email"
                    placeholder="nombre@empresa.com"
                    error={error}
                    onChange={() => setError("")}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C] disabled:bg-[#C9CED4]"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar enlace"}
                  </button>
                </form>
                <p className="mt-6 text-[15px] text-[#5B636A]">
                  ¿La recordó?{" "}
                  <Link href="/iniciar-sesion" className="font-medium text-[#141F25] transition-colors hover:text-[#E1251B]">
                    Inicie sesión
                  </Link>
                </p>
              </>
            )}
          </SurfaceCard>
        </div>
      </section>

      <MarketplaceFooter />
    </main>
  );
}
