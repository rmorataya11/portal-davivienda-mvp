import type { ValueCard } from "../content/types";
import { ValueCardIcon } from "./value-card-icon";

export function TallValueCard({ card }: { card: ValueCard }) {
  return (
    <article className="why-card why-card-tall group">
      <span className="why-card-step">{card.step}</span>
      <ValueCardIcon step={card.step} />
      <div className="why-card-copy">
        <h3 className="why-card-title">{card.title}</h3>
        <p className="why-card-desc">{card.description}</p>
      </div>
    </article>
  );
}
