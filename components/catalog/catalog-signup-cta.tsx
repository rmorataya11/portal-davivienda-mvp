import Link from "next/link";
import { useTranslations } from "next-intl";

export function CatalogSignupCta() {
  const t = useTranslations("Catalog.signupCta");

  return (
    <section className="pb-16">
      <div className="flex min-h-[287px] w-full flex-col gap-8 bg-[linear-gradient(89deg,#404040_0%,#0D0D0D_100%)] px-4 py-10 sm:px-6 xl:flex-row xl:items-center xl:justify-between xl:gap-24 xl:px-[56px] xl:py-8 2xl:px-[4vw]">
        <div className="min-w-0 max-w-[691px]">
          <h2 className="text-[24px] font-bold leading-[1.2] tracking-[0.8px] text-white sm:text-[32px] xl:max-w-[596px] xl:text-[40px] xl:leading-[48px]">
            {t("title")}
          </h2>
          <p className="mt-3 text-[15px] font-light leading-6 tracking-[0.4px] text-white sm:mt-4 sm:text-[18px] xl:mt-[19px] xl:text-[20px] xl:leading-6">
            {t("descriptionLead")}
            <br className="hidden xl:block" /> {t("descriptionRest")}
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center xl:gap-8">
          <Link
            href="/crear-cuenta"
            className="inline-flex h-12 w-full items-center justify-center rounded-[30px] bg-[#E1251B] text-[15px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_36px_rgba(225,37,27,0.24)] sm:w-[204px]"
          >
            {t("createAccount")}
          </Link>
          <Link
            href="/iniciar-sesion"
            className="inline-flex h-12 w-full items-center justify-center rounded-[30px] border border-black bg-white text-[15px] font-medium text-black transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#F6F6F6] hover:shadow-[0_14px_28px_rgba(20,31,37,0.12)] sm:w-[209px]"
          >
            {t("signIn")}
          </Link>
        </div>
      </div>
    </section>
  );
}
