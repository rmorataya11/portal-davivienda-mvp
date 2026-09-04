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
        className="sticky top-[92px] z-30 border-b border-[#D8DCE1] bg-white/95 px-5 backdrop-blur-sm sm:top-[100px] sm:px-8 lg:hidden"
      >
        <div className="flex items-end gap-1 overflow-x-auto pt-2">
          {items.map((item) => {
            const isActive = item.id === active?.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`min-w-11 shrink-0 border-b-2 px-2 pb-2 text-center font-mono text-[12px] ${
                  isActive ? "border-[#E1251B] text-[#141F25]" : "border-transparent text-[#8E8E8E]"
                }`}
              >
                {item.number}
              </a>
            );
          })}
        </div>
        {active ? <p className="truncate py-2 text-[13px] text-[#3C444B]">{active.label}</p> : null}
      </nav>
    );
  }

  return (
    <nav aria-label="Pasos de esta guía" className="hidden lg:block">
      <p className="text-[13px] text-[#8E8E8E]">En esta guía</p>
      <ol className="mt-4 border-l border-[#D8DCE1]">
        {items.map((item) => {
          const isActive = item.id === active?.id;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`-ml-px flex gap-3 border-l-2 py-2 pl-3 text-[13px] leading-5 ${
                  isActive
                    ? "border-[#E1251B] text-[#141F25]"
                    : "border-transparent text-[#5C656C] hover:text-[#141F25]"
                }`}
              >
                <span className="w-6 shrink-0 font-mono text-[12px] text-[#8E8E8E]">{item.number}</span>
                <span className={isActive ? "font-medium" : undefined}>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
