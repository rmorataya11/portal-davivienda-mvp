import Link from "next/link";

import { SectionHeading } from "@/components/ui/section-heading";

import { useCaseCards } from "./data";

export function UseCasesSection() {
  return (
    <section id="casos-de-uso" className="pb-16 pt-2">
      <div className="mx-auto max-w-[1366px] px-[57px]">
        <SectionHeading
          title="Inspírese con lo que puede lograr"
          description="Historias reales de negocio que puede hacer realidad. Elija la que más se parezca a su idea y descubra cómo darle vida."
        />

        <div className="mt-10 grid gap-[14px] lg:grid-cols-3">
          {useCaseCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="flex h-[600px] flex-col rounded-[32px] bg-white px-4 pb-6 pt-4">
                <div className="flex items-center gap-2 text-[16px] leading-6 font-medium tracking-[0.32px] text-[#404040]">
                  <Icon className="h-[22px] w-[22px] text-[#404040]" />
                  <span>{card.category}</span>
                </div>
                <div
                  className={`mt-[29px] h-[208px] w-[376px] rounded-[16px] ${card.mediaTone === "warm" && index === 0 ? "media-placeholder--warm" : "media-placeholder"}`}
                />
                <h3 className="mt-[22px] w-[274px] text-[20px] leading-7 font-medium tracking-[0.4px] text-[#404040]">
                  {card.title}
                </h3>
                <div className="mt-2 h-1.5 w-10 rounded-full bg-[#E1251B]" />
                <p className="mt-3 w-[373px] text-[16px] leading-5 font-normal tracking-[0.32px] text-[#8E8E8E]">
                  {card.description}
                </p>
                <Link
                  href="#catalogo"
                  className="mt-auto mx-auto inline-flex h-12 w-[317px] items-center justify-center rounded-[32px] border border-[#404040] bg-white text-[15px] font-medium text-[#404040]"
                >
                  Ver como funciona
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
