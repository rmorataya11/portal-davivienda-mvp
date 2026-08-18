import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const controlClassName =
  "h-12 w-full rounded-[10px] border border-[#D5DAE0] bg-white px-4 text-[15px] text-[#141F25] outline-none transition-colors placeholder:text-[#A8AEB5] focus:border-[#E1251B]";

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

export function TextField({
  id,
  label,
  required,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
}) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <input id={id} required={required} className={`mt-2 ${controlClassName}`} {...props} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  required,
  placeholder = "-",
  children,
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <div className="relative mt-2">
        <select
          id={id}
          required={required}
          className={`${controlClassName} appearance-none pr-11 ${props.value ? "text-[#141F25]" : "text-[#A8AEB5]"}`}
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
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  hint,
  required,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      {hint ? <p className="mt-1 text-[14px] leading-6 text-[#8A9096]">{hint}</p> : null}
      <textarea id={id} required={required} className={`mt-2 min-h-[160px] ${controlClassName} h-auto py-3`} {...props} />
    </div>
  );
}
