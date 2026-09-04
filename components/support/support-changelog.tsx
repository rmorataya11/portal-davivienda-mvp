import { SectionContainer } from "@/components/ui/layout";
import { changelogEntries, type ChangelogType } from "@/lib/support/changelog";

const typeLabel: Record<ChangelogType, string> = {
  nuevo: "Nuevo",
  cambio: "Cambio",
  deprecacion: "Deprecación",
};

const typeClass: Record<ChangelogType, string> = {
  nuevo: "bg-[#EFFCF5] text-[#347659]",
  cambio: "bg-[#FFF8EC] text-[#C47B17]",
  deprecacion: "bg-[#FFE9E9] text-[#A11B1B]",
};

function formatDate(value: string) {
  const parsed = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export function SupportChangelog() {
  const entries = [...changelogEntries].sort((left, right) => right.date.localeCompare(left.date));

  return (
    <section id="novedades" className="scroll-mt-36 bg-white pb-16 sm:pb-20">
      <SectionContainer>
        <h2 className="text-[24px] font-bold tracking-[0.2px] text-[#141F25] sm:text-[32px]">Qué hay de nuevo</h2>
        <p className="mt-3 max-w-[640px] text-[15px] leading-7 text-[#6A7178]">
          Cambios recientes en las APIs: altas, ajustes y retiros. El historial de ejemplo sirve para revisar el formato
          hasta que el feed real esté conectado.
        </p>

        <ol className="mt-8 divide-y divide-[#D8DCE1] border-t border-[#D8DCE1]">
          {entries.map((entry) => (
            <li key={`${entry.date}-${entry.title}`} className="py-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <time dateTime={entry.date} className="font-mono text-[12px] text-[#8E8E8E]">
                  {formatDate(entry.date)}
                </time>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-medium ${typeClass[entry.type]}`}
                >
                  {typeLabel[entry.type]}
                </span>
                {entry.apiAffected ? (
                  <span className="font-mono text-[12px] text-[#5C656C]">{entry.apiAffected}</span>
                ) : null}
              </div>
              <h3 className="mt-2 text-[16px] font-semibold tracking-[0.2px] text-[#141F25]">{entry.title}</h3>
              <p className="mt-2 max-w-[720px] text-[15px] leading-7 text-[#6A7178]">{entry.description}</p>
            </li>
          ))}
        </ol>
      </SectionContainer>
    </section>
  );
}
