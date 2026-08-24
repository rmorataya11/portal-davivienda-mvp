"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";

import { getFirebaseAuth } from "@/lib/firebase/client";
import { getAuthErrorMessage } from "@/lib/firebase/errors";
import { getSignupHref, rememberReturnPath, resolveAuthReturnPath } from "@/lib/navigation/safe-path";

import { useAuth } from "./auth-provider";
import { PasswordField, TextField } from "./auth-form-fields";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Record<string, string>;

export function LoginForm() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const destinationRef = useRef<string>("/dashboard");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const destination = resolveAuthReturnPath();
    if (destination) {
      destinationRef.current = destination;
      rememberReturnPath(destination);
    }
  }, []);

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    router.replace(destinationRef.current);
  }, [loading, router, user]);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    setFormError("");

    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    setIsSubmitting(true);
    const destination = resolveAuthReturnPath() ?? destinationRef.current;
    destinationRef.current = destination;

    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      router.replace(destination);
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const signupReturnTo = destinationRef.current === "/dashboard" ? undefined : destinationRef.current;

  return (
    <div className="w-full">
      <Link href="/" className="text-[13px] font-medium text-[#6A7178] transition-colors hover:text-[#E1251B]">
        Volver al inicio
      </Link>
      <div className="mt-4 h-1 w-12 rounded-full bg-[#E1251B] sm:mt-5" />
      <h1 className="mt-3 text-[26px] font-bold leading-[1.15] tracking-[0.2px] text-[#141F25] sm:mt-4 sm:text-[30px]">
        Hola de nuevo
      </h1>
      <p className="mt-2 text-[14px] leading-6 text-[#6A7178] sm:text-[15px]">Nos alegra verle. Ingrese para continuar.</p>

      <form className="mt-5 space-y-4 sm:mt-6" noValidate onSubmit={handleSubmit}>
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

        {formError ? <p className="text-[13px] text-[#E1251B]">{formError}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)] disabled:translate-y-0 disabled:bg-[#C9CED4] disabled:shadow-none sm:h-12 sm:text-[15px]"
        >
          {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          {isSubmitting ? null : <span aria-hidden="true">→</span>}
        </button>
      </form>

      <div className="mt-5 rounded-[16px] border border-[#E7EAEE] bg-[#F8F9FB] px-4 py-4 sm:mt-6 sm:px-5 sm:py-4">
        <p className="text-[15px] font-bold text-[#141F25]">¿Aún no tiene cuenta?</p>
        <p className="mt-1 text-[13px] leading-5 text-[#6A7178] sm:text-[14px] sm:leading-6">
          Regístrese, elija el producto que le interesa y le acompañamos para empezar.
        </p>
        <Link
          href={getSignupHref(signupReturnTo)}
          onClick={() => {
            if (signupReturnTo) {
              rememberReturnPath(signupReturnTo);
            }
          }}
          className="mt-3 inline-flex h-9 items-center justify-center rounded-full border border-[#E1251B] bg-white px-4 text-[13px] font-semibold text-[#E1251B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFF8F8]"
        >
          Crear cuenta
        </Link>
      </div>
    </div>
  );
}
