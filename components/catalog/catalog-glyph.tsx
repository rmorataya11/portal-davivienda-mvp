type CatalogGlyphProps = {
  src: string;
  className?: string;
  color?: string;
};

export function CatalogGlyph({ src, className, color = "#8E8E8E" }: CatalogGlyphProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 ${className ?? ""}`}
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
