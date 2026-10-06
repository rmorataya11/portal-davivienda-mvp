"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { SlidingIndicator, useSlidingIndicator } from "@/components/ui/sliding-indicator";
import type { GuideTocItem } from "@/lib/guides/guide-toc";

export function GuideToc({
  items,
  variant,
}: {
  items: GuideTocItem[];
  variant: "mobile" | "desktop";
}) {
  const t = useTranslations("Support.guides");
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
    return <GuideTocMobile items={items} active={active} label={t("stepsAria")} />;
  }

  return <GuideTocDesktop items={items} active={active} inThisGuide={t("inThisGuide")} label={t("stepsAria")} />;
}

function GuideTocMobile({
  items,
  active,
  label,
}: {
  items: GuideTocItem[];
  active?: GuideTocItem;
  label: string;
}) {
  const { listRef, rect, ready } = useSlidingIndicator<HTMLDivElement>(active?.id, {
    deps: [items.map((item) => item.id).join()],
  });

  return (
    <nav
      aria-label={label}
      className="sticky top-[92px] z-30 border-b border-[#E7EAEE] bg-[#F2F3F5]/95 px-5 backdrop-blur-sm sm:top-[100px] sm:px-8 lg:hidden"
    >
      <div className="overflow-x-auto pt-2">
        <div ref={listRef} className="relative flex w-max items-end gap-1">
          {items.map((item) => {
            const isActive = item.id === active?.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-tab={item.id}
                className={`min-w-11 shrink-0 px-2 pb-2 text-center font-mono text-[12px] transition-colors duration-200 ${
                  isActive ? "text-[#404040]" : "text-[#8E8E8E]"
                }`}
              >
                {item.number}
              </a>
            );
          })}
          <SlidingIndicator rect={rect} ready={ready} className="bg-[#E1251B]" />
        </div>
      </div>
      {active ? (
        <p key={active.id} className="tab-panel-in truncate py-2 text-[13px] text-[#707070]">
          {active.label}
        </p>
      ) : null}
    </nav>
  );
}

function GuideTocDesktop({
  items,
  active,
  inThisGuide,
  label,
}: {
  items: GuideTocItem[];
  active?: GuideTocItem;
  inThisGuide: string;
  label: string;
}) {
  const { listRef, rect, ready } = useSlidingIndicator<HTMLOListElement>(active?.id, {
    orientation: "vertical",
    thickness: 2,
    deps: [items.map((item) => item.id).join()],
  });

  return (
    <nav aria-label={label}>
      <p className="text-[13px] text-[#8E8E8E]">{inThisGuide}</p>
      <ol ref={listRef} className="relative mt-4 border-l border-[#E7EAEE]">
        {items.map((item) => {
          const isActive = item.id === active?.id;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                data-tab={item.id}
                className={`flex gap-3 py-2 pl-3 text-[13px] leading-5 transition-colors duration-200 ${
                  isActive ? "text-[#404040]" : "text-[#707070] hover:text-[#404040]"
                }`}
              >
                <span className="w-6 shrink-0 font-mono text-[12px] text-[#8E8E8E]">{item.number}</span>
                <span className={isActive ? "font-medium" : undefined}>{item.label}</span>
              </a>
            </li>
          );
        })}
        <SlidingIndicator rect={rect} ready={ready} className="bg-[#E1251B]" />
      </ol>
    </nav>
  );
}
