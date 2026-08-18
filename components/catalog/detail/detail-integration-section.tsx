import type { ApiDetail } from "../content/apis";
import { DetailSectionCard } from "./detail-primitives";

export function DetailIntegrationSection({ api }: { api: ApiDetail }) {
  return (
    <section id="integration" className="pb-16">
      <div className="mx-auto grid max-w-[1366px] gap-5 px-4 sm:px-6 lg:px-[56px] lg:grid-cols-[0.9fr_1.1fr]">
        <DetailSectionCard eyebrow="Integración" title="Cómo empezar">
          <p className="text-[16px] leading-7 tracking-[0.32px] text-[#707070]">
            Todo lo necesario para preparar su primer consumo de la API y pasar de exploración a integración real.
          </p>
          <div className="grid gap-4">
            <div className="rounded-[22px] bg-[#F2F3F5] px-6 py-5">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#8E8E8E]">Autenticación</p>
              <p className="mt-3 text-[18px] font-medium tracking-[0.36px] text-[#404040]">{api.authentication.title}</p>
            </div>
            <div className="rounded-[22px] bg-[#F2F3F5] px-6 py-5">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#8E8E8E]">Ambientes</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {api.environments.map((environment) => (
                  <span
                    key={environment}
                    className="inline-flex items-center rounded-full bg-white px-4 py-2 text-[14px] font-medium text-[#404040]"
                  >
                    {environment}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[22px] bg-[#141F25] px-6 py-5 text-white">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-white/60">Ideal para</p>
              <p className="mt-3 text-[18px] leading-8 tracking-[0.36px] text-white/88">
                Equipos que necesitan liquidez visible, conciliación rápida y automatización en sus flujos internos.
              </p>
            </div>
          </div>
        </DetailSectionCard>

        <DetailSectionCard eyebrow="Journey" title="Ruta de integración sugerida">
          <p className="text-[16px] leading-7 tracking-[0.32px] text-[#707070]">
            Una secuencia simple para validar la API, probar su flujo y dejar lista la salida a producción.
          </p>
          <div className="grid gap-4">
            {[
              "Solicite acceso y configure las credenciales del ambiente inicial.",
              "Valide saldos y movimientos en Sandbox usando los endpoints base.",
              "Integre trazabilidad, monitoreo y paso controlado a Producción.",
            ].map((step, index) => (
              <div key={step} className="flex gap-4 rounded-[22px] border border-[#D8DCE1] bg-[#FCFCFD] px-5 py-5">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E1251B] text-[14px] font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-[16px] leading-7 tracking-[0.32px] text-[#404040]">{step}</p>
              </div>
            ))}
          </div>
        </DetailSectionCard>
      </div>
    </section>
  );
}
