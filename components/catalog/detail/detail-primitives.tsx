import type { ReactNode } from "react";

import { SurfaceCard } from "@/components/ui/layout";

export function ItemGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <div
          key={item}
          className="group rounded-[22px] border border-[#D8DCE1] bg-[linear-gradient(180deg,#FCFCFD_0%,#F7F8FA_100%)] px-6 py-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#E1251B]/30 hover:shadow-[0_16px_36px_rgba(20,31,37,0.08)]"
        >
          <div className="flex items-start gap-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#141F25] text-[14px] font-bold text-white transition-colors duration-300 group-hover:bg-[#E1251B]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-[16px] leading-7 tracking-[0.32px] text-[#404040]">{item}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function QuickMetric({
  label,
  value,
  tone = "light",
}: Readonly<{
  label: string;
  value: string;
  tone?: "light" | "dark";
}>) {
  return (
    <div
      className={`rounded-[22px] px-5 py-5 transition-all duration-300 ease-out hover:-translate-y-0.5 ${
        tone === "dark"
          ? "border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] shadow-[0_14px_36px_rgba(0,0,0,0.12)]"
          : "border border-[#D8DCE1] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FB_100%)] shadow-[0_14px_36px_rgba(20,31,37,0.06)]"
      }`}
    >
      <p className={`text-[13px] font-medium uppercase tracking-[0.18em] ${tone === "dark" ? "text-white/62" : "text-[#8E8E8E]"}`}>
        {label}
      </p>
      <p className={`mt-3 text-[24px] font-bold tracking-[0.48px] ${tone === "dark" ? "text-white" : "text-[#404040]"}`}>
        {value}
      </p>
    </div>
  );
}

export function DetailSectionCard({
  title,
  eyebrow,
  children,
}: Readonly<{
  title: string;
  eyebrow?: string;
  children: ReactNode;
}>) {
  return (
    <SurfaceCard className="px-8 py-8">
      {eyebrow ? <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-[#8E8E8E]">{eyebrow}</p> : null}
      <h2 className="text-[28px] font-bold tracking-[0.56px] text-[#404040]">{title}</h2>
      <div className="mt-4 h-1.5 w-14 rounded-full bg-[#E1251B]" />
      <div className="mt-6">{children}</div>
    </SurfaceCard>
  );
}
