type CatalogGlyphProps = {
  src: string;
  className?: string;
};

export function CatalogGlyph({ src, className }: CatalogGlyphProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-[#8E8E8E] ${className ?? ""}`}
      style={{
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
