"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useAuth } from "@/components/auth/auth-provider";
import { formatCalendarDate } from "@/lib/format/date";

type RequestRow = {
  id: string;
  folio: string;
  product: string;
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
          product: item.casoUso?.trim() || item.industria?.trim() || "—",
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
    return <div className="h-48 animate-pulse rounded-[18px] bg-[#F2F3F5]" />;
  }

  if (error) {
    return <p className="text-[15px] text-[#E1251B]">{error}</p>;
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-6 py-10 text-center">
        <h3 className="text-[20px] font-bold text-[#404040]">{t("emptyTitle")}</h3>
        <p className="mx-auto mt-2 max-w-[440px] text-[15px] leading-7 text-[#707070]">{t("emptyDescription")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[24px] border border-[#E7EAEE] bg-white">
      <table className="min-w-full text-left text-[14px]">
        <thead className="bg-[#F8F9FB] text-[12px] font-medium uppercase tracking-[0.16em] text-[#8E8E8E]">
          <tr>
            <th className="px-5 py-3 font-medium">{t("folio")}</th>
            <th className="px-5 py-3 font-medium">{t("api")}</th>
            <th className="px-5 py-3 font-medium">{t("date")}</th>
            <th className="px-5 py-3 font-medium">{t("status")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = statusCopy(row.status);

            return (
              <tr key={row.id} className="border-t border-[#E7EAEE]">
                <td className="px-5 py-4 font-semibold text-[#141F25]">{row.folio}</td>
                <td className="px-5 py-4 text-[#404040]">{row.product}</td>
                <td className="px-5 py-4 text-[#6A7178]">{formatDate(row.submittedAt, locale)}</td>
                <td className="px-5 py-4">
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
  );
}
