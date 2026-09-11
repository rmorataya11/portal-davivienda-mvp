"use client";

import { useEffect, useState } from "react";

import type { GuideTocItem } from "@/lib/guides/guide-toc";

export function GuideToc({
  items,
  variant,
}: {
  items: GuideTocItem[];
  variant: "mobile" | "desktop";
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  const active = items.find((item) => item.id === activeId) ?? items[0];

  if (variant === "mobile") {
    return (
      <nav
        aria-label="Pasos de esta guía"
        className="sticky top-[92px] z-30 border-b border-[#E7EAEE] bg-[#F2F3F5]/95 px-5 backdrop-blur-sm sm:top-[100px] sm:px-8 lg:hidden"
      >
        <div className="flex items-end gap-1 overflow-x-auto pt-2">
          {items.map((item) => {
            const isActive = item.id === active?.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`min-w-11 shrink-0 border-b-2 px-2 pb-2 text-center font-mono text-[12px] ${
                  isActive ? "border-[#E1251B] text-[#404040]" : "border-transparent text-[#8E8E8E]"
                }`}
              >
                {item.number}
              </a>
            );
          })}
        </div>
        {active ? <p className="truncate py-2 text-[13px] text-[#707070]">{active.label}</p> : null}
      </nav>
    );
  }

  return (
    <nav aria-label="Pasos de esta guía">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8E8E8E]">En esta guía</p>
      <ol className="mt-4">
        {items.map((item, index) => {
          const isActive = item.id === active?.id;
          const last = index === items.length - 1;

          return (
            <li key={item.id} className="flex gap-3">
              <div className="flex w-7 shrink-0 flex-col items-center">
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-[11px] font-bold ${
                    isActive ? "bg-[#E1251B] text-white" : "bg-[#F2F3F5] text-[#8E8E8E]"
                  }`}
                >
                  {item.number}
                </span>
                {last ? null : <span className="w-px flex-1 bg-[#E7EAEE]" />}
              </div>
              <a
                href={`#${item.id}`}
                className={`min-w-0 flex-1 text-[13px] leading-5 ${last ? "pb-0" : "pb-4"} ${
                  isActive ? "font-semibold text-[#404040]" : "text-[#707070] hover:text-[#404040]"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
