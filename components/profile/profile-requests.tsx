"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useAuth } from "@/components/auth/auth-provider";
import { formatCalendarDate } from "@/lib/format/date";

type RequestRow = {
  id: string;
  folio: string;
  useCase: string;
  environment: string;
  submittedAt: string;
  status: string;
};

type ContractingRequestResponse = {
  id: string;
  casoUso?: string;
  industria?: string;
  ambienteDestino?: string;
  createdAt?: string;
  status?: string;
};

function formatDate(value: string, locale: string) {
  if (!value) {
    return "—";
  }

  return formatCalendarDate(value, locale) || "—";
}

function folioFromId(id: string) {
  return `SOL-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function ProfileRequests() {
  const { user, developerId } = useAuth();
  const t = useTranslations("Profile.requests");
  const fieldT = useTranslations("Contratacion.fields");
  const environmentT = useTranslations("Contratacion.environments");
  const locale = useLocale();
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function statusCopy(status: string) {
    const normalized = status.toLowerCase().replace(/\s+/g, "_");

    if (normalized === "aprobada" || normalized === "aprobado" || normalized === "approved") {
      return { label: t("approved"), className: "bg-[#EFFCF5] text-[#347659]" };
    }

    if (normalized === "rechazada" || normalized === "rechazado" || normalized === "rejected") {
      return { label: t("rejected"), className: "bg-[#FFF1F0] text-[#A11B1B]" };
    }

    if (normalized === "en_produccion" || normalized === "produccion") {
      return { label: t("inProduction"), className: "bg-[#EEF3FF] text-[#2F4EA1]" };
    }

    return { label: t("inReview"), className: "bg-[#FFF6E8] text-[#A15C12]" };
  }

  function environmentLabel(value: string) {
    if (value === "pruebas-extendidas" || value === "produccion") {
      return environmentT(value);
    }

    return value || "—";
  }

  useEffect(() => {
    const lookupId = developerId ?? user?.uid;

    if (!lookupId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetch(`/api/contracting-requests?developerId=${encodeURIComponent(lookupId)}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(t("loadFailed"));
        }

        return (await response.json()) as ContractingRequestResponse[];
      })
      .then((requests) => {
        if (cancelled) {
          return;
        }

        const next = requests.map((item) => ({
          id: item.id,
          folio: folioFromId(item.id),
          useCase: item.casoUso?.trim() || item.industria?.trim() || "—",
          environment: item.ambienteDestino?.trim() || "",
          submittedAt: item.createdAt ?? "",
          status: item.status || "pending",
        }));

        setRows(next);
      })
      .catch(() => {
        if (!cancelled) {
          setError(t("loadFailed"));
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

  if (loading) {
    return <div className="h-48 animate-pulse rounded-2xl bg-white" />;
  }

  if (error) {
    return <p className="text-[15px] text-[#E1251B]">{error}</p>;
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl bg-white px-5 py-8 sm:px-6">
        <h3 className="text-[16px] font-semibold text-[#404040]">{t("emptyTitle")}</h3>
        <p className="mt-2 max-w-[520px] text-[14px] leading-6 text-[#707070]">{t("emptyDescription")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white">
      <div className="divide-y divide-[#E7EAEE] md:hidden">
        {rows.map((row) => {
          const status = statusCopy(row.status);

          return (
            <article key={row.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-[13px] font-semibold text-[#404040]">{row.folio}</p>
                <span className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[12px] font-medium ${status.className}`}>
                  {status.label}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-[13px]">
                <dt className="text-[#8E8E8E]">{fieldT("useCase")}</dt>
                <dd className="min-w-0 text-[#404040] [overflow-wrap:anywhere]">{row.useCase}</dd>
                <dt className="text-[#8E8E8E]">{t("date")}</dt>
                <dd className="text-[#707070]">{formatDate(row.submittedAt, locale)}</dd>
                <dt className="text-[#8E8E8E]">{fieldT("environment")}</dt>
                <dd className="text-[#707070]">{environmentLabel(row.environment)}</dd>
              </dl>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-[14px]">
          <thead className="text-[13px] font-medium text-[#8E8E8E]">
            <tr>
              <th className="px-5 py-3 font-medium">{t("folio")}</th>
              <th className="px-5 py-3 font-medium">{fieldT("useCase")}</th>
              <th className="px-5 py-3 font-medium">{t("date")}</th>
              <th className="px-5 py-3 font-medium">{fieldT("environment")}</th>
              <th className="px-5 py-3 font-medium">{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const status = statusCopy(row.status);

              return (
                <tr key={row.id} className="border-t border-[#E7EAEE]">
                  <td className="px-5 py-3.5 font-mono text-[13px] font-semibold text-[#404040]">{row.folio}</td>
                  <td className="px-5 py-3.5 text-[#404040]">{row.useCase}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-[#707070]">{formatDate(row.submittedAt, locale)}</td>
                  <td className="px-5 py-3.5 text-[#707070]">{environmentLabel(row.environment)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
