"use client";

import { useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

const controlClassName =
  "h-12 w-full rounded-[10px] border bg-white px-4 text-[15px] text-[#141F25] outline-none transition-[border-color,box-shadow] placeholder:text-[#A8AEB5] hover:border-[#B8BFC6] focus:border-[#E1251B] focus:shadow-[0_0_0_3px_rgba(225,37,27,0.12)]";

function fieldBorder(error?: string) {
  return error ? "border-[#E1251B]" : "border-[#D5DAE0]";
}

export function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="text-[15px] font-bold tracking-[0.2px] text-[#141F25]">
      {children}
      {required ? <span className="text-[#E1251B]"> *</span> : null}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="mt-1.5 text-[13px] leading-5 text-[#E1251B]">
      {message}
    </p>
  );
}

export function TextField({
  id,
  label,
  required,
  error,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
  error?: string;
}) {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <input
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`mt-2 ${controlClassName} ${fieldBorder(error)}`}
        {...props}
      />
      <FieldError id={errorId ?? ""} message={error} />
    </div>
  );
}

export function PasswordField({
  id,
  label,
  required,
  error,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);
  const errorId = id ? `${id}-error` : undefined;

  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <div className="relative mt-2">
        <input
          id={id}
          required={required}
          autoComplete="current-password"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${controlClassName} pr-12 ${fieldBorder(error)}`}
          {...props}
          type={visible ? "text" : "password"}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#6A7178] transition-colors hover:text-[#141F25]"
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      <FieldError id={errorId ?? ""} message={error} />
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M2.5 10s2.8-5.5 7.5-5.5S17.5 10 17.5 10s-2.8 5.5-7.5 5.5S2.5 10 2.5 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 3.5L17 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M8.2 7.4A2.8 2.8 0 0 1 12.6 11.8M5.2 5.8C3.5 7 2.5 10 2.5 10s2.8 5.5 7.5 5.5c1.5 0 2.8-.4 3.9-1M14.7 13.3C16.3 12.1 17.5 10 17.5 10s-2.8-5.5-7.5-5.5c-.6 0-1.1.06-1.6.16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SelectField({
  id,
  label,
  required,
  error,
  placeholder = "Seleccione",
  children,
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
}) {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <div className="relative mt-2">
        <select
          id={id}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${controlClassName} appearance-none pr-11 ${fieldBorder(error)}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6A7178]"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path d="M4 6.5L8 10.5L12 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <FieldError id={errorId ?? ""} message={error} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  hint,
  required,
  error,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
}) {
  const errorId = id ? `${id}-error` : undefined;
  const hintId = id ? `${id}-hint` : undefined;

  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      {hint ? (
        <p id={hintId} className="mt-1 text-[14px] leading-6 text-[#8A9096]">
          {hint}
        </p>
      ) : null}
      <textarea
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={[hint ? hintId : undefined, error ? errorId : undefined].filter(Boolean).join(" ") || undefined}
        className={`mt-2 min-h-[148px] ${controlClassName} h-auto py-3 ${fieldBorder(error)}`}
        {...props}
      />
      <FieldError id={errorId ?? ""} message={error} />
    </div>
  );
}
