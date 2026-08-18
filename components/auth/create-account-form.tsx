"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { apiCatalogItems } from "@/components/catalog/content/apis";

import { FieldLabel, SelectField, TextField } from "./auth-form-fields";
import { caseReasons, environments, identificationTypes } from "./content/create-account";

const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

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
  const [submitted, setSubmitted] = useState(false);

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="py-6">
        <p className="text-[13px] font-medium uppercase tracking-[0.24em] text-[#E1251B]">Solicitud enviada</p>
        <h2 className="mt-3 text-[32px] font-bold tracking-[0.3px] text-[#141F25]">Recibimos sus datos</h2>
        <p className="mt-4 max-w-[640px] text-[16px] leading-7 text-[#6A7178]">
          Un integrante del equipo revisará su interés y le acompañará en los siguientes pasos para activar su cuenta
          de desarrollador.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <TextField
        id="email"
        name="email"
        type="email"
        label="Correo electrónico"
        required
        autoComplete="email"
        placeholder="nombre@empresa.com"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <SelectField id="idType" name="idType" label="Tipo de Identificación" required>
          {identificationTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
        <TextField
          id="idNumber"
          name="idNumber"
          label="Número de Identificación"
          required
          inputMode="numeric"
          placeholder="1020304050"
        />
      </div>

      <TextField
        id="companyName"
        name="companyName"
        label="Nombre o razón social"
        required
        autoComplete="organization"
        placeholder="Mi Empresa S.A.S."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <SelectField id="reason" name="reason" label="Motivo del caso" required>
          {caseReasons.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
        <SelectField id="environment" name="environment" label="Ambiente" required>
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
        onChange={(event) => setProduct(event.target.value)}
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
      />

      <div>
        <FieldLabel htmlFor="description" required>
          Descripción
        </FieldLabel>
        <p className="mt-1 text-[14px] leading-6 text-[#8A9096]">
          Ingrese los detalles de su requerimiento. Un integrante de nuestro equipo le responderá en breve.
        </p>
        <div className="mt-2 overflow-hidden rounded-[10px] border border-[#D5DAE0] bg-white focus-within:border-[#E1251B]">
          <div className="flex flex-wrap items-center gap-1 border-b border-[#E7EAEE] px-3 py-2 text-[#5B636A]">
            <span className="mr-1 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[13px]">
              Párrafo
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
            <span className="mx-1 h-4 w-px bg-[#E0E4E8]" />
            <ToolbarIcon label="Negrita">
              <span className="text-[13px] font-bold">B</span>
            </ToolbarIcon>
            <ToolbarIcon label="Cursiva">
              <span className="text-[13px] italic">I</span>
            </ToolbarIcon>
            <span className="mx-1 h-4 w-px bg-[#E0E4E8]" />
            <ToolbarIcon label="Código">
              <span className="text-[13px]">&lt;&gt;</span>
            </ToolbarIcon>
            <ToolbarIcon label="Enlace">
              <LinkIcon />
            </ToolbarIcon>
            <ToolbarIcon label="Documento">
              <DocIcon />
            </ToolbarIcon>
            <ToolbarIcon label="Comentario">
              <CommentIcon />
            </ToolbarIcon>
            <ToolbarIcon label="Actualizar">
              <RefreshIcon />
            </ToolbarIcon>
          </div>
          <textarea
            id="description"
            name="description"
            required
            rows={7}
            placeholder="Describa su caso de uso, volumen estimado y APIs de interés..."
            className="min-h-[168px] w-full resize-y bg-transparent px-4 py-3 text-[15px] text-[#141F25] outline-none placeholder:text-[#A8AEB5]"
          />
        </div>
      </div>

      <div className="space-y-3 pt-1">
        <label className="flex cursor-pointer items-start gap-3 text-[15px] font-medium text-[#E1251B]">
          <input
            type="checkbox"
            name="terms"
            required
            className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-[4px] border border-[#C9CED4] accent-[#E1251B]"
          />
          <span>
            Acepto los{" "}
            <Link href="#terminos" className="font-bold underline-offset-2 hover:underline">
              términos y condiciones
            </Link>{" "}
            <span>*</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-[15px] font-medium text-[#E1251B]">
          <input
            type="checkbox"
            name="privacy"
            required
            className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-[4px] border border-[#C9CED4] accent-[#E1251B]"
          />
          <span>
            Autorizo el{" "}
            <Link href="#privacidad" className="font-bold underline-offset-2 hover:underline">
              tratamiento de datos personales
            </Link>{" "}
            <span>*</span>
          </span>
        </label>
      </div>

      <div>
        <FieldLabel htmlFor="attachments">Archivos adjuntos</FieldLabel>
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
          className={`mt-2 flex min-h-[148px] cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed px-6 py-8 text-center transition-colors ${
            isDragging ? "border-[#E1251B] bg-[#E1251B]/4" : "border-[#C9CED6] bg-white"
          }`}
        >
          <UploadIcon />
          <p className="mt-3 text-[15px] font-medium text-[#E1251B]">Elegir un archivo o arrastrar y soltar uno aquí</p>
          <p className="mt-1 text-[13px] text-[#6A7178]">PDF, PNG o JPG · máx 10 MB</p>
          {file ? (
            <p className="mt-3 text-[13px] font-medium text-[#141F25]">
              {file.name} · {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          ) : null}
        </label>
        <input
          id="attachments"
          name="attachments"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
          className="sr-only"
          onChange={(event) => applyFile(event.target.files?.[0])}
        />
        {fileError ? <p className="mt-2 text-[13px] text-[#E1251B]">{fileError}</p> : null}
      </div>

      <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)]"
        >
          Enviar solicitud
          <span aria-hidden="true">→</span>
        </button>
        <p className="text-[15px] text-[#5B636A]">
          ¿Ya tiene cuenta?{" "}
          <Link href="/iniciar-sesion" className="font-medium text-[#141F25] transition-colors hover:text-[#E1251B]">
            Inicie sesión
          </Link>
        </p>
      </div>
    </form>
  );
}

function ToolbarIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md" title={label} aria-hidden="true">
      {children}
    </span>
  );
}

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="5" y="8" width="14" height="14" rx="2.2" stroke="#2A3239" strokeWidth="1.6" />
      <path d="M11 12V5.5M11 5.5L8.2 8.2M11 5.5L13.8 8.2" stroke="#2A3239" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M6 8.2L8.2 6M5.2 6.3L4.2 7.3a2.1 2.1 0 0 0 3 3l1-1M8.8 7.7l1-1a2.1 2.1 0 0 0-3-3l-1 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" aria-hidden="true">
      <path d="M3 1.5h5.2L11 4.2V12.5H3V1.5Z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 1.5V4.4H11" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 2.5h10v7.2H6.2L3.2 12V9.7H2V2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M11.5 7A4.5 4.5 0 1 1 9.4 3.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M9.1 1.8v2.4H11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
