import Link from "next/link";

import { stepCards } from "./data";

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
            className="mt-3 inline-flex h-12 w-[257px] items-center justify-center rounded-[32px] bg-[#E1251B] text-[15px] font-semibold text-white"
          >
            Explorar productos
          </Link>
        </div>

        <div className="mt-[41px] grid gap-4 lg:grid-cols-3">
          {stepCards.map((card) => (
            <article key={card.step} className="h-[273px] rounded-[32px] bg-white px-[17px] pt-[18px]">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#404040] text-[24px] font-medium text-white">
                {card.step}
              </div>
              <h3 className="mt-[26px] w-[245px] text-[20px] leading-7 font-medium tracking-[0.4px] text-[#404040]">
                {card.title}
              </h3>
              <p className="mt-3 max-w-[333px] text-[16px] leading-5 font-normal tracking-[0.32px] text-[#8E8E8E]">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
