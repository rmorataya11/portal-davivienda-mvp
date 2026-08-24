const WEEK_DAYS = [
  { key: "L", label: "Lun" },
  { key: "M", label: "Mar" },
  { key: "X", label: "Mié" },
  { key: "J", label: "Jue" },
  { key: "V", label: "Vie" },
  { key: "S", label: "Sáb" },
  { key: "D", label: "Dom" },
] as const;

export function WeekActivityChart({ values }: { values: number[] }) {
  const maxValue = Math.max(...values, 1);
  const total = values.reduce((sum, value) => sum + value, 0);
  const peakIndex = values.reduce((best, value, index, list) => (value > list[best] ? index : best), 0);
  const todayIndex = (() => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
  })();
  const midValue = Math.round(maxValue / 2);

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-medium text-[#8E8E8E]">Actividad de la semana</p>
          <p className="mt-1 text-[15px] font-semibold text-[#141F25]">{total.toLocaleString("es-CO")} llamadas</p>
        </div>
        <p className="max-w-[148px] text-right text-[12px] leading-5 text-[#8E8E8E]">
          {total === 0 ? "Sin tráfico todavía" : `Pico el ${WEEK_DAYS[peakIndex].label}`}
        </p>
      </div>

      <div className="mt-5 flex gap-2">
        <div className="flex h-[140px] w-8 shrink-0 flex-col justify-between pb-6 text-right text-[10px] text-[#B0B6BC]">
          <span>{maxValue}</span>
          <span>{midValue}</span>
          <span>0</span>
        </div>

        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[116px]">
            <div className="absolute inset-x-0 top-0 h-px bg-[#E7EAEE]" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#E7EAEE]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-[#E7EAEE]" />
          </div>

          <div className="flex h-[116px] items-end gap-2">
            {WEEK_DAYS.map((day, index) => {
              const value = values[index] ?? 0;
              const height = value === 0 ? 4 : Math.max((value / maxValue) * 100, 12);
              const isToday = index === todayIndex;

              return (
                <div key={day.key} className="group relative flex h-full flex-1 items-end justify-center">
                  <div className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded-md bg-[#141F25] px-2 py-1 text-[11px] font-medium whitespace-nowrap text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                    {value.toLocaleString("es-CO")} llamadas
                  </div>
                  <div
                    className={`w-full max-w-8 rounded-t-[10px] transition-colors ${
                      isToday ? "bg-[#E1251B]" : "bg-[#2C3A43] group-hover:bg-[#404040]"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex gap-2">
            {WEEK_DAYS.map((day, index) => (
              <span
                key={day.key}
                className={`flex-1 text-center text-[11px] ${
                  index === todayIndex ? "font-semibold text-[#E1251B]" : "text-[#8E8E8E]"
                }`}
              >
                {day.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
