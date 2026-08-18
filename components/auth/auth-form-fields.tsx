import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

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
