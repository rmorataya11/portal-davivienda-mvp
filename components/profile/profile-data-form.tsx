"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";

import { FieldLabel, SelectField, TextField } from "@/components/auth/auth-form-fields";
import { identificationTypes } from "@/components/auth/content/create-account";
import { useAuth } from "@/components/auth/auth-provider";
import { accountInitials } from "@/lib/account/display";
import { getAuthErrorMessage } from "@/lib/firebase/errors";
import { getUserProfile, saveNotifyBeforeExpiration, saveUserProfile } from "@/lib/firebase/user-profile";

import { AccountAvatar } from "./account-avatar";

const PHONE_PATTERN = /^[+()\s.-]*\d[\d+()\s.-]{6,}$/;

type FieldErrors = Record<string, string>;

type ProfileSnapshot = {
  accountName: string;
  companyName: string;
  idType: string;
  idNumber: string;
  phone: string;
};

function formatLastSignIn(value?: string) {
  if (!value) {
    return "No disponible";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "No disponible";
  }

  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function identificationNumberCopy(idType: string) {
  if (idType === "nit") {
    return { label: "NIT", placeholder: "900123456-7" };
  }

  if (idType === "pasaporte") {
    return { label: "Número de pasaporte", placeholder: "AU123456" };
  }

  if (idType === "ppt") {
    return { label: "Número de PPT", placeholder: "123456789" };
  }

  if (idType === "cc" || idType === "ce") {
    return { label: "Número de cédula", placeholder: "1020304050" };
  }

  return { label: "Número de identificación", placeholder: "1020304050" };
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#8E8E8E]">{children}</h3>;
}

export function ProfileDataForm() {
  const { user, setDisplayName, setCompanyName: setAccountCompanyName } = useAuth();
  const [accountName, setAccountName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [initial, setInitial] = useState<ProfileSnapshot | null>(null);
  const [notifyBeforeExpiration, setNotifyBeforeExpiration] = useState(false);
  const [notifySaving, setNotifySaving] = useState(false);
  const [notifyError, setNotifyError] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const idNumberCopy = identificationNumberCopy(idType);
  const avatarInitials = accountInitials(companyName, accountName, user?.email);
  const isDirty = useMemo(() => {
    if (!initial) {
      return false;
    }

    return (
      accountName !== initial.accountName ||
      companyName !== initial.companyName ||
      idType !== initial.idType ||
      idNumber !== initial.idNumber ||
      phone !== initial.phone
    );
  }, [accountName, companyName, idNumber, idType, initial, phone]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    getUserProfile(user.uid)
      .then((profile) => {
        if (cancelled) {
          return;
        }

        const snapshot: ProfileSnapshot = {
          accountName: profile?.displayName ?? "",
          companyName: profile?.companyName ?? "",
          idType: profile?.idType ?? "",
          idNumber: profile?.idNumber ?? "",
          phone: profile?.phone ?? "",
        };

        setAccountName(snapshot.accountName);
        setCompanyName(snapshot.companyName);
        setIdType(snapshot.idType);
        setIdNumber(snapshot.idNumber);
        setPhone(snapshot.phone);
        setNotifyBeforeExpiration(profile?.notifyBeforeExpiration === true);
        setInitial(snapshot);
      })
      .catch(() => {
        if (!cancelled) {
          setInitial({ accountName: "", companyName: "", idType: "", idNumber: "", phone: "" });
        }
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

  function discardChanges() {
    if (!initial) {
      return;
    }

    setAccountName(initial.accountName);
    setCompanyName(initial.companyName);
    setIdType(initial.idType);
    setIdNumber(initial.idNumber);
    setPhone(initial.phone);
    setErrors({});
    setFormError("");
    setSaved(false);
  }

  function validate() {
    const nextErrors: FieldErrors = {};

    if (!accountName.trim()) {
      nextErrors.displayName = "Ingrese el nombre para mostrar.";
    }

    if (!companyName.trim()) {
      nextErrors.companyName = "Ingrese el nombre o razón social.";
    }

    if (!idType) {
      nextErrors.idType = "Seleccione el tipo de identificación.";
    }

    if (!idNumber.trim()) {
      nextErrors.idNumber = `Ingrese el ${idNumberCopy.label.toLowerCase()}.`;
    }

    if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) {
      nextErrors.phone = "Ingrese un teléfono válido.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !isDirty) {
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
      const snapshot: ProfileSnapshot = {
        accountName: accountName.trim(),
        companyName: companyName.trim(),
        idType,
        idNumber: idNumber.trim(),
        phone: phone.trim(),
      };

      await saveUserProfile(user.uid, {
        displayName: snapshot.accountName,
        companyName: snapshot.companyName,
        idType: snapshot.idType,
        idNumber: snapshot.idNumber,
        phone: snapshot.phone,
      });
      setAccountName(snapshot.accountName);
      setCompanyName(snapshot.companyName);
      setIdNumber(snapshot.idNumber);
      setPhone(snapshot.phone);
      setInitial(snapshot);
      setDisplayName(snapshot.accountName);
      setAccountCompanyName(snapshot.companyName);
      setSaved(true);
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleNotifyToggle() {
    if (!user || notifySaving) {
      return;
    }

    const next = !notifyBeforeExpiration;
    setNotifyBeforeExpiration(next);
    setNotifySaving(true);
    setNotifyError("");

    try {
      await saveNotifyBeforeExpiration(user.uid, next);
    } catch (error) {
      setNotifyBeforeExpiration(!next);
      setNotifyError(getAuthErrorMessage(error));
    } finally {
      setNotifySaving(false);
    }
  }

  if (loading) {
    return <div className="h-64 animate-pulse rounded-[18px] bg-[#F2F3F5]" />;
  }

  return (
    <form className="space-y-8" noValidate onSubmit={handleSubmit}>
      <section className="space-y-4">
        <SectionTitle>Identidad</SectionTitle>
        <div className="flex items-start gap-4">
          <div className="pt-7">
            <AccountAvatar name={avatarInitials} size="lg" />
          </div>
          <div className="min-w-0 flex-1">
            <TextField
              id="displayName"
              name="displayName"
              label="Nombre para mostrar"
              required
              autoComplete="name"
              placeholder="Ana Gómez"
              value={accountName}
              error={errors.displayName}
              onChange={(event) => {
                setAccountName(event.currentTarget.value);
                clearError("displayName");
                setSaved(false);
              }}
            />
            <p className="mt-1.5 text-[13px] leading-5 text-[#8E8E8E]">Así aparece en el menú del portal.</p>
          </div>
        </div>
        <p className="text-[13px] text-[#8E8E8E]">Última sesión iniciada: {formatLastSignIn(user?.metadata.lastSignInTime)}</p>
      </section>

      <section className="space-y-4">
        <SectionTitle>Empresa</SectionTitle>
        <TextField
          id="companyName"
          name="companyName"
          label="Razón social"
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
            label={idNumberCopy.label}
            required
            inputMode="numeric"
            placeholder={idNumberCopy.placeholder}
            value={idNumber}
            error={errors.idNumber}
            onChange={(event) => {
              setIdNumber(event.currentTarget.value);
              clearError("idNumber");
              setSaved(false);
            }}
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>Contacto</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <FieldLabel>Correo electrónico</FieldLabel>
            <p className="mt-2 flex h-12 items-center rounded-[10px] bg-[#F8F9FB] px-4 text-[15px] text-[#6A7178]">
              {user?.email ?? "—"}
            </p>
            <p className="mt-1.5 text-[13px] leading-5 text-[#8E8E8E]">No se puede cambiar desde el portal.</p>
          </div>
          <div>
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
            <p className="mt-1.5 text-[13px] leading-5 text-[#8E8E8E]">Opcional.</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>Preferencias</SectionTitle>
        <div className="flex items-center justify-between gap-3 rounded-[12px] bg-[#F8F9FB] px-4 py-3">
          <p id="notify-expiration-label" className="text-[14px] leading-5 text-[#404040]">
            Avisarme por email cuando mi sandbox esté por vencer
          </p>
          <button
            type="button"
            role="switch"
            aria-checked={notifyBeforeExpiration}
            aria-labelledby="notify-expiration-label"
            disabled={notifySaving}
            onClick={handleNotifyToggle}
            className={`relative h-7 w-12 shrink-0 overflow-hidden rounded-full p-0 transition-colors duration-300 ${
              notifyBeforeExpiration ? "bg-[#E1251B]" : "bg-[#D5DAE0]"
            } disabled:opacity-60`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                notifyBeforeExpiration ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        {notifyError ? <p className="text-[14px] text-[#E1251B]">{notifyError}</p> : null}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C] disabled:translate-y-0 disabled:bg-[#C9CED4]"
        >
          {isSubmitting ? "Guardando..." : saved && !isDirty ? "Guardado" : "Guardar cambios"}
        </button>
        {isDirty ? (
          <button
            type="button"
            onClick={discardChanges}
            className="inline-flex h-12 items-center justify-center rounded-full px-5 text-[15px] font-medium text-[#6A7178] transition-colors hover:text-[#141F25]"
          >
            Descartar cambios
          </button>
        ) : null}
        {formError ? <p className="text-[14px] text-[#E1251B]">{formError}</p> : null}
      </div>
    </form>
  );
}
