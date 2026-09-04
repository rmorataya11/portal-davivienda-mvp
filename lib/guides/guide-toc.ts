import type { GuideArticle } from "@/lib/guides/guides-content";

export type GuideTocItem = {
  id: string;
  number: string;
  label: string;
};

export function getGuideTocItems(article: GuideArticle): GuideTocItem[] {
  const steps = article.sections.map((section, index) => ({
    id: section.id,
    number: String(index + 1).padStart(2, "0"),
    label: section.title,
  }));

  const items: GuideTocItem[] = [
    ...steps,
    {
      id: "flujo",
      number: String(steps.length + 1).padStart(2, "0"),
      label: "Flujo",
    },
    {
      id: "checklist",
      number: String(steps.length + 2).padStart(2, "0"),
      label: "Checklist",
    },
  ];

  if (article.references?.length) {
    items.push({
      id: "referencias",
      number: String(items.length + 1).padStart(2, "0"),
      label: "Referencias",
    });
  }

  return items;
}

export function splitEndpoint(endpoint: string) {
  const [method, ...pathParts] = endpoint.split(" ");
  return {
    method: method ?? "",
    path: pathParts.join(" "),
  };
}

export function formatPendingNote(note: string) {
  return note.replace(/^<!--\s*PENDIENTE:\s*/i, "").replace(/\s*-->$/, "").trim();
}

export function formatGuideCategory(category: string) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}
