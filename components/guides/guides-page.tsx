import Link from "next/link";

import { GuideIcon } from "@/components/guides/guide-icons";
import { SectionContainer } from "@/components/ui/layout";
import { guides } from "@/lib/guides/guides-content";

import { RecommendedPath } from "./recommended-path";

export function GuidesPage() {
  return (
    <>
      <section className="bg-white pt-6 pb-12 sm:pt-8 sm:pb-16">
        <SectionContainer>
          <h1 className="max-w-[720px] text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]">
            Aprenda a integrar, paso a paso
          </h1>
          <p className="mt-4 max-w-[680px] text-[16px] leading-7 tracking-[0.24px] text-[#6A7178] sm:text-[18px] sm:leading-8">
            Tutoriales prácticos y rutas de aprendizaje para llevar su integración de Sandbox a Producción con buenas
            prácticas. Vamos a su ritmo.
          </p>
        </SectionContainer>
      </section>

      <RecommendedPath />

      <section id="listado-guias" className="scroll-mt-36 bg-white pb-16 pt-4 sm:pb-20">
        <SectionContainer>
          <p className="text-[13px] font-medium text-[#8E8E8E]">{guides.length} guías</p>
          <div className="mt-4 grid gap-4">
            {guides.map((guide) => {
              return (
                <article
                  key={guide.id}
                  id={guide.id}
                  className="group scroll-mt-36 flex gap-4 rounded-[22px] border border-[#E7EAEE] border-l-4 border-l-[#E7EAEE] bg-white px-4 py-5 transition-all duration-300 hover:border-l-[#E1251B] hover:shadow-[0_18px_50px_rgba(20,31,37,0.1)] sm:gap-5 sm:px-6 sm:py-6"
                >
                  <p className="hidden w-12 shrink-0 text-[32px] font-bold leading-none tracking-[0.04em] text-[#D5DAE0] sm:block lg:w-14 lg:text-[40px]">
                    {guide.number}
                  </p>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#FFF1F0] text-[#E1251B]">
                          <GuideIcon id={guide.icon} className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] leading-5 text-[#8E8E8E]">
                            <span className="font-semibold uppercase tracking-[0.14em] text-[#E1251B]">
                              {guide.category}
                            </span>
                            <span> · Nivel {guide.level}</span>
                            <span> · {guide.minutes} min de lectura</span>
                          </p>
                          <h3 className="mt-1 text-[18px] font-bold tracking-[0.2px] text-[#141F25] sm:text-[20px]">
                            {guide.title}
                          </h3>
                        </div>
                      </div>
                      {guide.endpoint ? (
                        <span className="hidden shrink-0 rounded-full bg-[#EFFCF5] px-3 py-1 font-mono text-[11px] font-medium text-[#347659] sm:inline-flex">
                          {guide.endpoint}
                        </span>
                      ) : null}
                    </div>
                    {guide.endpoint ? (
                      <span className="mt-3 inline-flex rounded-full bg-[#EFFCF5] px-3 py-1 font-mono text-[11px] font-medium text-[#347659] sm:hidden">
                        {guide.endpoint}
                      </span>
                    ) : null}
                    <p className="mt-3 max-w-[720px] text-[15px] leading-7 text-[#6A7178]">{guide.description}</p>
                    <p className="mt-3 text-[13px] leading-6 text-[#6A7178] sm:text-[14px]">
                      <span className="font-semibold text-[#141F25]">En esta guía:</span> {guide.topics.join(" · ")}
                    </p>
                    <div className="mt-4 flex justify-end">
                      <Link
                        href={`/guias/${guide.slug}`}
                        className="text-[14px] font-semibold text-[#E1251B] transition-colors hover:text-[#E1111C]"
                      >
                        {guide.article ? "Empezar →" : "Ver ficha →"}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </SectionContainer>
      </section>
    </>
  );
}
