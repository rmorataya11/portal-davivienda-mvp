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
      <g stroke="#5A656C" strokeOpacity="0.28" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1180 -90C1420 40 1485 250 1325 455" strokeWidth="78" />
        <path d="M1115 -70C1385 70 1455 270 1270 460" strokeWidth="78" />
        <path d="M-90 430C40 640 290 760 560 620" strokeWidth="78" />
        <path d="M-70 500C80 690 320 790 580 655" strokeWidth="78" />
      </g>
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
