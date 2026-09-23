export type FooterMessageKey =
  | "platform"
  | "developers"
  | "support"
  | "home"
  | "integrationGuides"
  | "apiCatalog"
  | "documentation"
  | "faq"
  | "createAccount"
  | "signIn"
  | "sandbox"
  | "technicalDocumentation"
  | "helpCenter"
  | "contactExpert"
  | "frequentQuestions";

export type FooterLink = {
  key: FooterMessageKey;
  href: string;
};

export const platformLinks: FooterLink[] = [
  { key: "home", href: "/" },
  { key: "integrationGuides", href: "/faq#guias-integracion" },
  { key: "apiCatalog", href: "/catalogo-apis" },
  { key: "documentation", href: "/documentacion" },
  { key: "faq", href: "/faq" },
];

export const developerLinks: FooterLink[] = [
  { key: "createAccount", href: "/crear-cuenta" },
  { key: "signIn", href: "/iniciar-sesion" },
  { key: "sandbox", href: "/dashboard" },
  { key: "technicalDocumentation", href: "/documentacion" },
];

export const supportLinks: FooterLink[] = [
  { key: "helpCenter", href: "/faq#preguntas-frecuentes" },
  { key: "contactExpert", href: "/faq#soporte-prioritario" },
  { key: "frequentQuestions", href: "/faq#preguntas-frecuentes" },
];
