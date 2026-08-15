export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className={`text-[15px] ${light ? "text-white/85" : "text-[#E1251B]"}`}>{eyebrow}</p>
      ) : null}
      <h2
        className={`mt-1 text-3xl font-bold tracking-[-0.02em] sm:text-[46px] sm:leading-[1.08] ${light ? "text-white" : "text-[#404040]"}`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`mt-5 max-w-2xl text-lg leading-8 ${light ? "text-white/72" : "text-[#8E8E8E]"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
