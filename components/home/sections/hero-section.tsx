import Link from "next/link";

export function HeroSection() {
  return (
    <section id="inicio" className="relative overflow-hidden pb-10 pt-[104px] sm:pt-[120px] lg:pt-0">
      <div className="hero-scene relative mx-auto w-full max-w-[1366px] overflow-hidden px-4 py-6 sm:px-6 sm:py-8 xl:min-h-[680px] xl:px-8 xl:py-0 2xl:h-[810px] 2xl:px-0">
        <div className="z-10 flex w-full max-w-[620px] flex-col rounded-[28px] bg-white px-8 pb-5 pt-7 shadow-[0_24px_80px_rgba(20,31,37,0.12)] transition-shadow duration-300 ease-out hover:shadow-[0_28px_96px_rgba(20,31,37,0.16)] sm:px-10 sm:pb-6 sm:pt-7 xl:absolute xl:left-10 xl:top-[128px] xl:w-[560px] xl:rounded-[32px] xl:px-10 xl:pb-8 xl:pt-8 2xl:left-14 2xl:top-[152px] 2xl:h-[530px] 2xl:w-[620px] 2xl:px-[52px] 2xl:pb-[36px] 2xl:pt-9">
          <p className="text-left text-[16px] leading-6 font-normal tracking-[0.4px] text-[#E1251B] sm:text-[20px]">
            Open Banking Davivienda
          </p>
          <h1 className="mt-6 max-w-[396px] text-left text-[28px] font-bold leading-[1.14] tracking-[0.4px] text-[#404040] sm:max-w-[430px] sm:text-[34px] sm:leading-[1.12] sm:tracking-[0.6px] xl:max-w-[460px] xl:text-[36px] xl:leading-[1.12] 2xl:max-w-[512px] 2xl:text-[40px] 2xl:leading-[44px] 2xl:tracking-[0.8px]">
            Conecte su negocio al ecosistema financiero y escale sus operaciones.
          </h1>
          <p className="mt-[23px] max-w-[396px] text-left text-[16px] leading-6 font-normal tracking-[0.4px] text-[#404040] sm:max-w-[430px] sm:text-[18px] xl:max-w-[460px] 2xl:mt-6 2xl:max-w-[512px] 2xl:text-[20px] 2xl:leading-6">
            Las APIs Davivienda le permiten procesar ventas, pagar a proveedores y conciliar saldos en tiempo real.
            Cree experiencias financieras únicas para sus clientes.
          </p>
          <div className="mt-12 flex flex-col items-stretch gap-5 xl:mt-8 xl:items-center xl:gap-6 2xl:mt-9 2xl:gap-7">
            <Link
              href="/crear-cuenta"
              className="inline-flex h-12 w-full max-w-[342px] self-center items-center justify-center rounded-[30px] bg-[#E1251B] text-[16px] font-bold tracking-[0.36px] text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_38px_rgba(225,37,27,0.28)] sm:text-[18px] xl:w-[300px] xl:max-w-none 2xl:w-[313px]"
            >
              Crear cuenta gratuita
            </Link>
            <Link
              href="#catalogo"
              className="inline-flex h-12 w-full max-w-[342px] self-center items-center justify-center rounded-[30px] border border-[#2C2C2C] bg-white text-[16px] font-normal tracking-[0.36px] text-[#2C2C2C] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#404040] hover:bg-[#F7F7F7] hover:shadow-[0_14px_30px_rgba(20,31,37,0.1)] sm:text-[18px] xl:w-[300px] xl:max-w-none 2xl:w-[313px]"
            >
              Explorar catálogo de APIs
            </Link>
          </div>
        </div>

        <div className="pointer-events-none hidden xl:absolute xl:inset-y-0 xl:right-0 xl:block xl:w-[52%] 2xl:w-[58%]">
          <div className="absolute right-[9%] top-[17%] h-[320px] w-[240px] rounded-[26px] bg-white/34 shadow-[0_18px_60px_rgba(20,31,37,0.12)] backdrop-blur-[2px]" />
          <div className="absolute right-[15%] top-[23%] h-[272px] w-[188px] rounded-[18px] border border-white/55 bg-white/10" />
          <div className="absolute right-[24%] top-[22%] rotate-[-5deg] rounded-md bg-[#F5D3DB] px-4 py-2 text-xs font-semibold text-[#404040] shadow-md">
            Q3
          </div>
          <div className="absolute right-[17%] top-[34%] rotate-[7deg] rounded-md bg-[#D8F0FF] px-4 py-2 text-xs font-semibold text-[#404040] shadow-md">
            Nuevos leads
          </div>
          <div className="absolute bottom-[10%] left-[8%] h-[330px] w-[230px] rounded-t-[130px] rounded-b-[36px] bg-[linear-gradient(180deg,#EEE6DB_0%,#D8C1A9_48%,#6D4D33_100%)] opacity-85" />
          <div className="absolute bottom-[5%] left-[31%] h-[420px] w-[260px] rounded-t-[150px] rounded-b-[42px] bg-[linear-gradient(180deg,#F5F2ED_0%,#D6D0C8_44%,#56603E_100%)] shadow-[0_18px_50px_rgba(20,31,37,0.18)]" />
          <div className="absolute bottom-0 left-[51%] h-[300px] w-[188px] rounded-t-[120px] rounded-b-[30px] bg-[linear-gradient(180deg,#F8F6F2_0%,#D3CCC4_42%,#223857_100%)] opacity-95" />
        </div>
      </div>
    </section>
  );
}
