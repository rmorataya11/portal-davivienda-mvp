import type { Guide, GuideArticle, GuideTopicSection } from "@/lib/guides/guides-content";

export type SupportTranslate = (key: string) => string;

const guideMessageKeys: Record<string, string> = {
  "autenticacion-mtls-oauth": "autenticacion",
  "idempotencia-reintentos": "idempotencia",
  "paso-a-produccion": "pasoProduccion",
  "manejo-errores-cierre-sesion": "errores",
};

function toSectionKey(sectionId: string) {
  return sectionId.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function readList(t: SupportTranslate, prefix: string, values: string[]) {
  return values.map((_, index) => t(`${prefix}.${index}`));
}

function localizeSection(section: GuideTopicSection, guideKey: string, t: SupportTranslate): GuideTopicSection {
  const sectionKey = toSectionKey(section.id);
  const base = `guides.items.${guideKey}.sections.${sectionKey}`;

  return {
    ...section,
    title: t(`${base}.title`),
    explanation: readList(t, `${base}.explanation`, section.explanation),
    pendingNotes: section.pendingNotes ? readList(t, `${base}.pendingNotes`, section.pendingNotes) : undefined,
    infoNotes: section.infoNotes ? readList(t, `${base}.infoNotes`, section.infoNotes) : undefined,
    request: section.request
      ? {
          ...section.request,
          caption: section.request.caption ? t(`${base}.requestCaption`) : undefined,
        }
      : undefined,
    response: section.response
      ? {
          ...section.response,
          caption: section.response.caption ? t(`${base}.responseCaption`) : undefined,
        }
      : undefined,
    errors: section.errors.map((error) => ({
      ...error,
      cause: t(`${base}.errors.${error.code}.cause`),
      solution: t(`${base}.errors.${error.code}.solution`),
    })),
  };
}

function localizeArticle(article: GuideArticle, guideKey: string, t: SupportTranslate): GuideArticle {
  const base = `guides.items.${guideKey}`;

  return {
    ...article,
    introduction: readList(t, `${base}.introduction`, article.introduction),
    sections: article.sections.map((section) => localizeSection(section, guideKey, t)),
    diagram: {
      ...article.diagram,
      title: t(`${base}.diagramTitle`),
      mermaid: t(`${base}.diagramMermaid`),
    },
    checklist: readList(t, `${base}.checklist`, article.checklist),
  };
}

export function getGuideMessageKey(slug: string) {
  return guideMessageKeys[slug] ?? slug;
}

export function localizeGuide(guide: Guide, t: SupportTranslate): Guide {
  const guideKey = getGuideMessageKey(guide.slug);
  const base = `guides.items.${guideKey}`;

  return {
    ...guide,
    title: t(`${base}.title`),
    category: t(`guides.categories.${guide.category}`),
    description: t(`${base}.description`),
    topics: readList(t, `${base}.topics`, guide.topics),
    article: guide.article ? localizeArticle(guide.article, guideKey, t) : null,
  };
}

export function localizeGuides(guides: Guide[], t: SupportTranslate) {
  return guides.map((guide) => localizeGuide(guide, t));
}
