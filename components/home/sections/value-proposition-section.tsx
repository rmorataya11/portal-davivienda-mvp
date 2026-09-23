import { useTranslations } from "next-intl";

import { TallValueCard } from "../cards/tall-value-card";
import { WideValueCard } from "../cards/wide-value-card";
import { valueCardDefinitions } from "../content/value-proposition";

function WhyBackgroundBands() {
  return (
    <div className="why-bands" aria-hidden="true">
      <div className="why-boomerang why-boomerang-tr" />
      <div className="why-boomerang why-boomerang-bl" />
    </div>
  );
}

export function ValuePropositionSection() {
  const t = useTranslations("Home.valueProposition");
  const valueCards = valueCardDefinitions.map((card) => ({
    ...card,
    title: t(`cards.${card.messageKey}.title`),
    description: t(`cards.${card.messageKey}.description`),
  }));
  const [firstCard, secondCard, thirdCard, fourthCard] = valueCards;

  return (
    <section className="why-section scroll-anchor">
      <div className="why-frame">
        <WhyBackgroundBands />
        <div className="why-header">
          <p className="why-eyebrow">{t("eyebrow")}</p>
          <h2 className="why-subtitle">{t("title")}</h2>
        </div>

        <div className="why-grid">
          <TallValueCard card={firstCard} />
          <TallValueCard card={secondCard} />
          <div className="why-wide-col">
            <WideValueCard card={thirdCard} />
            <WideValueCard card={fourthCard} />
          </div>
        </div>
      </div>
    </section>
  );
}
