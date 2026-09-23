"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { FieldLabel, SelectField, TextField } from "@/components/auth/auth-form-fields";
import { identificationTypes } from "@/components/auth/content/create-account";
import { useAuth } from "@/components/auth/auth-provider";
import { accountInitials } from "@/lib/account/display";

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

function identificationNumberCopy(idType: string, t: (key: string) => string) {
  if (idType === "nit") {
    return { label: t("nitNumber"), placeholder: "0614-290191-101-3" };
  }

  if (idType === "dui") {
    return { label: t("duiNumber"), placeholder: "00000000-0" };
  }

  return { label: t("idNumber"), placeholder: "00000000-0" };
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8E8E8E]">{children}</h3>;
}

function ProfileCard({ children }: { children: ReactNode }) {
  return <section className="rounded-[24px] border border-[#E7EAEE] bg-white px-5 py-6 sm:px-6">{children}</section>;
}

export function ProfileDataForm() {
  const t = useTranslations("Profile.data");
  const authT = useTranslations("Auth");
  const { user, developerId, setDisplayName, setCompanyName: setAccountCompanyName } = useAuth();
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

  const idNumberCopy = identificationNumberCopy(idType, t);
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
    const lookupId = developerId ?? user?.uid;

    if (!lookupId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetch(`/api/developers/${lookupId}/profile`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(t("loadFailed"));
        }

        return (await response.json()) as {
          fullName?: string;
          companyName?: string;
          documentType?: string;
          documentId?: string;
          phone?: string;
          notifyBeforeExpiration?: boolean;
        };
      })
      .then((profile) => {
        if (cancelled) {
          return;
        }

        const snapshot: ProfileSnapshot = {
          accountName: profile.fullName ?? "",
          companyName: profile.companyName ?? "",
          idType: profile.documentType ?? "",
          idNumber: profile.documentId ?? "",
          phone: profile.phone ?? "",
        };

        setAccountName(snapshot.accountName);
        setCompanyName(snapshot.companyName);
        setIdType(snapshot.idType);
        setIdNumber(snapshot.idNumber);
        setPhone(snapshot.phone);
        setNotifyBeforeExpiration(profile.notifyBeforeExpiration !== false);
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
  }, [developerId, t, user]);

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
      nextErrors.displayName = t("displayNameRequired");
    }

    if (!companyName.trim()) {
      nextErrors.companyName = t("companyNameRequired");
    }

    if (!idType) {
      nextErrors.idType = t("idTypeRequired");
    }

    if (!idNumber.trim()) {
      nextErrors.idNumber = t("idNumberRequired", { field: idNumberCopy.label.toLowerCase() });
    }

    if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) {
      nextErrors.phone = t("phoneInvalid");
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const lookupId = developerId ?? user?.uid;
    if (!lookupId || !isDirty) {
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

      const response = await fetch(`/api/developers/${lookupId}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: snapshot.accountName,
          companyName: snapshot.companyName,
          documentType: snapshot.idType,
          documentId: snapshot.idNumber,
          phone: snapshot.phone,
        }),
      });

      if (!response.ok) {
        throw new Error(t("saveFailed"));
      }
      setAccountName(snapshot.accountName);
      setCompanyName(snapshot.companyName);
      setIdNumber(snapshot.idNumber);
      setPhone(snapshot.phone);
      setInitial(snapshot);
      setDisplayName(snapshot.accountName);
      setAccountCompanyName(snapshot.companyName);
      setSaved(true);
    } catch {
      setFormError(t("saveFailed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleNotifyToggle() {
    const lookupId = developerId ?? user?.uid;
    if (!lookupId || notifySaving) {
      return;
    }

    const next = !notifyBeforeExpiration;
    setNotifyBeforeExpiration(next);
    setNotifySaving(true);
    setNotifyError("");

    try {
      const response = await fetch(`/api/developers/${lookupId}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifyBeforeExpiration: next }),
      });

      if (!response.ok) {
        throw new Error(t("notifyFailed"));
      }
    } catch {
      setNotifyBeforeExpiration(!next);
      setNotifyError(t("notifyFailed"));
    } finally {
      setNotifySaving(false);
    }
  }

  if (loading) {
    return <div className="h-64 animate-pulse rounded-[18px] bg-[#F2F3F5]" />;
  }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit}>
      <ProfileCard>
        <SectionTitle>{t("identity")}</SectionTitle>
        <div className="mt-4 flex items-start gap-4">
          <div className="mt-8 shrink-0">
            <AccountAvatar name={avatarInitials} size="lg" />
          </div>
          <div className="min-w-0 flex-1">
            <TextField
              id="displayName"
              name="displayName"
              label={t("displayName")}
              required
              autoComplete="name"
              placeholder={t("displayNamePlaceholder")}
              value={accountName}
              error={errors.displayName}
              onChange={(event) => {
                setAccountName(event.currentTarget.value);
                clearError("displayName");
                setSaved(false);
              }}
            />
            <p className="mt-1.5 text-[13px] leading-5 text-[#707070]">{t("displayNameHint")}</p>
          </div>
        </div>
      </ProfileCard>

      <ProfileCard>
        <SectionTitle>{t("company")}</SectionTitle>
        <div className="mt-4 space-y-4">
          <TextField
            id="companyName"
            name="companyName"
            label={t("companyName")}
            required
            autoComplete="organization"
            placeholder={t("companyNamePlaceholder")}
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
              label={t("idType")}
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
                  {authT(`signup.idTypes.${option.value}`)}
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
        </div>
      </ProfileCard>

      <ProfileCard>
        <SectionTitle>{t("contact")}</SectionTitle>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <FieldLabel>{t("email")}</FieldLabel>
            <p className="mt-2 flex h-12 items-center rounded-[10px] bg-[#F8F9FB] px-4 text-[15px] text-[#707070]">
              {user?.email ?? "—"}
            </p>
            <p className="mt-1.5 text-[13px] leading-5 text-[#707070]">{t("emailLocked")}</p>
          </div>
          <div>
            <TextField
              id="phone"
              name="phone"
              type="tel"
              label={t("phone")}
              autoComplete="tel"
              placeholder={t("phonePlaceholder")}
              value={phone}
              error={errors.phone}
              onChange={(event) => {
                setPhone(event.currentTarget.value);
                clearError("phone");
                setSaved(false);
              }}
            />
            <p className="mt-1.5 text-[13px] leading-5 text-[#707070]">{t("phoneOptional")}</p>
          </div>
        </div>
      </ProfileCard>

      <ProfileCard>
        <SectionTitle>{t("preferences")}</SectionTitle>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-[12px] bg-[#F8F9FB] px-4 py-3">
          <p id="notify-expiration-label" className="text-[14px] leading-5 text-[#404040]">
            {t("notifyExpiration")}
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
        {notifyError ? <p className="mt-3 text-[14px] text-[#E1251B]">{notifyError}</p> : null}
      </ProfileCard>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#C01F16] disabled:bg-[#C9CED4]"
        >
          {isSubmitting ? t("saving") : saved && !isDirty ? t("saved") : t("save")}
        </button>
        {isDirty ? (
          <button
            type="button"
            onClick={discardChanges}
            className="inline-flex h-12 items-center justify-center rounded-full px-5 text-[15px] font-medium text-[#707070] transition-colors hover:text-[#404040]"
          >
            {t("discard")}
          </button>
        ) : null}
        {formError ? <p className="text-[14px] text-[#E1251B]">{formError}</p> : null}
      </div>
    </form>
  );
}
