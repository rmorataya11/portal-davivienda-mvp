import type { ValueCard } from "../content/types";
import { ValueCardIcon } from "./value-card-icon";

function CardDescription({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <p className="why-card-desc">
      {lines.map((line, index) => (
        <span key={index}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </p>
  );
}

export function WideValueCard({ card }: { card: ValueCard }) {
  return (
    <article className="why-card why-card-wide group">
      <span className="why-card-step">{card.step}</span>
      <div className="why-card-wide-body">
        <ValueCardIcon step={card.step} />
        <div className="why-card-copy">
          <h3 className="why-card-title">{card.title}</h3>
          <CardDescription text={card.description} />
        </div>
      </div>
    </article>
  );
}
