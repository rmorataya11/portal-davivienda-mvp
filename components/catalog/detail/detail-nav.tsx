"use client";

import { useEffect, useState } from "react";

type DetailNavSection = {
  id: string;
  label: string;
};

export function DetailNav({ sections }: { sections: DetailNavSection[] }) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observedSections = sections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);

    if (observedSections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.2, 0.45, 0.7],
      },
    );

    observedSections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="sticky top-[96px] z-30 rounded-[28px] border border-[#E3E7EC] bg-white/90 px-3 py-3 shadow-[0_16px_36px_rgba(20,31,37,0.08)] backdrop-blur sm:top-[112px] lg:top-[118px] lg:rounded-full">
      <nav className="flex flex-wrap gap-2">
        {sections.map((section) => {
          const isActive = section.id === activeSection;

          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`inline-flex h-10 items-center justify-center rounded-full px-5 text-[14px] font-medium transition-all duration-300 ease-out ${
                isActive
                  ? "bg-[#202A31] text-white shadow-[0_12px_26px_rgba(20,31,37,0.14)]"
                  : "bg-transparent text-[#5F676E] hover:-translate-y-0.5 hover:bg-[#F5F6F8] hover:text-[#30383F]"
              }`}
            >
              {section.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
