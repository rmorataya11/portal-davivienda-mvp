import Link from "next/link";

import { GuideCodeBlock, GuideJsonBlock, GuideMermaidBlock } from "@/components/guides/guide-code-block";
import { GuideProse } from "@/components/guides/guide-prose";
import { GuideToc } from "@/components/guides/guide-toc";
import { SectionContainer } from "@/components/ui/layout";
import { formatGuideCategory, formatPendingNote, getGuideTocItems, splitEndpoint } from "@/lib/guides/guide-toc";
import type { Guide } from "@/lib/guides/guides-content";
import { guides } from "@/lib/guides/guides-content";

export function GuideDetailPage({ guide }: { guide: Guide }) {
  const article = guide.article;
  const currentIndex = guides.findIndex((item) => item.slug === guide.slug);
  const previous = currentIndex > 0 ? guides[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < guides.length - 1 ? guides[currentIndex + 1] : undefined;
  const endpoint = guide.endpoint ? splitEndpoint(guide.endpoint) : null;

  return (
    <div className="bg-white">
      <section className="border-b border-[#D8DCE1] pt-4 pb-8 sm:pt-6 sm:pb-10">
        <SectionContainer>
          <Link href="/guias" className="text-[14px] text-[#E1251B] hover:text-[#E1111C]">
            ← Volver a las guías
          </Link>

          <div className="mt-6 flex items-baseline justify-between gap-6">
            <p className="font-mono text-[12px] text-[#8E8E8E]">Guía {guide.number}</p>
            <p className="text-[12px] text-[#8E8E8E]">{guide.minutes} min de lectura</p>
          </div>

          <h1 className="mt-3 max-w-[40rem] text-[28px] font-bold leading-[1.2] text-[#141F25] sm:text-[32px] lg:text-[36px]">
            {guide.title}
          </h1>

          <div className="mt-3 flex items-center text-[13px] text-[#5C656C]">
            <span>{formatGuideCategory(guide.category)}</span>
            <span className="mx-3 h-3 w-px bg-[#D8DCE1]" aria-hidden="true" />
            <span>{guide.level.charAt(0).toUpperCase() + guide.level.slice(1)}</span>
          </div>

          {endpoint ? (
            <p className="mt-6 inline-flex items-stretch bg-[#141F25] font-mono text-[13px] leading-none">
              <span className="px-3 py-2.5 text-white/45">{endpoint.method}</span>
              <span className="px-3 py-2.5 text-[#E8E4DC]">{endpoint.path}</span>
            </p>
          ) : null}
        </SectionContainer>
      </section>

      {article ? (
        <GuideArticleBody guide={guide} previous={previous} next={next} />
      ) : (
        <section className="py-12">
          <SectionContainer>
            <p className="max-w-[40rem] text-[16px] leading-7 text-[#3C444B]">{guide.description}</p>
            <p className="mt-4 text-[14px] leading-6 text-[#8E8E8E]">
              El contenido de esta guía se publica en el siguiente lote. La ruta ya está lista:{" "}
              <code className="font-mono text-[13px] text-[#141F25]">/guias/{guide.slug}</code>
            </p>
          </SectionContainer>
        </section>
      )}
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
    <SectionContainer>
      <div className="-mx-5 sm:-mx-8 lg:hidden">
        <GuideToc items={tocItems} variant="mobile" />
      </div>
      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14 xl:gap-16">
        <aside className="hidden lg:block lg:pt-10">
          <div className="lg:sticky lg:top-[140px]">
            <GuideToc items={tocItems} variant="desktop" />
          </div>
        </aside>

        <div className="min-w-0 pb-20">
          <section className="max-w-[42rem] border-b border-[#D8DCE1] py-10">
            {lead ? <p className="text-[18px] leading-8 text-[#141F25]">{lead}</p> : null}
            {rest.map((paragraph) => (
              <p
                key={paragraph}
                className={`mt-5 text-[16px] leading-7 text-[#3C444B] ${
                  paragraph.startsWith("Al terminar") ? "border-l-2 border-[#141F25] pl-4" : ""
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
              className="scroll-mt-36 border-b border-[#D8DCE1] py-10 last:border-b-0"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[13px] text-[#8E8E8E]">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="text-[20px] font-medium leading-7 text-[#141F25] sm:text-[22px]">{section.title}</h2>
              </div>

              <div className="mt-5 max-w-[42rem] space-y-4">
                {section.explanation.map((paragraph) => (
                  <p key={paragraph} className="text-[16px] leading-7 text-[#3C444B]">
                    <GuideProse text={paragraph} />
                  </p>
                ))}
              </div>

              {section.pendingNotes?.map((note) => (
                <aside
                  key={note}
                  className="mt-6 border-l-[3px] border-[#C47B17] bg-[#F3EDE3] px-4 py-3"
                >
                  <p className="text-[12px] font-medium text-[#C47B17]">Pendiente de confirmar</p>
                  <p className="mt-1 text-[14px] leading-6 text-[#8A4B00]">
                    <GuideProse text={formatPendingNote(note)} />
                  </p>
                </aside>
              ))}

              {section.request ? (
                <div className="mt-8">
                  <h3 className="font-mono text-[12px] text-[#8E8E8E]">Request</h3>
                  {section.request.caption ? (
                    <p className="mt-2 max-w-[42rem] text-[14px] leading-6 text-[#5C656C]">
                      <GuideProse text={section.request.caption} />
                    </p>
                  ) : null}
                  <div className="mt-3">
                    <GuideCodeBlock samples={section.request.samples} />
                  </div>
                </div>
              ) : null}

              {section.response ? (
                <div className="mt-8">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h3 className="font-mono text-[12px] text-[#8E8E8E]">Response</h3>
                    <span className="font-mono text-[12px] text-[#7A9A86]">{section.response.status}</span>
                  </div>
                  {section.response.caption ? (
                    <p className="mt-2 max-w-[42rem] text-[14px] leading-6 text-[#5C656C]">
                      <GuideProse text={section.response.caption} />
                    </p>
                  ) : null}
                  <div className="mt-3">
                    <GuideJsonBlock code={section.response.json} />
                  </div>
                </div>
              ) : null}

              <div className="mt-8">
                <h3 className="font-mono text-[12px] text-[#8E8E8E]">Errores de este paso</h3>
                <div className="mt-3 border-t border-[#D8DCE1]">
                  {section.errors.map((error) => (
                    <article key={`${error.status}-${error.code}`} className="border-b border-[#D8DCE1] py-4">
                      <p className="flex flex-wrap items-baseline gap-3 font-mono text-[13px]">
                        <span className="text-[#A11B1B]">{error.status}</span>
                        <span className="text-[#141F25]">{error.code}</span>
                      </p>
                      <p className="mt-2 text-[14px] leading-6 text-[#3C444B]">
                        <span className="text-[#8E8E8E]">Causa. </span>
                        <GuideProse text={error.cause} />
                      </p>
                      <p className="mt-1 text-[14px] leading-6 text-[#3C444B]">
                        <span className="text-[#8E8E8E]">Solución. </span>
                        <GuideProse text={error.solution} />
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              {section.infoNotes?.map((note) => (
                <aside key={note} className="mt-6 border-l-[3px] border-[#141F25] bg-[#F4F5F6] px-4 py-3">
                  <p className="text-[12px] font-medium text-[#141F25]">Nota</p>
                  <p className="mt-1 text-[14px] leading-6 text-[#3C444B]">
                    <GuideProse text={note} />
                  </p>
                </aside>
              ))}
            </section>
          ))}

          <section id="flujo" className="scroll-mt-36 border-b border-[#D8DCE1] py-10">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-[13px] text-[#8E8E8E]">
                {String(article.sections.length + 1).padStart(2, "0")}
              </span>
              <h2 className="text-[20px] font-medium leading-7 text-[#141F25] sm:text-[22px]">{article.diagram.title}</h2>
            </div>
            <p className="mt-4 max-w-[42rem] text-[15px] leading-7 text-[#5C656C]">
              Secuencia de punta a punta. Puede copiar el bloque y pegarlo en cualquier visor Mermaid.
            </p>
            <div className="mt-4">
              <GuideMermaidBlock source={article.diagram.mermaid} />
            </div>
          </section>

          <section id="checklist" className="scroll-mt-36 py-10">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-[13px] text-[#8E8E8E]">
                {String(article.sections.length + 2).padStart(2, "0")}
              </span>
              <h2 className="text-[20px] font-medium leading-7 text-[#141F25] sm:text-[22px]">Antes de continuar</h2>
            </div>
            <ol className="mt-6 max-w-[42rem] border-t border-[#D8DCE1]">
              {article.checklist.map((item, index) => (
                <li key={item} className="flex gap-4 border-b border-[#D8DCE1] py-3 text-[15px] leading-6 text-[#3C444B]">
                  <span className="w-6 shrink-0 font-mono text-[12px] text-[#8E8E8E]">{index + 1}.</span>
                  <GuideProse text={item} />
                </li>
              ))}
            </ol>
          </section>

          {article.references?.length ? (
            <section id="referencias" className="scroll-mt-36 border-t border-[#D8DCE1] py-10">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[13px] text-[#8E8E8E]">
                  {String(article.sections.length + 3).padStart(2, "0")}
                </span>
                <h2 className="text-[20px] font-medium leading-7 text-[#141F25] sm:text-[22px]">Referencias</h2>
              </div>
              <ul className="mt-6 max-w-[42rem] space-y-3">
                {article.references.map((reference) => (
                  <li key={reference.href}>
                    <a
                      href={reference.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[14px] leading-6 text-[#141F25] underline decoration-[#D8DCE1] underline-offset-4 hover:text-[#E1251B] hover:decoration-[#E1251B]"
                    >
                      {reference.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <nav className="flex flex-col gap-6 border-t border-[#D8DCE1] pt-8 sm:flex-row sm:justify-between">
            {previous ? (
              <Link href={`/guias/${previous.slug}`} className="text-[14px] text-[#5C656C] hover:text-[#E1251B]">
                <span className="block text-[12px] text-[#8E8E8E]">Anterior</span>
                <span className="mt-1 block text-[#141F25]">{previous.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/guias/${next.slug}`} className="text-left text-[14px] text-[#5C656C] hover:text-[#E1251B] sm:text-right">
                <span className="block text-[12px] text-[#8E8E8E]">Siguiente</span>
                <span className="mt-1 block text-[#141F25]">{next.title}</span>
              </Link>
            ) : null}
          </nav>
        </div>
      </div>
    </SectionContainer>
  );
}
