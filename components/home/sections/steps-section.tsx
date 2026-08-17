import Link from "next/link";

import { StepCard } from "../cards/step-card";
import { stepCards } from "../content/steps";

export function StepsSection() {
  return (
    <section id="catalogo" className="pb-20 pt-1">
      <div className="mx-auto max-w-[1366px] px-[56px]">
        <div className="flex items-start justify-between">
          <div>
            <p className="w-[74px] text-[24px] leading-7 font-normal tracking-[0.48px] text-[#E1251B]">Cómo funciona</p>
            <h2 className="mt-[6px] w-[741px] text-[32px] leading-7 font-bold tracking-[0.64px] text-[#404040]">
              Empezar es muy sencillo
            </h2>
          </div>
          <Link
            href="#catalogo"
            className="mt-3 inline-flex h-12 w-[257px] items-center justify-center rounded-[32px] bg-[#E1251B] text-[15px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_38px_rgba(225,37,27,0.26)]"
          >
            Explorar productos
          </Link>
        </div>

        <div className="mt-[41px] grid gap-4 lg:grid-cols-3">
          {stepCards.map((card) => (
            <StepCard key={card.step} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
