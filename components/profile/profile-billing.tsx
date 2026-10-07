"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useAuth } from "@/components/auth/auth-provider";
import { useCatalogViews } from "@/components/catalog/catalog-provider";
import { useDeveloperApps } from "@/components/dashboard/apps-provider";
import { mockChargeAccount, mockInvoices, mockPeriodUsage, type MockInvoiceStatus } from "@/components/mock/mockBilling";
import { downloadInvoicePdf } from "@/lib/billing/invoice-pdf";
import { getSessionIdToken } from "@/lib/auth/session";
import { hasProductionApps, isProductionApp } from "@/lib/developer-apps/labels";
import { formatCalendarDate } from "@/lib/format/date";
import { formatMoney } from "@/lib/format/money";

type ContractingRequestResponse = {
  id: string;
  apiProduct?: string | null;
  createdAt?: string;
  status?: string;
};

function folioFromId(id: string) {
  return `SOL-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

function monthLabel(value: string, locale: string) {
  const [year, month] = value.split("-").map(Number);
  if (!year || !month) {
    return value;
  }

  const formatted = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-SV", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function FactRow({
  label,
  value,
  last = false,
  mono = false,
}: {
  label: string;
  value: string;
  last?: boolean;
  mono?: boolean;
}) {
  return (
    <div className={`flex items-baseline justify-between gap-6 py-3 ${last ? "" : "border-b border-[#E7EAEE]"}`}>
      <dt className="shrink-0 text-[13px] text-[#8E8E8E]">{label}</dt>
      <dd className={`min-w-0 text-right text-[14px] leading-5 text-[#404040] ${mono ? "font-mono text-[13px] font-semibold" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

export function ProfileBilling() {
  const t = useTranslations("Profile.billing");
  const locale = useLocale();
  const { user, developerId, companyName } = useAuth();
  const { apps, ready } = useDeveloperApps();
  const products = useCatalogViews();
  const [contractFolio, setContractFolio] = useState("");
  const [contractStarted, setContractStarted] = useState("");

  const productionApps = apps.filter(isProductionApp);
  const linkedApi =
    products.find((product) => product.slug === productionApps[0]?.apiProduct)?.name ??
    productionApps[0]?.apiProduct ??
    "—";

  useEffect(() => {
    const lookupId = developerId ?? user?.uid;
    if (!lookupId) {
      return;
    }

    let cancelled = false;

    getSessionIdToken()
      .then((token) =>
        fetch(`/api/contracting-requests?developerId=${encodeURIComponent(lookupId)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }),
      )
      .then(async (response) => {
        if (!response.ok) {
          return [] as ContractingRequestResponse[];
        }

        return (await response.json()) as ContractingRequestResponse[];
      })
      .then((requests) => {
        if (cancelled) {
          return;
        }

        const approved = requests.find((item) => item.status === "approved") ?? requests[0];
        if (!approved?.id) {
          return;
        }

        setContractFolio(folioFromId(approved.id));
        setContractStarted(approved.createdAt ?? "");
      })
      .catch(() => {
        // El folio se omite si la solicitud no carga; la cuenta y las facturas siguen visibles.
      });

    return () => {
      cancelled = true;
    };
  }, [developerId, user]);

  if (!ready || !hasProductionApps(apps)) {
    return null;
  }

  function invoiceStatusCopy(status: MockInvoiceStatus) {
    if (status === "debitada") {
      return { label: t("debited"), className: "bg-[#EFFCF5] text-[#347659]" };
    }

    if (status === "sin_fondos") {
      return { label: t("noFunds"), className: "bg-[#FFF1F0] text-[#A11B1B]" };
    }

    return { label: t("scheduled"), className: "bg-[#FFF6E8] text-[#A15C12]" };
  }

  const holder = companyName.trim() || t("accountHolderFallback");
  const started = formatCalendarDate(contractStarted || productionApps[0]?.createdAt || "", locale);
  const nextInvoice = mockInvoices.find((invoice) => invoice.status === "programada");
  const accountLabel = `${t("accountType")} **** ${mockChargeAccount.last4}`;

  function handleDownload(invoice: (typeof mockInvoices)[number]) {
    downloadInvoicePdf({
      id: invoice.id,
      periodLabel: monthLabel(invoice.period, locale),
      dateLabel: formatCalendarDate(invoice.date, locale),
      amountLabel: formatMoney(invoice.amountUsd),
      statusLabel: invoiceStatusCopy(invoice.status).label,
      holder,
      accountLabel,
      contractFolio,
      apiName: linkedApi,
    });
  }

  return (
    <div className="space-y-8">
      <p className="text-[15px] leading-7 text-[#5A5A5A]">{t("intro")}</p>

      <section className="overflow-hidden rounded-2xl bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="border-b border-[#E7EAEE] px-5 py-5 sm:px-6 lg:border-r lg:border-b-0">
            <h3 className="text-[16px] font-semibold text-[#404040]">{t("chargeAccount")}</h3>
            <dl className="mt-2">
              <FactRow label={t("bank")} value={mockChargeAccount.bank} />
              <FactRow label={t("accountTypeLabel")} value={t("accountType")} />
              <FactRow label={t("accountNumber")} value={`**** ${mockChargeAccount.last4}`} mono />
              <FactRow label={t("holder")} value={holder} last />
            </dl>
          </div>

          <div className="px-5 py-5 sm:px-6">
            <h3 className="text-[16px] font-semibold text-[#404040]">{t("contract")}</h3>
            <dl className="mt-2">
              <FactRow label={t("folio")} value={contractFolio || "—"} mono />
              <FactRow label={t("api")} value={linkedApi} />
              <FactRow label={t("started")} value={started || "—"} />
              <FactRow
                label={t("usage")}
                value={t("usageValue", {
                  count: mockPeriodUsage.calls.toLocaleString(locale === "en" ? "en-US" : "es-SV"),
                  month: monthLabel(mockPeriodUsage.monthKey, locale),
                })}
                last
              />
            </dl>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#E7EAEE] bg-[#F8F9FB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
          <div className="min-w-0">
            {nextInvoice ? (
              <p className="text-[14px] leading-6 text-[#404040]">
                <span className="text-[#8E8E8E]">{t("nextDebit")}: </span>
                {t("nextDebitValue", {
                  amount: formatMoney(nextInvoice.amountUsd),
                  date: formatCalendarDate(nextInvoice.date, locale),
                })}
              </p>
            ) : null}
            <p className="mt-1 text-[13px] leading-5 text-[#8E8E8E]">{t("accountNote")}</p>
          </div>
          <Link
            href="/perfil?tab=solicitudes"
            className="shrink-0 text-[14px] font-medium text-[#E1251B] transition-colors hover:text-[#C01F16]"
          >
            {t("viewRequest")}
          </Link>
        </div>
      </section>

      <section className="rounded-2xl bg-white">
        <div className="px-5 py-4 sm:px-6">
          <h3 className="text-[16px] font-semibold text-[#404040]">{t("invoiceHistory")}</h3>
          <p className="mt-1 text-[13px] leading-5 text-[#707070]">{t("invoiceHint")}</p>
        </div>

        <div className="divide-y divide-[#E7EAEE] md:hidden">
          {mockInvoices.map((invoice) => {
            const status = invoiceStatusCopy(invoice.status);

            return (
              <article key={invoice.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => handleDownload(invoice)}
                      className="font-mono text-[13px] font-semibold text-[#E1251B] transition-colors hover:text-[#C01F16]"
                    >
                      {invoice.id}
                    </button>
                    <p className="mt-1 text-[13px] text-[#707070]">{monthLabel(invoice.period, locale)}</p>
                  </div>
                  <span className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[12px] font-medium ${status.className}`}>
                    {status.label}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-[14px] text-[#404040]">{formatMoney(invoice.amountUsd)}</p>
                  <button
                    type="button"
                    onClick={() => handleDownload(invoice)}
                    className="text-[13px] font-medium text-[#E1251B] transition-colors hover:text-[#C01F16]"
                  >
                    {t("download")}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-left text-[14px]">
            <thead className="text-[13px] font-medium text-[#8E8E8E]">
              <tr>
                <th className="px-5 py-3 font-medium">{t("invoice")}</th>
                <th className="px-5 py-3 font-medium">{t("period")}</th>
                <th className="px-5 py-3 font-medium">{t("date")}</th>
                <th className="px-5 py-3 font-medium">{t("amount")}</th>
                <th className="px-5 py-3 font-medium">{t("status")}</th>
                <th className="px-5 py-3 font-medium">
                  <span className="sr-only">{t("download")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((invoice) => {
                const status = invoiceStatusCopy(invoice.status);

                return (
                  <tr key={invoice.id} className="border-t border-[#E7EAEE]">
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleDownload(invoice)}
                        className="font-mono text-[13px] font-semibold text-[#E1251B] transition-colors hover:text-[#C01F16]"
                      >
                        {invoice.id}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-[#404040]">{monthLabel(invoice.period, locale)}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-[#707070]">{formatCalendarDate(invoice.date, locale)}</td>
                    <td className="px-5 py-3.5 text-[#404040]">{formatMoney(invoice.amountUsd)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDownload(invoice)}
                        className="text-[13px] font-medium text-[#E1251B] transition-colors hover:text-[#C01F16]"
                      >
                        {t("download")}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
