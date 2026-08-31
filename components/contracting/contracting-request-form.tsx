"use client";

import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { SelectField, TextAreaField, TextField } from "@/components/auth/auth-form-fields";
import { apiCatalogItems } from "@/components/catalog/content/apis";
import { useDeveloperApps } from "@/components/dashboard/apps-provider";
import { getFirebaseDb } from "@/lib/firebase/client";

import { destinationEnvironments, industries, ipWhitelistOptions, monthlyVolumes } from "./content/contracting";
import { RadioGroup } from "./radio-group";
import { TermsModal } from "./terms-modal";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+()\s.-]*\d[\d+()\s.-]{6,}$/;

type FieldErrors = Record<string, string>;

function generateRequestId() {
  const year = new Date().getFullYear();
  const shortStamp = Date.now().toString(36).toUpperCase().slice(-8);
  return `SOL-${year}-${shortStamp}`;
}

export function ContractingRequestForm({ productName = "" }: { productName?: string }) {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { getApp, markContracting } = useDeveloperApps();
  const appId = searchParams.get("app") ?? "";
  const linkedApp = appId ? getApp(appId) : undefined;
  const linkedProducts = apiCatalogItems
    .filter((item) => linkedApp?.productSlugs.includes(item.slug))
    .map((item) => item.name)
    .join(", ");
  const displayProduct = linkedProducts || productName;
  const [companyName, setCompanyName] = useState("");
  const [environment, setEnvironment] = useState("");
  const [needsIpWhitelist, setNeedsIpWhitelist] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    getDoc(doc(getFirebaseDb(), "users", user.uid))
      .then((snapshot) => {
        if (cancelled) {
          return;
        }

        const profileName = snapshot.data()?.companyName;
        if (typeof profileName === "string" && profileName.trim()) {
          setCompanyName((current) => current || profileName);
        }
      })
      .catch(() => {
        // El usuario puede completar la razón social manualmente.
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

  function validate(form: FormData) {
    const nextErrors: FieldErrors = {};
    const email = String(form.get("technicalEmail") ?? "").trim();
    const phone = String(form.get("technicalPhone") ?? "").trim();

    if (!String(form.get("companyName") ?? "").trim()) {
      nextErrors.companyName = "Ingrese la razón social o el nombre de la empresa.";
    }

    if (!String(form.get("taxId") ?? "").trim()) {
      nextErrors.taxId = "Ingrese el NIT o la identificación fiscal.";
    }

    if (!form.get("industry")) {
      nextErrors.industry = "Seleccione la industria o el sector.";
    }

    if (!String(form.get("useCase") ?? "").trim()) {
      nextErrors.useCase = "Describa brevemente el caso de uso.";
    }

    if (!form.get("volume")) {
      nextErrors.volume = "Seleccione el volumen estimado de transacciones.";
    }

    if (!form.get("environment")) {
      nextErrors.environment = "Seleccione el ambiente destino.";
    }

    if (!form.get("needsIpWhitelist")) {
      nextErrors.needsIpWhitelist = "Indique si necesita whitelist de IPs para producción.";
    }

    if (form.get("needsIpWhitelist") === "si" && !String(form.get("ipRanges") ?? "").trim()) {
      nextErrors.ipRanges = "Ingrese el rango o los rangos de IP a autorizar.";
    }

    if (!String(form.get("technicalName") ?? "").trim()) {
      nextErrors.technicalName = "Ingrese el nombre del contacto técnico.";
    }

    if (!email) {
      nextErrors.technicalEmail = "Ingrese el correo del contacto técnico.";
    } else if (!EMAIL_PATTERN.test(email)) {
      nextErrors.technicalEmail = "Ingrese un correo válido, por ejemplo nombre@empresa.com.";
    }

    if (!phone) {
      nextErrors.technicalPhone = "Ingrese el teléfono del contacto técnico.";
    } else if (!PHONE_PATTERN.test(phone)) {
      nextErrors.technicalPhone = "Ingrese un teléfono válido.";
    }

    if (!form.get("terms")) {
      nextErrors.terms = "Debe aceptar los términos y condiciones.";
    }

    if (!form.get("dataAccuracy")) {
      nextErrors.dataAccuracy = "Debe confirmar que la información suministrada es veraz y completa.";
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const nextErrors = validate(new FormData(formElement));
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    const requestIdInput = formElement.elements.namedItem("requestId");
    const submittedAtInput = formElement.elements.namedItem("submittedAt");
    if (requestIdInput instanceof HTMLInputElement) {
      requestIdInput.value = generateRequestId();
    }
    if (submittedAtInput instanceof HTMLInputElement) {
      submittedAtInput.value = new Date().toISOString();
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      if (linkedApp) {
        markContracting(linkedApp.id);
      }
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  }

  if (submitted) {
    return (
      <div className="py-4 sm:py-6">
        <p className="text-[13px] font-medium uppercase tracking-[0.24em] text-[#E1251B]">Solicitud recibida</p>
        <h1 className="mt-3 text-[26px] font-bold tracking-[0.3px] text-[#141F25] sm:text-[32px] lg:text-[36px]">
          Su solicitud fue recibida, le contactaremos
        </h1>
        <p className="mt-4 max-w-[560px] text-[16px] leading-7 text-[#6A7178]">
          Un integrante del equipo revisará el caso de uso, el volumen estimado y el ambiente solicitado para continuar
          el proceso hacia producción.
        </p>
        <Link
          href={linkedApp ? `/dashboard/apps/${linkedApp.id}` : "/dashboard"}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
        >
          Ir a mis aplicaciones
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-[#E7EAEE] pb-8">
        <h1 className="text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]">
          Solicitud de contratación
        </h1>
        <p className="mt-4 text-[16px] leading-7 tracking-[0.2px] text-[#6A7178]">
          Si ya validó una API en sandbox y quiere avanzar a producción, complete estos datos. Los campos con asterisco
          (*) son obligatorios.
        </p>
        {linkedApp ? (
          <p className="mt-4 rounded-[12px] bg-[#F8F9FB] px-4 py-3 text-[14px] text-[#404040]">
            Aplicación: <span className="font-semibold text-[#141F25]">{linkedApp.name}</span>
            {displayProduct ? (
              <>
                <br />
                Productos: <span className="font-semibold text-[#141F25]">{displayProduct}</span>
              </>
            ) : null}
          </p>
        ) : productName ? (
          <p className="mt-4 rounded-[12px] bg-[#F8F9FB] px-4 py-3 text-[14px] text-[#404040]">
            Producto de interés: <span className="font-semibold text-[#141F25]">{productName}</span>
          </p>
        ) : null}
      </div>

      <form className="mt-8 space-y-10" noValidate onSubmit={handleSubmit}>
        <input type="hidden" name="product" value={displayProduct} />
        {linkedApp ? <input type="hidden" name="appId" value={linkedApp.id} /> : null}
        <input type="hidden" name="accountEmail" value={user?.email ?? ""} />
        <input type="hidden" name="requestId" defaultValue="" />
        <input type="hidden" name="submittedAt" defaultValue="" />

        <FormSection>
          <TextField
            id="companyName"
            name="companyName"
            label="Razón social / Nombre de la empresa"
            required
            autoComplete="organization"
            placeholder="Mi Empresa S.A.S."
            value={companyName}
            error={errors.companyName}
            onChange={(event) => {
              setCompanyName(event.currentTarget.value);
              clearError("companyName");
            }}
          />
          <TextField
            id="taxId"
            name="taxId"
            label="NIT / identificación fiscal"
            required
            placeholder="900123456-7"
            error={errors.taxId}
            onChange={() => clearError("taxId")}
          />
          <SelectField
            id="industry"
            name="industry"
            label="Industria / sector"
            required
            error={errors.industry}
            onChange={() => clearError("industry")}
          >
            {industries.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </FormSection>

        <FormSection>
          <TextAreaField
            id="useCase"
            name="useCase"
            label="Caso de uso"
            required
            rows={5}
            hint="Describa de forma breve qué problema resuelve y cómo usará la API."
            placeholder="Conciliar saldos corporativos en tiempo real para tesorería..."
            error={errors.useCase}
            onChange={() => clearError("useCase")}
          />
          <SelectField
            id="volume"
            name="volume"
            label="Volumen estimado de transacciones/mes"
            required
            error={errors.volume}
            onChange={() => clearError("volume")}
          >
            {monthlyVolumes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
          <RadioGroup
            legend="Ambiente destino"
            name="environment"
            required
            error={errors.environment}
            value={environment}
            options={destinationEnvironments}
            onChange={(value) => {
              setEnvironment(value);
              clearError("environment");
            }}
          />
          <RadioGroup
            legend="¿Necesita whitelist de IPs para producción?"
            name="needsIpWhitelist"
            required
            error={errors.needsIpWhitelist}
            value={needsIpWhitelist}
            options={ipWhitelistOptions}
            onChange={(value) => {
              setNeedsIpWhitelist(value);
              clearError("needsIpWhitelist");
              if (value !== "si") {
                clearError("ipRanges");
              }
            }}
          />
          {needsIpWhitelist === "si" ? (
            <TextAreaField
              id="ipRanges"
              name="ipRanges"
              label="Rango(s) de IP a autorizar"
              required
              rows={4}
              hint="Indique una IP o un rango por línea, por ejemplo 190.25.10.0/24."
              placeholder={"190.25.10.0/24\n181.49.20.15"}
              error={errors.ipRanges}
              onChange={() => clearError("ipRanges")}
            />
          ) : null}
        </FormSection>

        <FormSection>
          <TextField
            id="technicalName"
            name="technicalName"
            label="Nombre"
            required
            autoComplete="name"
            placeholder="Ana Gómez"
            error={errors.technicalName}
            onChange={() => clearError("technicalName")}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <TextField
              id="technicalEmail"
              name="technicalEmail"
              type="email"
              label="Email"
              required
              autoComplete="email"
              placeholder="ana.gomez@empresa.com"
              error={errors.technicalEmail}
              onChange={() => clearError("technicalEmail")}
            />
            <TextField
              id="technicalPhone"
              name="technicalPhone"
              type="tel"
              label="Teléfono"
              required
              autoComplete="tel"
              placeholder="+57 300 123 4567"
              error={errors.technicalPhone}
              onChange={() => clearError("technicalPhone")}
            />
          </div>
        </FormSection>

        <FormSection>
          <div>
            <div className="flex items-start gap-3 text-[15px] text-[#404040]">
              <input
                id="terms"
                type="checkbox"
                name="terms"
                required
                onChange={() => clearError("terms")}
                className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-[4px] border border-[#C9CED4] accent-[#E1251B]"
              />
              <p>
                <label htmlFor="terms" className="cursor-pointer">
                  Acepto los{" "}
                </label>
                <button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  className="font-semibold text-[#E1251B] underline-offset-2 hover:underline"
                >
                  términos y condiciones
                </button>{" "}
                <span className="text-[#E1251B]">*</span>
              </p>
            </div>
            {errors.terms ? <p className="mt-2 pl-8 text-[13px] text-[#E1251B]">{errors.terms}</p> : null}
          </div>

          <div>
            <div className="flex items-start gap-3 text-[15px] text-[#404040]">
              <input
                id="dataAccuracy"
                type="checkbox"
                name="dataAccuracy"
                required
                onChange={() => clearError("dataAccuracy")}
                className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-[4px] border border-[#C9CED4] accent-[#E1251B]"
              />
              <p>
                <label htmlFor="dataAccuracy" className="cursor-pointer">
                  Confirmo que la información suministrada es veraz y completa
                </label>{" "}
                <span className="text-[#E1251B]">*</span>
              </p>
            </div>
            {errors.dataAccuracy ? <p className="mt-2 pl-8 text-[13px] text-[#E1251B]">{errors.dataAccuracy}</p> : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#E1251B] px-7 text-[15px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)] disabled:translate-y-0 disabled:bg-[#C9CED4] disabled:shadow-none"
          >
            {isSubmitting ? "Enviando..." : "Enviar solicitud"}
            {isSubmitting ? null : <span aria-hidden="true">→</span>}
          </button>
        </FormSection>
      </form>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
}

function FormSection({ children }: { children: ReactNode }) {
  return <section className="space-y-5">{children}</section>;
}
