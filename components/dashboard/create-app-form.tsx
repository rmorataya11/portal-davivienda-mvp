"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { TextAreaField, TextField } from "@/components/auth/auth-form-fields";
import { apiCatalogItems } from "@/components/catalog/content/apis";

import { useDeveloperApps } from "./apps-provider";

export function CreateAppForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createApp } = useDeveloperApps();
  const lockedProduct = apiCatalogItems.find((item) => item.slug === (searchParams.get("producto") ?? ""));

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [productSlugs, setProductSlugs] = useState<string[]>(lockedProduct ? [lockedProduct.slug] : []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleProduct(slug: string) {
    setProductSlugs((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
    setErrors((current) => {
      if (!current.products) {
        return current;
      }
      const next = { ...current };
      delete next.products;
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) {
      nextErrors.name = "Ingrese un nombre para la aplicación.";
    }

    if (productSlugs.length === 0) {
      nextErrors.products = "Seleccione al menos una API.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    const app = createApp({
      name: name.trim(),
      description: description.trim(),
      productSlugs,
    });
    router.replace(`/dashboard/apps/${app.id}`);
  }

  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.28px] text-[#707070] transition-colors duration-300 hover:text-[#E1251B]"
      >
        Volver al dashboard
      </Link>

      <div className="mt-6 rounded-[32px] border border-[#E7EAEE] bg-white px-6 py-7 shadow-[0_18px_50px_rgba(20,31,37,0.06)] sm:px-8 sm:py-8">
        <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#8E8E8E]">Nueva aplicación</p>
        <h1 className="mt-3 text-[32px] font-bold tracking-[0.3px] text-[#141F25] sm:text-[36px]">
          {lockedProduct ? `Cree una app para ${lockedProduct.name}` : "Cree una app de sandbox"}
        </h1>
        <div className="mt-4 h-1.5 w-14 rounded-full bg-[#E1251B]" />
        <p className="mt-4 max-w-[640px] text-[16px] leading-7 text-[#6A7178]">
          {lockedProduct
            ? "Solo necesita un nombre. Las credenciales de sandbox quedan asociadas a esta API. Si más adelante quiere usar otro producto, puede vincularlo desde el detalle técnico."
            : "Indique qué APIs va a consumir. El ambiente inicial es sandbox; cuando valide la integración, solicite producción desde el detalle de esta app."}
        </p>

        <form className="mt-8 space-y-6" noValidate onSubmit={handleSubmit}>
          <TextField
            id="appName"
            name="appName"
            label="Nombre de la aplicación"
            required
            placeholder="Billetera corporativa"
            value={name}
            error={errors.name}
            onChange={(event) => {
              setName(event.target.value);
              setErrors((current) => {
                if (!current.name) {
                  return current;
                }
                const next = { ...current };
                delete next.name;
                return next;
              });
            }}
          />
          <TextAreaField
            id="appDescription"
            name="appDescription"
            label="Descripción"
            rows={4}
            hint="Opcional. Ayuda a su equipo a identificar para qué sirve esta app."
            placeholder="Conciliación de pagos y consulta de estado para el canal digital."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          {!lockedProduct ? (
            <fieldset>
              <legend className="text-[15px] font-bold tracking-[0.2px] text-[#141F25]">
                APIs que va a usar <span className="text-[#E1251B]">*</span>
              </legend>
              <p className="mt-1 text-[14px] leading-6 text-[#8A9096]">
                Elija los productos que consumirá esta aplicación.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {apiCatalogItems.map((item) => {
                  const selected = productSlugs.includes(item.slug);

                  return (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => toggleProduct(item.slug)}
                      className={`rounded-full border px-4 py-2 text-[14px] font-medium transition-all duration-300 ${
                        selected
                          ? "border-[#E1251B] bg-[#E1251B] text-white"
                          : "border-[#D5DAE0] bg-white text-[#404040] hover:border-[#E1251B] hover:text-[#E1251B]"
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
              {errors.products ? <p className="mt-2 text-[13px] text-[#E1251B]">{errors.products}</p> : null}
            </fieldset>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C] disabled:translate-y-0 disabled:bg-[#C9CED4]"
          >
            {isSubmitting ? "Creando..." : "Crear aplicación"}
          </button>
        </form>
      </div>
    </div>
  );
}
