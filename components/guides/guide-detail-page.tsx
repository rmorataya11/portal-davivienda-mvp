import Link from "next/link";

import { GuideCodeBlock, GuideJsonBlock, GuideMermaidBlock } from "@/components/guides/guide-code-block";
import { GuideIcon } from "@/components/guides/guide-icons";
import { GuideProse } from "@/components/guides/guide-prose";
import { GuideToc } from "@/components/guides/guide-toc";
import { SectionContainer } from "@/components/ui/layout";
import { formatPendingNote, getGuideTocItems, splitEndpoint } from "@/lib/guides/guide-toc";
import type { Guide } from "@/lib/guides/guides-content";
import { guides } from "@/lib/guides/guides-content";

export function GuideDetailPage({ guide }: { guide: Guide }) {
  const article = guide.article;
  const currentIndex = guides.findIndex((item) => item.slug === guide.slug);
  const previous = currentIndex > 0 ? guides[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < guides.length - 1 ? guides[currentIndex + 1] : undefined;

  return (
    <div>
      <section className="pt-4 pb-6 sm:pt-6 sm:pb-8">
        <SectionContainer>
          <Link href="/guias" className="text-[14px] font-semibold text-[#E1251B] hover:text-[#C01F16]">
            ← Volver a las guías
          </Link>
          <GuideHero guide={guide} />
        </SectionContainer>
      </section>

      {article ? (
        <GuideArticleBody guide={guide} previous={previous} next={next} />
      ) : (
        <GuideComingSoon guide={guide} previous={previous} next={next} />
      )}
    </div>
  );
}

function GuideHero({ guide }: { guide: Guide }) {
  const endpoint = guide.endpoint ? splitEndpoint(guide.endpoint) : null;
  const levelLabel = guide.level.charAt(0).toUpperCase() + guide.level.slice(1);

  return (
    <div className="mt-5 rounded-[24px] border border-[#E7EAEE] bg-white px-5 py-5 sm:px-8 sm:py-6">
      <p className="text-[12px] leading-5 text-[#8E8E8E]">
        <span className="font-semibold uppercase tracking-[0.14em] text-[#E1251B]">{guide.category}</span>
        <span> · Guía {guide.number}</span>
      </p>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#FFF1F0] text-[#E1251B]">
          <GuideIcon id={guide.icon} className="h-5 w-5" />
        </div>
        <h1 className="min-w-0 text-[26px] font-bold leading-[1.2] tracking-[0.2px] text-[#404040] sm:text-[32px]">
          {guide.title}
        </h1>
      </div>
      <p className="mt-3 max-w-[40rem] text-[15px] leading-6 text-[#707070]">{guide.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#F8F9FB] px-3 py-1.5 text-[12px] text-[#404040]">{levelLabel}</span>
        <span className="rounded-full bg-[#F8F9FB] px-3 py-1.5 text-[12px] text-[#404040]">{guide.minutes} min</span>
        {endpoint ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F9FB] px-3 py-1.5 font-mono text-[12px] text-[#404040]">
            <span className="font-semibold text-[#E1251B]">{endpoint.method}</span>
            <span>{endpoint.path}</span>
          </span>
        ) : null}
      </div>
    </div>
  );
}

function GuideComingSoon({
  guide,
  previous,
  next,
}: {
  guide: Guide;
  previous?: Guide;
  next?: Guide;
}) {
  return (
    <section className="pb-16 sm:pb-20">
      <SectionContainer>
        <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-5 py-8 sm:px-8 sm:py-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E1251B]">Próximamente</p>
          <p className="mt-3 max-w-[40rem] text-[16px] leading-7 text-[#707070]">{guide.description}</p>
          <p className="mt-6 text-[13px] text-[#8E8E8E]">Esta guía cubrirá:</p>
          <ol className="mt-3 max-w-[40rem] space-y-2">
            {guide.topics.map((topic, index) => (
              <li key={topic} className="flex gap-3 text-[15px] leading-6 text-[#404040]">
                <span className="w-6 shrink-0 font-mono text-[12px] text-[#8E8E8E]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="capitalize">{topic}</span>
              </li>
            ))}
          </ol>
          <GuidePager previous={previous} next={next} />
        </div>
      </SectionContainer>
    </section>
  );
}

