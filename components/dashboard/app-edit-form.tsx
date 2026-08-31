"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { TextAreaField, TextField } from "@/components/auth/auth-form-fields";
import { apiCatalogItems } from "@/components/catalog/content/apis";
import type { DeveloperApp } from "@/lib/developer-apps/types";

import { useDeveloperApps } from "./apps-provider";

export function AppEditForm({ app, onCancel }: { app: DeveloperApp; onCancel: () => void }) {
  const { updateApp } = useDeveloperApps();
  const [name, setName] = useState(app.name);
  const [description, setDescription] = useState(app.description);
  const [productSlugs, setProductSlugs] = useState<string[]>(app.productSlugs);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    updateApp(app.id, {
      name: name.trim(),
      description: description.trim(),
      productSlugs,
    });
    onCancel();
  }

  return (
    <form className="mt-6 space-y-6" noValidate onSubmit={handleSubmit}>
      <TextField
        id="editAppName"
        name="editAppName"
        label="Nombre de la aplicación"
        required
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
        id="editAppDescription"
        name="editAppDescription"
        label="Descripción"
        rows={4}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <fieldset>
        <legend className="text-[15px] font-bold tracking-[0.2px] text-[#141F25]">
          APIs que va a usar <span className="text-[#E1251B]">*</span>
        </legend>
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
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
        >
          Guardar cambios
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-12 items-center justify-center rounded-full border border-[#D5DAE0] bg-white px-7 text-[15px] font-medium text-[#404040] transition-all duration-300 hover:border-[#404040]"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export function AppDeleteControl({ appId, appName }: { appId: string; appName: string }) {
  const router = useRouter();
  const { deleteApp } = useDeveloperApps();
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex h-11 items-center justify-center rounded-full border border-[#E1251B] bg-white px-5 text-[14px] font-medium text-[#E1251B] transition-all duration-300 hover:bg-[#FFF8F8]"
      >
        Eliminar
      </button>
    );
  }

  return (
    <div className="flex max-w-[420px] flex-col gap-3 rounded-[16px] border border-[#F3D0CD] bg-[#FFF8F8] px-4 py-4">
      <p className="text-[14px] leading-6 text-[#404040]">
        ¿Eliminar <span className="font-semibold">{appName}</span>? Esta acción no se puede deshacer.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            deleteApp(appId);
            router.replace("/dashboard");
          }}
          className="inline-flex h-10 items-center justify-center rounded-full bg-[#E1251B] px-5 text-[13px] font-semibold text-white"
        >
          Sí, eliminar
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="inline-flex h-10 items-center justify-center rounded-full border border-[#D5DAE0] bg-white px-5 text-[13px] font-medium text-[#404040]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
