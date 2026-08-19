type RadioGroupProps = {
  legend: string;
  name: string;
  required?: boolean;
  error?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
};

export function RadioGroup({ legend, name, required, error, options, value, onChange }: RadioGroupProps) {
  const errorId = `${name}-error`;

  return (
    <fieldset id={name} tabIndex={-1} className="outline-none">
      <legend className="text-[15px] font-bold tracking-[0.2px] text-[#141F25]">
        {legend}
        {required ? <span className="text-[#E1251B]"> *</span> : null}
      </legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-3 rounded-[10px] border px-4 py-3 text-[14px] transition-colors ${
                selected
                  ? "border-[#E1251B] bg-[#FFF8F8] text-[#141F25]"
                  : "border-[#D5DAE0] bg-white text-[#404040] hover:border-[#B8BFC6]"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                required={required}
                onChange={() => onChange?.(option.value)}
                className="h-4 w-4 accent-[#E1251B]"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 text-[13px] leading-5 text-[#E1251B]">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
