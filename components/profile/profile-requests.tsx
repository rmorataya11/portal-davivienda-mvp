"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";

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

function formatDate(value: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(date);
}

function statusCopy(status: string) {
  const normalized = status.toLowerCase().replace(/\s+/g, "_");

  if (normalized === "aprobada" || normalized === "aprobado" || normalized === "approved") {
    return { label: "Aprobada", className: "bg-[#EFFCF5] text-[#347659]" };
  }

  if (normalized === "rechazada" || normalized === "rechazado" || normalized === "rejected") {
    return { label: "Rechazada", className: "bg-[#FFF1F0] text-[#A11B1B]" };
  }

  if (normalized === "en_produccion" || normalized === "produccion") {
    return { label: "En producción", className: "bg-[#EEF3FF] text-[#2F4EA1]" };
  }

  return { label: "En revisión", className: "bg-[#FFF6E8] text-[#A15C12]" };
}

function folioFromId(id: string) {
  return `SOL-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function ProfileRequests() {
  const { user, developerId } = useAuth();
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          throw new Error("No se pudieron cargar las solicitudes.");
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
          setError("No se pudieron cargar las solicitudes.");
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
  }, [developerId, user]);

  if (loading) {
    return <div className="h-48 animate-pulse rounded-[18px] bg-[#F2F3F5]" />;
  }

  if (error) {
    return <p className="text-[15px] text-[#E1251B]">{error}</p>;
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-6 py-10 text-center">
        <h3 className="text-[20px] font-bold text-[#404040]">Sin solicitudes todavía</h3>
        <p className="mx-auto mt-2 max-w-[440px] text-[15px] leading-7 text-[#707070]">
          Cuando envíe una solicitud de contratación, el folio y el estado aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[24px] border border-[#E7EAEE] bg-white">
      <table className="min-w-full text-left text-[14px]">
        <thead className="bg-[#F8F9FB] text-[12px] font-medium uppercase tracking-[0.16em] text-[#8E8E8E]">
          <tr>
            <th className="px-5 py-3 font-medium">Folio</th>
            <th className="px-5 py-3 font-medium">API</th>
            <th className="px-5 py-3 font-medium">Fecha</th>
            <th className="px-5 py-3 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = statusCopy(row.status);

            return (
              <tr key={row.id} className="border-t border-[#E7EAEE]">
                <td className="px-5 py-4 font-semibold text-[#141F25]">{row.folio}</td>
                <td className="px-5 py-4 text-[#404040]">{row.product}</td>
                <td className="px-5 py-4 text-[#6A7178]">{formatDate(row.submittedAt)}</td>
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
