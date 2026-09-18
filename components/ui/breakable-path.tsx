type BreakablePathProps = {
  value: string;
  className?: string;
};

export function BreakablePath({ value, className = "" }: BreakablePathProps) {
  const parts = value.split(/([/._-])/);

  return (
    <span className={`min-w-0 [overflow-wrap:normal] [word-break:normal] ${className}`.trim()}>
      {parts.map((part, index) => {
        if (!part) {
          return null;
        }

        if (/^[/._-]$/.test(part)) {
          return (
            <span key={`${part}-${index}`}>
              {part}
              {"\u200B"}
            </span>
          );
        }

        return (
          <span key={`${part}-${index}`} className="whitespace-nowrap">
            {part}
          </span>
        );
      })}
    </span>
  );
}