function StepHeading({ number, title }: { number?: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4">
      {number ? <span className="font-mono text-[13px] text-[#8E8E8E]">{number}</span> : null}
      <h2 className="text-[20px] font-medium leading-7 text-[#404040] sm:text-[22px]">{title}</h2>
    </div>
  );
}

function GuideArticleBody({
  guide,
  previous,
  next,
}: {
  guide: Guide;
  previous?: Guide;
  next?: Guide;
}) {
  const article = guide.article;

  if (!article) {
    return null;
  }

  const tocItems = getGuideTocItems(article);
  const [lead, ...rest] = article.introduction;

  return (
    <section className="pb-16 sm:pb-20">
      <SectionContainer>
        <div className="-mx-5 sm:-mx-8 lg:hidden">
          <GuideToc items={tocItems} variant="mobile" />
        </div>
        <div className="overflow-hidden rounded-[24px] border border-[#E7EAEE] bg-white lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden border-r border-[#E7EAEE] px-6 pt-10 pb-8 lg:block">
            <GuideToc items={tocItems} variant="desktop" />
          </aside>

          <div className="min-w-0 px-5 sm:px-8">
            <section className="border-b border-[#E7EAEE] py-10">
              {lead ? <p className="text-[18px] leading-8 text-[#404040]">{lead}</p> : null}
              {rest.map((paragraph) => (
                <p
                  key={paragraph}
                  className={`mt-5 text-[16px] leading-7 text-[#707070] ${
                    paragraph.startsWith("Al terminar") ? "border-l-2 border-[#E1251B] pl-4 text-[#404040]" : ""
                  }`}
                >
                  <GuideProse text={paragraph} />
                </p>
              ))}
            </section>

            {article.sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-anchor border-b border-[#E7EAEE] py-10 last:border-b-0"
              >
                <StepHeading number={String(index + 1).padStart(2, "0")} title={section.title} />

                <div className="mt-5 space-y-4">
                  {section.explanation.map((paragraph) => (
                    <p key={paragraph} className="text-[16px] leading-7 text-[#707070]">
                      <GuideProse text={paragraph} />
                    </p>
                  ))}
                </div>

                {section.pendingNotes?.map((note) => (
                  <aside key={note} className="mt-6 border-l-[3px] border-[#C47B17] bg-[#F3EDE3] px-4 py-3">
                    <p className="text-[12px] font-medium text-[#C47B17]">Pendiente de confirmar</p>
                    <p className="mt-1 text-[14px] leading-6 text-[#8A4B00]">
                      <GuideProse text={formatPendingNote(note)} />
                    </p>
                  </aside>
                ))}

                {section.request ? (
                  <div className="mt-8">
                    {section.request.caption ? (
                      <p className="mb-3 text-[14px] leading-6 text-[#707070]">
                        <GuideProse text={section.request.caption} />
                      </p>
                    ) : null}
                    <GuideCodeBlock samples={section.request.samples} title="Request" />
                  </div>
                ) : null}

                {section.response ? (
                  <div className="mt-8">
                    {section.response.caption ? (
                      <p className="mb-3 text-[14px] leading-6 text-[#707070]">
                        <GuideProse text={section.response.caption} />
                      </p>
                    ) : null}
                    <GuideJsonBlock code={section.response.json} title="Response" meta={section.response.status} />
                  </div>
                ) : null}

                <div className="mt-8">
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#707070]">
                    Errores de este paso
                  </h3>
                  <div className="mt-3 divide-y divide-[#E7EAEE] border-y border-[#E7EAEE]">
                    {section.errors.map((error) => (
                      <article key={`${error.status}-${error.code}`} className="py-3">
                        <p className="flex flex-wrap items-center gap-2 font-mono text-[12px]">
                          <span className="rounded-full bg-[#FFF1F0] px-2 py-0.5 text-[#A11B1B]">{error.status}</span>
                          <span className="text-[#404040]">{error.code}</span>
                        </p>
                        <p className="mt-1.5 text-[13px] leading-5 text-[#707070]">
                          <span className="text-[#8E8E8E]">Causa. </span>
                          <GuideProse text={error.cause} />
                        </p>
                        <p className="mt-0.5 text-[13px] leading-5 text-[#707070]">
                          <span className="text-[#8E8E8E]">Solución. </span>
                          <GuideProse text={error.solution} />
                        </p>
                      </article>
                    ))}
                  </div>
                </div>

                {section.infoNotes?.map((note) => (
                  <aside key={note} className="mt-6 border-l-[3px] border-[#404040] bg-[#F8F9FB] px-4 py-3">
                    <p className="text-[12px] font-medium text-[#404040]">Nota</p>
                    <p className="mt-1 text-[14px] leading-6 text-[#707070]">
                      <GuideProse text={note} />
                    </p>
                  </aside>
                ))}
              </section>
            ))}

            <section id="flujo" className="scroll-anchor border-b border-[#E7EAEE] py-10">
              <StepHeading number={String(article.sections.length + 1).padStart(2, "0")} title={article.diagram.title} />
              <p className="mt-4 text-[15px] leading-7 text-[#707070]">
                Secuencia de punta a punta. Puede copiar el bloque y pegarlo en cualquier visor Mermaid.
              </p>
              <div className="mt-4">
                <GuideMermaidBlock source={article.diagram.mermaid} />
              </div>
            </section>

            <section id="checklist" className="scroll-anchor py-10">
              <StepHeading number={String(article.sections.length + 2).padStart(2, "0")} title="Antes de continuar" />
              <ol className="mt-6 space-y-3">
                {article.checklist.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-6 text-[#404040]">
                    <span
                      className="mt-0.5 inline-flex h-5 w-5 shrink-0 rounded-full border border-[#D5DAE0] bg-white"
                      aria-hidden="true"
                    />
                    <GuideProse text={item} />
                  </li>
                ))}
              </ol>
            </section>

            {article.references?.length ? (
              <section id="referencias" className="scroll-anchor border-t border-[#E7EAEE] py-10">
                <StepHeading number={String(article.sections.length + 3).padStart(2, "0")} title="Referencias" />
                <ul className="mt-6 space-y-3">
                  {article.references.map((reference) => (
                    <li key={reference.href}>
                      <a
                        href={reference.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[14px] leading-6 text-[#404040] underline decoration-[#E7EAEE] underline-offset-4 hover:text-[#E1251B] hover:decoration-[#E1251B]"
                      >
                        {reference.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <GuidePager previous={previous} next={next} />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

function GuidePager({ previous, next }: { previous?: Guide; next?: Guide }) {
  return (
    <nav className="flex flex-col gap-3 border-t border-[#E7EAEE] py-8 sm:flex-row sm:justify-between">
      {previous ? (
        <Link
          href={`/guias/${previous.slug}`}
          className="rounded-[16px] border border-[#E7EAEE] px-4 py-3 transition-colors hover:border-[#E1251B]/40"
        >
          <span className="block text-[12px] text-[#8E8E8E]">Anterior</span>
          <span className="mt-1 block text-[14px] font-semibold text-[#404040]">{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/guias/${next.slug}`}
          className="rounded-[16px] border border-[#E7EAEE] px-4 py-3 text-left transition-colors hover:border-[#E1251B]/40 sm:text-right"
        >
          <span className="block text-[12px] text-[#8E8E8E]">Siguiente</span>
          <span className="mt-1 block text-[14px] font-semibold text-[#404040]">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
