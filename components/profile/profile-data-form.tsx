"use client";

import { useEffect, useState, type FormEvent } from "react";

import { SelectField, TextField } from "@/components/auth/auth-form-fields";
import { identificationTypes } from "@/components/auth/content/create-account";
import { useAuth } from "@/components/auth/auth-provider";
import { getAuthErrorMessage } from "@/lib/firebase/errors";
import { getUserProfile, saveUserProfile } from "@/lib/firebase/user-profile";

const PHONE_PATTERN = /^[+()\s.-]*\d[\d+()\s.-]{6,}$/;

type FieldErrors = Record<string, string>;

export function ProfileDataForm() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    getUserProfile(user.uid)
      .then((profile) => {
        if (cancelled || !profile) {
          return;
        }

        setCompanyName(profile.companyName);
        setIdType(profile.idType);
        setIdNumber(profile.idNumber);
        setPhone(profile.phone);
      })
      .catch(() => {
        // El usuario puede completar los datos y guardarlos.
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

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

    if (!companyName.trim()) {
      nextErrors.companyName = "Ingrese el nombre o razón social.";
    }

    if (!idType) {
      nextErrors.idType = "Seleccione el tipo de identificación.";
    }

    if (!idNumber.trim()) {
      nextErrors.idNumber = "Ingrese el número de identificación.";
    }

    if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) {
      nextErrors.phone = "Ingrese un teléfono válido.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);
    setFormError("");
    setSaved(false);

    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      await saveUserProfile(user.uid, {
        companyName: companyName.trim(),
        idType,
        idNumber: idNumber.trim(),
        phone: phone.trim(),
      });
      setSaved(true);
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <div className="h-64 animate-pulse rounded-[18px] bg-[#F2F3F5]" />;
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <TextField
        id="companyName"
        name="companyName"
        label="Nombre o razón social"
        required
        autoComplete="organization"
        placeholder="Mi Empresa S.A.S."
        value={companyName}
        error={errors.companyName}
        onChange={(event) => {
          setCompanyName(event.currentTarget.value);
          clearError("companyName");
          setSaved(false);
        }}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <SelectField
          id="idType"
          name="idType"
          label="Tipo de identificación"
          required
          value={idType}
          error={errors.idType}
          onChange={(event) => {
            setIdType(event.currentTarget.value);
            clearError("idType");
            setSaved(false);
          }}
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
          value={idNumber}
          error={errors.idNumber}
          onChange={(event) => {
            setIdNumber(event.currentTarget.value);
            clearError("idNumber");
            setSaved(false);
          }}
        />
      </div>

      <div>
        <TextField
          id="email"
          name="email"
          type="email"
          label="Correo electrónico"
          autoComplete="email"
          value={user?.email ?? ""}
          readOnly
          disabled
        />
        <p className="mt-1.5 text-[13px] leading-5 text-[#8E8E8E]">
          El correo está ligado a su cuenta y no se puede cambiar aquí.
        </p>
      </div>

      <TextField
        id="phone"
        name="phone"
        type="tel"
        label="Teléfono"
        autoComplete="tel"
        placeholder="+57 300 123 4567"
        value={phone}
        error={errors.phone}
        onChange={(event) => {
          setPhone(event.currentTarget.value);
          clearError("phone");
          setSaved(false);
        }}
      />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C] disabled:translate-y-0 disabled:bg-[#C9CED4]"
        >
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </button>
        {saved ? <p className="text-[14px] text-[#347659]">Los cambios se guardaron.</p> : null}
        {formError ? <p className="text-[14px] text-[#E1251B]">{formError}</p> : null}
      </div>
    </form>
  );
}
