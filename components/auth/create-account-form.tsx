"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { apiCatalogItems } from "@/components/catalog/content/apis";
import { getAuthErrorMessage } from "@/lib/firebase/errors";
import { registerDeveloper } from "@/lib/firebase/register";

import { PasswordField, SelectField, TextAreaField, TextField } from "./auth-form-fields";
import { caseReasons, environments, identificationTypes } from "./content/create-account";

const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Record<string, string>;

type CreateAccountFormProps = {
  initialProduct?: string;
};

export function CreateAccountForm({ initialProduct = "" }: CreateAccountFormProps) {
  const productOptions = useMemo(
    () => Array.from(new Map(apiCatalogItems.map((item) => [item.name, item.name])).values()),
    [],
  );

  const [product, setProduct] = useState(initialProduct);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
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

  function applyFile(nextFile: File | undefined) {
    if (!nextFile) {
      return;
    }

    const isAllowedType = ACCEPTED_TYPES.includes(nextFile.type) || /\.(pdf|png|jpe?g)$/i.test(nextFile.name);
    if (!isAllowedType) {
      setFileError("Solo se permiten archivos PDF, PNG o JPG.");
      setFile(null);
      return;
    }

    if (nextFile.size > MAX_FILE_BYTES) {
      setFileError("El archivo no puede superar 10 MB.");
      setFile(null);
      return;
    }

    setFileError("");
    setFile(nextFile);
  }

  function validate(form: FormData) {
    const nextErrors: FieldErrors = {};
    const email = String(form.get("email") ?? "").trim();
    const idNumber = String(form.get("idNumber") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (!email) {
      nextErrors.email = "Ingrese su correo electrónico.";
    } else if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = "Ingrese un correo válido, por ejemplo nombre@empresa.com.";
    }

    if (!form.get("idType")) {
      nextErrors.idType = "Seleccione el tipo de identificación.";
    }

    if (!idNumber) {
      nextErrors.idNumber = "Ingrese el número de identificación.";
    }

    if (!password) {
      nextErrors.password = "Ingrese una contraseña.";
    } else if (password.length < 8) {
      nextErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirme su contraseña.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    if (!String(form.get("companyName") ?? "").trim()) {
      nextErrors.companyName = "Ingrese el nombre o razón social.";
    }

    if (!form.get("reason")) {
      nextErrors.reason = "Seleccione qué necesita.";
    }

    if (!form.get("environment")) {
      nextErrors.environment = "Seleccione el ambiente.";
    }

    if (!form.get("product")) {
      nextErrors.product = "Seleccione el producto de API.";
    }

    if (!String(form.get("subject") ?? "").trim()) {
      nextErrors.subject = "Ingrese el asunto.";
    }

    if (!String(form.get("description") ?? "").trim()) {
      nextErrors.description = "Cuéntenos brevemente su caso de uso.";
    }

    if (!form.get("terms")) {
      nextErrors.terms = "Debe aceptar los términos y condiciones.";
    }

    if (!form.get("privacy")) {
      nextErrors.privacy = "Debe autorizar el tratamiento de datos personales.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextErrors = validate(formData);
    setErrors(nextErrors);
    setFormError("");

    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(firstField)?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      await registerDeveloper({
        email: String(formData.get("email") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
        idType: String(formData.get("idType") ?? ""),
        idNumber: String(formData.get("idNumber") ?? "").trim(),
        companyName: String(formData.get("companyName") ?? "").trim(),
        reason: String(formData.get("reason") ?? ""),
        environment: String(formData.get("environment") ?? ""),
        product: String(formData.get("product") ?? ""),
        subject: String(formData.get("subject") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        attachmentName: file?.name,
      });
      setSubmitted(true);
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="py-4 sm:py-6">
        <p className="text-[13px] font-medium uppercase tracking-[0.24em] text-[#E1251B]">Cuenta activa</p>
        <h1 className="mt-3 text-[32px] font-bold tracking-[0.3px] text-[#141F25] sm:text-[36px]">Ya puede empezar</h1>
        <p className="mt-4 max-w-[560px] text-[16px] leading-7 text-[#6A7178]">
          Su cuenta quedó activa y guardamos su solicitud de sandbox. Cuando conectemos Apigee, las credenciales
          aparecerán en el portal para que pruebe la API.
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
    <>
      <div className="border-b border-[#E7EAEE] pb-8">
        <h1 className="text-[34px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[40px]">
          Regístrese y empecemos
        </h1>
        <p className="mt-4 text-[16px] leading-7 tracking-[0.2px] text-[#6A7178]">
          Déjenos sus datos y el producto que le interesa. Le acompañamos en los siguientes pasos. Los campos con
          asterisco (*) son obligatorios.
        </p>
      </div>

      <form className="mt-8 space-y-10" noValidate onSubmit={handleSubmit}>
        <FormSection title="Sus datos">
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

          <div className="grid gap-6 md:grid-cols-2">
            <PasswordField
              id="password"
              name="password"
              label="Contraseña"
              required
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              error={errors.password}
              onChange={() => clearError("password")}
            />
            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirmar contraseña"
              required
              autoComplete="new-password"
              placeholder="Repita su contraseña"
              error={errors.confirmPassword}
              onChange={() => clearError("confirmPassword")}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <SelectField
              id="idType"
              name="idType"
              label="Tipo de identificación"
              required
              error={errors.idType}
              onChange={() => clearError("idType")}
            >
              {identificationTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
            <TextField
              id="idNumber"
              name="idNumber"
              label="Número de identificación"
              required
              inputMode="numeric"
              placeholder="1020304050"
              error={errors.idNumber}
              onChange={() => clearError("idNumber")}
            />
          </div>

          <TextField
            id="companyName"
            name="companyName"
            label="Nombre o razón social"
            required
            autoComplete="organization"
            placeholder="Mi Empresa S.A.S."
            error={errors.companyName}
            onChange={() => clearError("companyName")}
          />
        </FormSection>

        <FormSection title="Qué necesita">
          <div className="grid gap-6 md:grid-cols-2">
            <SelectField
              id="reason"
              name="reason"
              label="¿Qué necesita?"
              required
              error={errors.reason}
              onChange={() => clearError("reason")}
            >
              {caseReasons.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
            <SelectField
              id="environment"
              name="environment"
              label="Ambiente"
              required
              error={errors.environment}
              onChange={() => clearError("environment")}
            >
              {environments.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
          </div>

          <SelectField
            id="product"
            name="product"
            label="Producto de API"
            required
            value={product}
            error={errors.product}
            onChange={(event) => {
              setProduct(event.target.value);
              clearError("product");
            }}
          >
            {productOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </SelectField>

          <TextField
            id="subject"
            name="subject"
            label="Asunto"
            required
            placeholder="Solicito acceso a Sandbox para integrar pagos"
            error={errors.subject}
            onChange={() => clearError("subject")}
          />

          <TextAreaField
            id="description"
            name="description"
            label="Descripción"
            required
            rows={6}
            hint="Describa su caso de uso, volumen estimado y el resultado que busca."
            placeholder="Queremos consultar saldos y movimientos para conciliar tesorería en tiempo real..."
            error={errors.description}
            onChange={() => clearError("description")}
          />
        </FormSection>

        <FormSection title="Confirmación">
          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3 text-[15px] text-[#404040]">
              <input
                id="terms"
                type="checkbox"
                name="terms"
                required
                onChange={() => clearError("terms")}
                className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-[4px] border border-[#C9CED4] accent-[#E1251B]"
              />
              <span>
                Acepto los{" "}
                <Link href="#terminos" className="font-semibold text-[#E1251B] underline-offset-2 hover:underline">
                  términos y condiciones
                </Link>{" "}
                <span className="text-[#E1251B]">*</span>
              </span>
            </label>
            {errors.terms ? <p className="pl-8 text-[13px] text-[#E1251B]">{errors.terms}</p> : null}

            <label className="flex cursor-pointer items-start gap-3 text-[15px] text-[#404040]">
              <input
                id="privacy"
                type="checkbox"
                name="privacy"
                required
                onChange={() => clearError("privacy")}
                className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-[4px] border border-[#C9CED4] accent-[#E1251B]"
              />
              <span>
                Autorizo el{" "}
                <Link href="#privacidad" className="font-semibold text-[#E1251B] underline-offset-2 hover:underline">
                  tratamiento de datos personales
                </Link>{" "}
                <span className="text-[#E1251B]">*</span>
              </span>
            </label>
            {errors.privacy ? <p className="pl-8 text-[13px] text-[#E1251B]">{errors.privacy}</p> : null}
          </div>

          <div>
            <p className="text-[15px] font-bold tracking-[0.2px] text-[#141F25]">Archivos adjuntos</p>
            <label
              htmlFor="attachments"
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                applyFile(event.dataTransfer.files[0]);
              }}
              className={`mt-2 flex min-h-[132px] cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed px-6 py-7 text-center transition-colors ${
                isDragging ? "border-[#E1251B] bg-[#E1251B]/4" : "border-[#C9CED6] bg-white hover:border-[#E1251B]/50"
              }`}
            >
              <UploadIcon />
              <p className="mt-3 text-[15px] font-medium text-[#E1251B]">Elegir un archivo o arrastrar y soltar uno aquí</p>
              <p className="mt-1 text-[13px] text-[#6A7178]">PDF, PNG o JPG · máx 10 MB</p>
            </label>
            <input
              id="attachments"
              name="attachments"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
              className="sr-only"
              onChange={(event) => applyFile(event.target.files?.[0])}
            />
            {file ? (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-[10px] border border-[#E7EAEE] bg-[#F8F9FB] px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium text-[#141F25]">{file.name}</p>
                  <p className="text-[12px] text-[#6A7178]">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setFileError("");
                  }}
                  className="shrink-0 text-[13px] font-medium text-[#6A7178] transition-colors hover:text-[#E1251B]"
                >
                  Quitar
                </button>
              </div>
            ) : null}
            {fileError ? <p className="mt-2 text-[13px] text-[#E1251B]">{fileError}</p> : null}
          </div>

          <div className="flex flex-col items-start gap-4 pt-1 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)] disabled:translate-y-0 disabled:bg-[#C9CED4] disabled:shadow-none"
            >
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
              {isSubmitting ? null : <span aria-hidden="true">→</span>}
            </button>
            <p className="text-[15px] text-[#5B636A]">
              ¿Ya tiene cuenta?{" "}
              <Link href="/iniciar-sesion" className="font-medium text-[#141F25] transition-colors hover:text-[#E1251B]">
                Inicie sesión
              </Link>
            </p>
          </div>
          {formError ? <p className="text-[13px] text-[#E1251B]">{formError}</p> : null}
        </FormSection>
      </form>
    </>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-5">
      <h2 className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">{title}</h2>
      {children}
    </section>
  );
}

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="5" y="8" width="14" height="14" rx="2.2" stroke="#2A3239" strokeWidth="1.6" />
      <path
        d="M11 12V5.5M11 5.5L8.2 8.2M11 5.5L13.8 8.2"
        stroke="#2A3239"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
