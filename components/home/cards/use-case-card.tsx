import Link from "next/link";
import { useTranslations } from "next-intl";

import type { UseCaseCard as UseCaseCardData } from "../content/types";
import { UseCaseIcon } from "./use-case-icon";

export function UseCaseCard({ card }: { card: UseCaseCardData }) {
  const t = useTranslations("Home.useCases");

  return (
    <article className="inspire-card">
      <div className="inspire-card-header">
        <span className="inspire-card-icon">
          <UseCaseIcon name={card.icon} />
        </span>
        <p className="inspire-card-category">{card.category}</p>
      </div>
      {card.imageSrc ? (
        <img
          src={card.imageSrc}
          alt=""
          className="inspire-card-media"
          style={card.imagePosition ? { objectPosition: card.imagePosition } : undefined}
        />
      ) : (
        <div className="inspire-card-media" />
      )}
      <h3 className="inspire-card-title">{card.title}</h3>
      <span className="inspire-card-rule" aria-hidden="true" />
      <p className="inspire-card-desc">{card.description}</p>
      <Link href="/catalogo-apis" className="inspire-card-cta">
        {t("viewHowItWorks")}
      </Link>
    </article>
  );
}
