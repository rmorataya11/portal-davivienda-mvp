type BreakablePathProps = {
  value: string;
  className?: string;
};

function splitBreakableChunks(value: string): string[] {
  const chunks: string[] = [];
  let buffer = "";
  const isDelimiter = (char: string) => "/._-".includes(char);

  for (const char of value) {
    if (isDelimiter(char)) {
      const last = buffer.at(-1);
      if (buffer && last && !isDelimiter(last) && last !== " ") {
        chunks.push(buffer);
        buffer = char;
      } else {
        buffer += char;
      }
      continue;
    }

    if (char === " ") {
      buffer += char;
      chunks.push(buffer);
      buffer = "";
      continue;
    }

    buffer += char;
  }

  if (buffer) {
    chunks.push(buffer);
  }

  if (chunks.length >= 2 && /^[/._-]+$/.test(chunks[chunks.length - 1] ?? "")) {
    const trailing = chunks.pop() ?? "";
    chunks[chunks.length - 1] += trailing;
  }

  return chunks.length > 0 ? chunks : [value];
}

export function BreakablePath({ value, className = "" }: BreakablePathProps) {
  const chunks = splitBreakableChunks(value);

  return (
    <span className={`flex min-w-0 max-w-full flex-wrap ${className}`.trim()}>
      {chunks.map((chunk, index) => (
        <span key={`${chunk}-${index}`} className="whitespace-nowrap">
          {chunk}
        </span>
      ))}
    </span>
  );
}
