import { ActionLink } from "@/components/ui/action-link";
import { SectionHeading } from "@/components/ui/section-heading";

import { useCaseCards } from "./data";

export function UseCasesSection() {
  return (
    <section id="casos-de-uso" className="px-4 pb-16 pt-2 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1366px]">
        <SectionHeading
          title="Inspírese con lo que puede lograr"
          description="Historias reales de negocio que puede hacer realidad. Elija la que más se parezca a su idea y descubra cómo darle vida."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {useCaseCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="rounded-[24px] bg-white p-5 shadow-[0_12px_34px_rgba(20,31,37,0.05)]"
              >
                <div className="flex items-center gap-3 text-[15px] font-medium text-[#3F3F3F]">
                  <Icon className="h-7 w-7 text-[#3F3F3F]" />
                  <span>{card.category}</span>
                </div>
                <div
                  className={`mt-5 h-[182px] rounded-[16px] ${card.mediaTone === "warm" && index === 0 ? "media-placeholder--warm" : "media-placeholder"}`}
                />
                <h3 className="mt-5 text-[18px] font-bold leading-7 text-[#404040]">{card.title}</h3>
                <div className="mt-3 h-1.5 w-10 rounded-full bg-[#E1251B]" />
                <p className="mt-4 min-h-[92px] text-[15px] leading-6 text-[#8E8E8E]">{card.description}</p>
                <ActionLink href="#catalogo" variant="secondary" className="mt-7 w-full">
                  Ver como funciona
                </ActionLink>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
