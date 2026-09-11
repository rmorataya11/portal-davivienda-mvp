import Link from "next/link";

import { GuideIcon } from "@/components/guides/guide-icons";
import { SectionContainer } from "@/components/ui/layout";
import { guides } from "@/lib/guides/guides-content";

import { RecommendedPath } from "./recommended-path";

export function GuidesPage() {
  return (
    <>
      <section className="pt-6 pb-8 sm:pt-8 sm:pb-10">
        <SectionContainer>
          <h1 className="max-w-[720px] text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#404040] sm:text-[36px]">
            Aprenda a integrar, paso a paso
          </h1>
          <p className="mt-3 max-w-[640px] text-[16px] leading-7 tracking-[0.24px] text-[#707070]">
            Tutoriales para pasar de Sandbox a su primera llamada, a su ritmo.
          </p>
        </SectionContainer>
      </section>

      <RecommendedPath />

      <section id="listado-guias" className="scroll-mt-36 pb-16 pt-2 sm:pb-20">
        <SectionContainer>
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="text-[22px] font-bold text-[#404040]">Todas las guías</h2>
            <p className="text-[13px] text-[#8E8E8E]">{guides.length} en total</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {guides.map((guide) => {
              return (
                <article
                  key={guide.id}
                  id={guide.id}
                  className="group scroll-mt-36 flex flex-col rounded-[24px] border border-[#E7EAEE] bg-white p-5 transition-colors hover:border-[#E1251B]/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#FFF1F0] text-[#E1251B]">
                        <GuideIcon id={guide.icon} className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] leading-5 text-[#8E8E8E]">
                          <span className="font-semibold uppercase tracking-[0.14em] text-[#E1251B]">{guide.category}</span>
                          <span> · {guide.number}</span>
                        </p>
                        <h3 className="mt-1 text-[18px] font-bold tracking-[0.2px] text-[#404040]">{guide.title}</h3>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-[14px] leading-6 text-[#707070]">{guide.description}</p>
                  <p className="mt-3 text-[12px] text-[#8E8E8E]">
                    Nivel {guide.level} · {guide.minutes} min
                  </p>
                  <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                    {guide.endpoint ? (
                      <span className="min-w-0 truncate rounded-full bg-[#F8F9FB] px-3 py-1 font-mono text-[11px] text-[#404040]">
                        {guide.endpoint}
                      </span>
                    ) : (
                      <span />
                    )}
                    <Link
                      href={`/guias/${guide.slug}`}
                      className="shrink-0 text-[14px] font-semibold text-[#E1251B] transition-colors hover:text-[#C01F16]"
                    >
                      {guide.article ? "Empezar →" : "Ver ficha →"}
                    </Link>
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
