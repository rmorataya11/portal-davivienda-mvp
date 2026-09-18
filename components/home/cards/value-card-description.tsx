export function ValueCardDescription({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <p className="why-card-desc">
      <span className="why-card-desc-responsive">{text.replace(/\n/g, " ")}</span>
      <span className="why-card-desc-desktop">
        {lines.map((line, index) => (
          <span key={index}>
            {index > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </span>
    </p>
  );
}
