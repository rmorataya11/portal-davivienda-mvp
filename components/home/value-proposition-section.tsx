import { SectionHeading } from "@/components/ui/section-heading";

import { valueCards } from "./data";

export function ValuePropositionSection() {
  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1366px]">
        <div className="dark-orbit relative overflow-hidden rounded-[2px] bg-[#141F25] px-5 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-16">
          <SectionHeading eyebrow="Por qué Davivienda" title="Pensado para acompañar a su negocio" light />

          <div className="relative z-10 mt-10 grid gap-5 lg:grid-cols-[1fr_1fr_1.9fr]">
            {valueCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.step}
                  className={`rounded-[26px] bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.14)] ${card.wide ? "min-h-[146px]" : "min-h-[312px]"} ${card.wide ? "lg:col-start-3" : ""}`}
                >
                  <div className={`flex ${card.wide ? "items-start gap-6" : "flex-col items-start"} h-full`}>
                    <div className="flex h-full flex-col justify-between">
                      <span className="text-[34px] font-light leading-none text-[#9E9E9E]">{card.step}</span>
                      <div className="mt-4 flex h-[82px] w-[82px] items-center justify-center rounded-full bg-[#404040] text-white">
                        <Icon className="h-10 w-10" />
                      </div>
                    </div>
                    <div className={card.wide ? "pt-2" : "mt-6"}>
                      <h3 className="text-[18px] font-bold text-[#404040]">{card.title}</h3>
                      <p className="mt-4 max-w-[350px] text-[15px] leading-6 text-[#8E8E8E]">{card.description}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
