import type { ReactNode } from "react";

import { SurfaceCard } from "@/components/ui/layout";

export function ItemGrid({ items }: { items: string[] }) {
  return (
    <div className="mt-6 border-t border-[#D0D4D8]">
      {items.map((item, index) => (
        <div key={item} className="flex items-start gap-4 border-b border-[#D0D4D8] py-5">
          <span className="w-6 shrink-0 pt-0.5 text-[12px] font-medium text-[#8E8E8E]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="text-[15px] leading-7 text-[#404040]">{item}</p>
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
      <h2 className="text-[22px] font-bold tracking-[0.2px] text-[#404040]">{title}</h2>
      <div className="mt-7">{children}</div>
    </SurfaceCard>
  );
}
