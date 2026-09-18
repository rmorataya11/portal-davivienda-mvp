import type { ValueCard } from "../content/types";
import { ValueCardDescription } from "./value-card-description";
import { ValueCardIcon } from "./value-card-icon";

export function WideValueCard({ card }: { card: ValueCard }) {
  return (
    <article className="why-card why-card-wide group">
      <span className="why-card-step">{card.step}</span>
      <div className="why-card-wide-body">
        <ValueCardIcon step={card.step} />
        <div className="why-card-copy">
          <h3 className="why-card-title">{card.title}</h3>
          <ValueCardDescription text={card.description} />
        </div>
      </div>
    </article>
  );
}
