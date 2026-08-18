"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { PasswordField, TextField } from "./auth-form-fields";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Record<string, string>;

export function LoginForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function clearError(field: string) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const nextErrors: FieldErrors = {};

    if (!email) {
      nextErrors.email = "Ingrese su correo electrónico.";
    } else if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = "Ingrese un correo válido, por ejemplo nombre@empresa.com.";
    }

    if (!password) {
      nextErrors.password = "Ingrese su contraseña.";
    } else if (password.length < 8) {
      nextErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  }

  if (submitted) {
    return (
      <div>
        <p className="text-[13px] font-medium uppercase tracking-[0.24em] text-[#E1251B]">Sesión iniciada</p>
        <h1 className="mt-3 text-[32px] font-bold tracking-[0.3px] text-[#141F25] sm:text-[36px]">Bienvenido de nuevo</h1>
        <p className="mt-4 text-[16px] leading-7 text-[#6A7178]">
          Este es un mock: aún no hay autenticación real. Cuando conectemos Firebase, esta pantalla pasará al catálogo
          con su sesión activa.
        </p>
        <Link
          href="/catalogo-apis"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[440px]">
      <h1 className="text-[34px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[40px]">Hola de nuevo</h1>
      <p className="mt-3 text-[16px] leading-7 text-[#6A7178]">Nos alegra verle. Ingrese para continuar.</p>

      <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
        <TextField
          id="email"
          name="email"
          type="email"
          label="Correo electrónico"
          required
          autoComplete="email"
          placeholder="nombre@empresa.com"
          error={errors.email}
          onChange={() => clearError("email")}
        />

        <PasswordField
          id="password"
          name="password"
          label="Contraseña"
          required
          placeholder="••••••••"
          error={errors.password}
          onChange={() => clearError("password")}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-[#404040]">
            <input
              type="checkbox"
              name="remember"
              className="h-[18px] w-[18px] shrink-0 rounded-[4px] border border-[#C9CED4] accent-[#E1251B]"
            />
            Recordarme
          </label>
          <Link href="/recuperar-clave" className="text-[14px] font-medium text-[#E1251B] transition-colors hover:text-[#E1111C]">
            ¿Olvidó su contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)] disabled:translate-y-0 disabled:bg-[#C9CED4] disabled:shadow-none"
        >
          {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          {isSubmitting ? null : <span aria-hidden="true">→</span>}
        </button>
      </form>

      <div className="relative mt-8 overflow-hidden rounded-[20px] border border-[#E1251B]/18 bg-[#FFF8F8] px-5 py-5">
        <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-[#E1251B]/8" />
        <div className="relative flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E1251B]/10 text-[#E1251B]">
            <KeyIcon />
          </span>
          <div>
            <p className="text-[16px] font-bold text-[#141F25]">¿Aún no tiene cuenta?</p>
            <p className="mt-1 text-[14px] leading-6 text-[#6A7178]">
              Regístrese, elija el producto que le interesa y le acompañamos para empezar.
            </p>
            <Link
              href="/crear-cuenta"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-[#E1251B] px-5 text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
            >
              + Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function KeyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7.7 7.7L13.2 13.2M11.2 11.2L12.6 11.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
