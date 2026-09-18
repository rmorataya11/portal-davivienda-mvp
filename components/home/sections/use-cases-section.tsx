import { UseCaseCard } from "../cards/use-case-card";
import { useCaseCards } from "../content/use-cases";

export function UseCasesSection() {
  return (
    <section id="casos-de-uso" className="inspire-section scroll-anchor">
      <div className="inspire-frame">
        <div className="inspire-header">
          <h2 className="inspire-title">Inspírese con lo que puede lograr</h2>
          <p className="inspire-subtitle">
            Historias reales de negocio que puede hacer realidad. Elija la que más se parezca a su idea y descubra cómo
            darle vida.
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
