import { SectionHeading } from "@/components/ui/section-heading";

import { UseCaseCard } from "../cards/use-case-card";
import { useCaseCards } from "../content/use-cases";

export function UseCasesSection() {
  return (
    <section id="casos-de-uso" className="pb-16 pt-2">
      <div className="mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-[57px]">
        <SectionHeading
          title="Inspírese con lo que puede lograr"
          description="Historias reales de negocio que puede hacer realidad. Elija la que más se parezca a su idea y descubra cómo darle vida."
        />

        <div className="mt-10 grid gap-[14px] md:grid-cols-2 xl:grid-cols-3">
          {useCaseCards.map((card, index) => (
            <UseCaseCard key={card.title} card={card} highlightWarmMedia={card.mediaTone === "warm" && index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
