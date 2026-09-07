"use client";

import { useEffect, useId, useState, type FormEvent } from "react";

import { SelectField, TextAreaField, TextField } from "@/components/auth/auth-form-fields";
import { apiCatalogItems } from "@/components/catalog/content/apis";
import { RadioGroup } from "@/components/contracting/radio-group";
import { saveSupportCase, type SupportCaseSeverity } from "@/lib/support/cases";

const severityOptions = [
  { value: "bloqueante", label: "Bloqueante (producción afectada o caída)" },
  { value: "importante", label: "Importante (bug no bloqueante, afecta funcionalidad)" },
  { value: "consulta", label: "Consulta general (pregunta, no es un problema técnico)" },
];

type FieldErrors = Record<string, string>;

export function SupportCaseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const titleId = useId();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [apiSlug, setApiSlug] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isSubmitting, onClose, open]);

  useEffect(() => {
    if (open) {
      return;
    }

    setTitle("");
    setDescription("");
    setSeverity("");
    setApiSlug("");
    setErrors({});
    setIsSubmitting(false);
    setSubmitted(false);
  }, [open]);

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

  function validate() {
    const nextErrors: FieldErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Ingrese un título corto para el caso.";
    }

    if (!description.trim()) {
      nextErrors.description = "Describa el problema o la consulta.";
    }

    if (!severity) {
      nextErrors.severity = "Seleccione la severidad del caso.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 400));

    saveSupportCase({
      title: title.trim(),
      description: description.trim(),
      severity: severity as SupportCaseSeverity,
      apiSlug: apiSlug || null,
    });

    setIsSubmitting(false);
    setSubmitted(true);
    window.setTimeout(() => {
      onClose();
    }, 2200);
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        className="absolute inset-0 bg-[#141F25]/45"
        aria-label="Cerrar"
        onClick={() => {
          if (!isSubmitting) {
            onClose();
          }
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[80vh] w-full max-w-[560px] overflow-y-auto rounded-[24px] bg-white px-6 py-6 shadow-[0_24px_70px_rgba(20,31,37,0.18)] sm:px-8 sm:py-8"
      >
        {submitted ? (
          <div>
            <h2 id={titleId} className="text-[24px] font-bold tracking-[0.3px] text-[#141F25]">
              Caso creado
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[#5B636A]">Caso creado. Le contactaremos pronto.</p>
          </div>
        ) : (
          <>
            <h2 id={titleId} className="text-[24px] font-bold tracking-[0.3px] text-[#141F25]">
              Crear solicitud de soporte
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-[#6A7178]">
              Cuéntenos qué ocurrió. Revisamos el caso y le respondemos por este canal.
            </p>

            <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit}>
              <TextField
                id="support-title"
                name="title"
                label="Título del caso"
                required
                value={title}
                error={errors.title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  clearError("title");
                }}
              />

              <TextAreaField
                id="support-description"
                name="description"
                label="Descripción del problema"
                required
                value={description}
                error={errors.description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  clearError("description");
                }}
              />

              <RadioGroup
                legend="Severidad"
                name="severity"
                required
                error={errors.severity}
                options={severityOptions}
                value={severity}
                onChange={(value) => {
                  setSeverity(value);
                  clearError("severity");
                }}
              />

              <SelectField
                id="support-api"
                name="apiSlug"
                label="API afectada"
                placeholder="No aplica / General"
                value={apiSlug}
                onChange={(event) => setApiSlug(event.target.value)}
              >
                {apiCatalogItems.map((api) => (
                  <option key={api.slug} value={api.slug}>
                    {api.name}
                  </option>
                ))}
              </SelectField>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C] disabled:translate-y-0 disabled:bg-[#C9CED4]"
                >
                  {isSubmitting ? "Enviando..." : "Enviar caso"}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={onClose}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[#D5DAE0] bg-white px-6 text-[14px] font-semibold text-[#404040] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E1251B] hover:text-[#E1251B] disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
