"use client";

import { useEffect, useState } from "react";

import { ContentAccessGate } from "@/components/auth/content-access-gate";
import { GuideCodeBlock, GuideJsonBlock, GuideMermaidBlock } from "@/components/guides/guide-code-block";
import { GuideIcon } from "@/components/guides/guide-icons";
import { GuideProse } from "@/components/guides/guide-prose";
import { guides, type Guide, type GuideArticle } from "@/lib/guides/guides-content";

export function GuideAccordion() {
  const [openGuideId, setOpenGuideId] = useState("");

  useEffect(() => {
    function openGuideFromHash() {
      const hash = window.location.hash.replace(/^#guia-/, "");
      const guide = guides.find((item) => item.slug === hash);

      if (guide) {
        setOpenGuideId(guide.id);
      }
    }

    const animationFrame = window.requestAnimationFrame(openGuideFromHash);
    window.addEventListener("hashchange", openGuideFromHash);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("hashchange", openGuideFromHash);
    };
  }, []);

  return (
    <div className="divide-y divide-[#E7EAEE] overflow-hidden rounded-[24px] border border-[#E7EAEE] bg-white">
      {guides.map((guide) => {
        const isOpen = openGuideId === guide.id;
        const buttonId = `guide-button-${guide.id}`;
        const panelId = `guide-panel-${guide.id}`;

        return (
          <article key={guide.id} id={`guia-${guide.slug}`} className="scroll-anchor">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenGuideId(isOpen ? "" : guide.id)}
                className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-[#F8F9FB] sm:px-7"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#FFF1F0] text-[#E1251B]">
                  <GuideIcon id={guide.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#E1251B]">
                    {guide.category} · {guide.number}
                  </span>
                  <span className="mt-1 block text-[17px] font-bold leading-6 text-[#404040] sm:text-[18px]">
                    {guide.title}
                  </span>
                  <span className="mt-1 block text-[13px] leading-5 text-[#8E8E8E]">
                    Nivel {guide.level} · {guide.minutes} min{guide.article ? "" : " · Próximamente"}
                  </span>
                </span>
                <ChevronIcon open={isOpen} />
              </button>
            </h3>

            {isOpen ? (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="border-t border-[#E7EAEE] px-5 py-6 sm:px-7">
                <ContentAccessGate
                  eyebrow="Guías de Integración"
                  fallbackPath="/faq#guias-integracion"
                  description="El detalle técnico de las guías es privado. Necesita una cuenta de desarrollador para consultarlo."
                  variant="embedded"
                >
                  <GuidePanel guide={guide} />
                </ContentAccessGate>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function GuidePanel({ guide }: { guide: Guide }) {
  if (!guide.article) {
    return (
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E1251B]">Próximamente</p>
        <p className="mt-3 max-w-[48rem] text-[16px] leading-7 text-[#707070]">{guide.description}</p>
        <p className="mt-6 text-[13px] text-[#8E8E8E]">Esta guía cubrirá:</p>
        <ol className="mt-3 max-w-[48rem] space-y-2">
          {guide.topics.map((topic, index) => (
            <li key={topic} className="flex gap-3 text-[15px] leading-6 text-[#404040]">
              <span className="w-6 shrink-0 font-mono text-[12px] text-[#8E8E8E]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="capitalize">{topic}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return <GuideArticleContent article={guide.article} guideSlug={guide.slug} />;
}

function GuideArticleContent({ article, guideSlug }: { article: GuideArticle; guideSlug: string }) {
  const [lead, ...rest] = article.introduction;

  return (
    <div className="min-w-0">
      <section className="border-b border-[#E7EAEE] pb-8">
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
        <section key={section.id} id={`${guideSlug}-${section.id}`} className="border-b border-[#E7EAEE] py-8">
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
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#707070]">
              Errores de este paso
            </h4>
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

      <section className="border-b border-[#E7EAEE] py-8">
        <StepHeading number={String(article.sections.length + 1).padStart(2, "0")} title={article.diagram.title} />
        <p className="mt-4 text-[15px] leading-7 text-[#707070]">
          Secuencia de punta a punta. Puede copiar el bloque y pegarlo en cualquier visor Mermaid.
        </p>
        <div className="mt-4">
          <GuideMermaidBlock source={article.diagram.mermaid} />
        </div>
      </section>

      <section className="py-8">
        <StepHeading number={String(article.sections.length + 2).padStart(2, "0")} title="Antes de continuar" />
        <ol className="mt-6 space-y-3">
          {article.checklist.map((item) => (
            <li key={item} className="flex gap-3 text-[15px] leading-6 text-[#404040]">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 rounded-full border border-[#D5DAE0] bg-white" />
              <GuideProse text={item} />
            </li>
          ))}
        </ol>
      </section>

      {article.references?.length ? (
        <section className="border-t border-[#E7EAEE] py-8">
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
    </div>
  );
}

function StepHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="font-mono text-[13px] text-[#8E8E8E]">{number}</span>
      <h4 className="text-[20px] font-medium leading-7 text-[#404040] sm:text-[22px]">{title}</h4>
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-5 w-5 shrink-0 text-[#8E8E8E] transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      aria-hidden="true"
    >
      <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatPendingNote(note: string) {
  return note.replace(/^<!--\s*PENDIENTE:\s*/i, "").replace(/\s*-->$/, "").trim();
}
