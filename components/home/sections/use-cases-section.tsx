import { useTranslations } from "next-intl";

import { UseCaseCard } from "../cards/use-case-card";
import { useCaseCardDefinitions } from "../content/use-cases";

export function UseCasesSection() {
  const t = useTranslations("Home.useCases");
  const useCaseCards = useCaseCardDefinitions.map((card) => ({
    ...card,
    category: t(`cards.${card.messageKey}.category`),
    title: t(`cards.${card.messageKey}.title`),
    description: t(`cards.${card.messageKey}.description`),
  }));

  return (
    <section id="casos-de-uso" className="inspire-section scroll-anchor">
      <div className="inspire-frame">
        <div className="inspire-header">
          <h2 className="inspire-title">{t("title")}</h2>
          <p className="inspire-subtitle">
            {t("description")}
          </p>
        </div>

        <div className="inspire-grid">
          {useCaseCards.map((card) => (
            <UseCaseCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
