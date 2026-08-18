import type { ReactNode } from "react";

import { SurfaceCard } from "@/components/ui/layout";

export function ItemGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <div
          key={item}
          className="group rounded-[22px] border border-[#E3E7EC] bg-[linear-gradient(180deg,#FFFFFF_0%,#F7F8FA_100%)] px-6 py-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#E1251B]/24 hover:shadow-[0_18px_40px_rgba(20,31,37,0.08)]"
        >
          <div className="flex items-start gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#202A31] text-[13px] font-bold text-white transition-colors duration-300 group-hover:bg-[#E1251B]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="pt-1 text-[16px] leading-7 tracking-[0.24px] text-[#3C444B]">{item}</p>
          </div>
        </div>
      ))}
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
    <SurfaceCard className="px-6 py-6 sm:px-8 sm:py-8">
      {eyebrow ? <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#8E8E8E]">{eyebrow}</p> : null}
      <h2 className="mt-2 text-[28px] font-bold tracking-[0.4px] text-[#30383F]">{title}</h2>
      <div className="mt-4 h-1.5 w-14 rounded-full bg-[#E1251B]" />
      <div className="mt-7">{children}</div>
    </SurfaceCard>
  );
}
