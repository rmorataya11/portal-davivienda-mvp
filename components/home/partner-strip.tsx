import { partnerLogos } from "./data";

export function PartnerStrip() {
  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1366px]">
        <div className="mx-auto rounded-[32px] bg-white px-8 py-8 shadow-[0_12px_38px_rgba(20,31,37,0.06)] sm:px-12 sm:py-10">
          <p className="text-lg text-[#B1B1B1]">Impulsando desde startups tecnológicas hasta grandes corporativos</p>
          <div className="mt-7 grid gap-8 text-center text-[28px] font-medium text-[#5B5B5B] sm:grid-cols-2 lg:grid-cols-4 lg:text-left">
            {partnerLogos.map((logo) => (
              <div
                key={logo}
                className={`flex items-center justify-center ${logo === "The Coffee Cup" ? "font-serif italic tracking-wide" : ""}`}
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
