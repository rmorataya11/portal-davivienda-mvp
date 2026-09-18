import { TallValueCard } from "../cards/tall-value-card";
import { WideValueCard } from "../cards/wide-value-card";
import { valueCards } from "../content/value-proposition";

function WhyBackgroundBands() {
  return (
    <div className="why-bands" aria-hidden="true">
      <img
        src="/why-boomerang.png"
        alt=""
        className="why-boomerang why-boomerang-tr"
      />
      <img
        src="/why-boomerang.png"
        alt=""
        className="why-boomerang why-boomerang-bl"
      />
    </div>
  );
}

export function ValuePropositionSection() {
  const [firstCard, secondCard, thirdCard, fourthCard] = valueCards;

  return (
    <section className="why-section scroll-anchor">
      <div className="why-frame">
        <WhyBackgroundBands />
        <div className="why-header">
          <p className="why-eyebrow">Por qué Davivienda</p>
          <h2 className="why-subtitle">Pensado para acompañar a su negocio</h2>
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
