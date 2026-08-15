import { ActionLink } from "@/components/ui/action-link";
import { SectionHeading } from "@/components/ui/section-heading";

import { stepCards } from "./data";

export function StepsSection() {
  return (
    <section id="catalogo" className="px-4 pb-20 pt-1 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1366px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="Cómo funciona" title="Empezar es muy sencillo" />
          <ActionLink href="#catalogo" className="min-w-[208px] self-start lg:self-auto">
            Explorar productos
          </ActionLink>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {stepCards.map((card) => (
            <article
              key={card.step}
              className="rounded-[24px] bg-white p-6 shadow-[0_12px_34px_rgba(20,31,37,0.05)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#404040] text-lg font-semibold text-white">
                {card.step}
              </div>
              <h3 className="mt-8 text-[18px] font-bold text-[#404040]">{card.title}</h3>
              <p className="mt-5 max-w-[330px] text-[15px] leading-6 text-[#8E8E8E]">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
