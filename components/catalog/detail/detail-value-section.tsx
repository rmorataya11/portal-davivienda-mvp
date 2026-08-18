import type { ApiDetail } from "../content/apis";
import { DetailSectionCard, ItemGrid } from "./detail-primitives";

export function DetailValueSection({ api }: { api: ApiDetail }) {
  return (
    <section id="value" className="pb-16">
      <div className="mx-auto grid max-w-[1366px] gap-5 px-4 sm:px-6 lg:px-[56px] lg:grid-cols-2">
        <DetailSectionCard eyebrow="Valor" title="Qué puede lograr">
          <ItemGrid items={api.benefits} />
        </DetailSectionCard>

        <DetailSectionCard eyebrow="Aplicación" title="Casos de uso">
          <ItemGrid items={api.useCases} />
        </DetailSectionCard>
      </div>
    </section>
  );
}
