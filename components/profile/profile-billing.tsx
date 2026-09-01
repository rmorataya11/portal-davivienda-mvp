"use client";

import { mockCurrentPlan, mockInvoices, mockNextCharge, mockPaymentMethod } from "@/components/mock/mockBilling";
import { formatMoneyCop } from "@/lib/developer-apps/factory";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(value));
}

function invoiceStatusCopy(status: (typeof mockInvoices)[number]["status"]) {
  if (status === "pagada") {
    return { label: "Pagada", className: "bg-[#EFFCF5] text-[#347659]" };
  }

  if (status === "vencida") {
    return { label: "Vencida", className: "bg-[#FFF1F0] text-[#A11B1B]" };
  }

  return { label: "Pendiente", className: "bg-[#FFF6E8] text-[#A15C12]" };
}

export function ProfileBilling() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[22px] border border-[#E7EAEE] bg-[#FCFCFD] px-5 py-6 sm:px-6">
          <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Plan actual</p>
          <h3 className="mt-2 text-[22px] font-bold tracking-[0.2px] text-[#141F25]">{mockCurrentPlan.name}</h3>
          <p className="mt-2 text-[28px] font-bold text-[#141F25]">
            {mockCurrentPlan.priceLabel}
            <span className="ml-2 text-[15px] font-medium text-[#6A7178]">/ {mockCurrentPlan.period}</span>
          </p>
          <p className="mt-3 text-[15px] leading-7 text-[#6A7178]">{mockCurrentPlan.description}</p>
          <ul className="mt-4 space-y-2">
            {mockCurrentPlan.features.map((feature) => (
              <li key={feature} className="flex gap-2 text-[14px] text-[#404040]">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#E1251B]" />
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-4">
          <section className="rounded-[22px] border border-[#E7EAEE] bg-white px-5 py-6 sm:px-6">
            <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Próximo cobro</p>
            <p className="mt-2 text-[22px] font-bold text-[#141F25]">{formatMoneyCop(mockNextCharge.amountCop)}</p>
            <p className="mt-1 text-[15px] text-[#6A7178]">{formatDate(mockNextCharge.date)}</p>
          </section>

          <section className="rounded-[22px] border border-[#E7EAEE] bg-white px-5 py-6 sm:px-6">
            <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Método de pago</p>
            <p className="mt-2 text-[20px] font-bold tracking-[0.2px] text-[#141F25]">
              {mockPaymentMethod.brand} •••• {mockPaymentMethod.last4}
            </p>
            <p className="mt-1 text-[14px] text-[#6A7178]">
              {mockPaymentMethod.holder} · Vence {mockPaymentMethod.expires}
            </p>
          </section>
        </div>
      </div>

      <section className="overflow-hidden rounded-[22px] border border-[#E7EAEE] bg-white">
        <div className="px-5 py-4 sm:px-6">
          <h3 className="text-[18px] font-bold text-[#141F25]">Historial de facturas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[14px]">
            <thead className="bg-[#F8F9FB] text-[12px] font-medium uppercase tracking-[0.16em] text-[#8E8E8E]">
              <tr>
                <th className="px-5 py-3 font-medium">Factura</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 font-medium">Monto</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium">
                  <span className="sr-only">Descargar</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((invoice) => {
                const status = invoiceStatusCopy(invoice.status);

                return (
                  <tr key={invoice.id} className="border-t border-[#E7EAEE]">
                    <td className="px-5 py-4 font-semibold text-[#141F25]">{invoice.id}</td>
                    <td className="px-5 py-4 text-[#6A7178]">{formatDate(invoice.date)}</td>
                    <td className="px-5 py-4 text-[#404040]">{formatMoneyCop(invoice.amountCop)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {/* MOCK: sin archivo real hasta integrar facturación */}
                      <button
                        type="button"
                        className="text-[13px] font-medium text-[#E1251B] transition-colors hover:text-[#E1111C]"
                      >
                        Descargar
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
