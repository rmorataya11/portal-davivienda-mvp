import Link from "next/link";
import { useTranslations } from "next-intl";

export function CtaBanner() {
  const t = useTranslations("Home.finalCta");

  return (
    <section className="pb-16">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col justify-center bg-[linear-gradient(89deg,#404040_0%,#0D0D0D_100%)] px-4 py-12 sm:px-6 lg:min-h-[409px] lg:px-[57px] lg:py-[64px] 2xl:px-[4vw]">
        <div className="w-full max-w-[720px]">
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
      </div>
    </section>
  );
}
