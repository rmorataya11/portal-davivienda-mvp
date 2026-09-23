import Link from "next/link";
import { useTranslations } from "next-intl";

export function HeroSection() {
  const t = useTranslations("Home.hero");

  return (
    <section id="inicio" className="scroll-anchor relative overflow-hidden">
      <div className="hero-frame">
        <div className="hero-scene" aria-hidden="true" />

        <div className="hero-card">
          <p className="hero-badge">{t("badge")}</p>
          <h1 className="hero-title">
            {t("title")}
          </h1>
          <p className="hero-lead">
            {t("description")}
          </p>
          <div className="hero-actions">
            <Link href="/crear-cuenta" className="hero-cta hero-cta-primary">
              {t("createFreeAccount")}
            </Link>
            <Link href="#catalogo" className="hero-cta hero-cta-secondary">
              {t("exploreApiCatalog")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
