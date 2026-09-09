import { TallValueCard } from "../cards/tall-value-card";
import { WideValueCard } from "../cards/wide-value-card";
import { valueCards } from "../content/value-proposition";

function WhyBackgroundBands() {
  return (
    <svg
      className="why-bands"
      viewBox="0 0 1366 712"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Sustracción 1 — 483.45×284.64, esquina superior derecha */}
      <path
        d="M923 40A443 245 0 0 1 1326 245"
        stroke="#2A3239"
        strokeWidth="80"
        strokeLinecap="round"
      />
      {/* Sustracción 2 — 329×154, esquina inferior izquierda */}
      <path
        d="M29 587A300 125 0 0 1 300 683"
        stroke="#2A3239"
        strokeWidth="58"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ValuePropositionSection() {
  const [firstCard, secondCard, thirdCard, fourthCard] = valueCards;

  return (
    <section className="why-section">
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
