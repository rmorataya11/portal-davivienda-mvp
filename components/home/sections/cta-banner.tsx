import Link from "next/link";
import { useTranslations } from "next-intl";

export function CtaBanner() {
  const t = useTranslations("Home.finalCta");

  return (
    <section className="overflow-visible pb-16">
      <div className="relative mx-auto w-full max-w-[1920px] overflow-visible">
        {/* Franja refe: 1366 × 409 */}
        <div className="flex w-full items-center overflow-visible bg-[linear-gradient(89deg,#404040_0%,#0D0D0D_100%)] px-4 py-10 sm:px-6 lg:h-[409px] lg:px-[57px] lg:py-0 2xl:px-[4vw]">
          <div className="flex w-full flex-col items-start gap-10 overflow-visible lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="relative z-10 w-full max-w-[720px] shrink">
              <h2 className="text-[28px] font-bold leading-[1.16] tracking-[0.8px] text-white sm:text-[36px] lg:whitespace-normal xl:whitespace-nowrap xl:text-[40px] xl:leading-[48px]">
                {t("title")}
              </h2>
              <p className="mt-5 max-w-[640px] text-[16px] leading-7 text-white sm:text-[18px] sm:leading-8">
                {t("description")}
              </p>
              <Link
                href="/catalogo-apis"
                className="mt-8 inline-flex h-12 w-full max-w-[255px] items-center justify-center rounded-[30px] bg-[#E1251B] text-[14px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_40px_rgba(225,37,27,0.25)]"
              >
                {t("exploreProducts")}
              </Link>
            </div>

            <div className="relative mx-auto hidden w-[600px] shrink-0 overflow-visible sm:block lg:mx-0">
              <img
                src="/home/images/modelo_hombre.png"
                alt=""
                aria-hidden="true"
                className="relative z-0 h-auto w-[600px] max-w-none object-contain object-center"
              />
              {/* Sobre el hombro del modelo (el PNG tiene vacío a la derecha). */}
              <div
                className="absolute top-[26%] left-[60%] z-20 flex h-[107px] w-[107px] items-center justify-center rounded-full bg-[#E1251B]"
                aria-hidden="true"
              >
                <img
                  src="/home/icons/light_bulb.svg"
                  alt=""
                  className="h-[76%] w-[76%] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
