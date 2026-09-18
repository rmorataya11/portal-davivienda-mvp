type BreakablePathProps = {
  value: string;
  className?: string;
};

export function BreakablePath({ value, className = "" }: BreakablePathProps) {
  const segments = value.split(/(\/)/);

  return (
    <span className={`min-w-0 wrap-break-word ${className}`.trim()}>
      {segments.map((segment, index) =>
        segment === "/" ? (
          <span key={`${segment}-${index}`}>
            /<wbr />
          </span>
        ) : (
          <span key={`${segment}-${index}`}>{segment}</span>
        ),
      )}
    </span>
  );
}
