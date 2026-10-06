import type { ReactNode } from "react";

import { SurfaceCard } from "@/components/ui/layout";

export function ItemGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <div
          key={item}
          className="group rounded-[22px] border border-[#E3E7EC] bg-[#F7F8FA] px-6 py-5 transition-colors duration-300 ease-out hover:border-[#E1251B]/24"
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
  children,
}: Readonly<{
  title: string;
  children: ReactNode;
}>) {
  return (
    <SurfaceCard className="px-6 py-6 sm:px-8 sm:py-8">
      <h2 className="text-[28px] font-bold tracking-[0.4px] text-[#30383F]">{title}</h2>
      <div className="mt-4 h-1.5 w-14 rounded-full bg-[#E1251B]" />
      <div className="mt-7">{children}</div>
    </SurfaceCard>
  );
}
