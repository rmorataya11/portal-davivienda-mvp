import Link from "next/link";

export function HeroSection() {
  return (
    <section id="inicio" className="relative overflow-hidden pb-10 pt-[104px] sm:pt-[120px] lg:pt-0">
      <div className="hero-scene relative mx-auto w-full max-w-[1366px] overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:h-[810px] lg:px-0 lg:py-0">
        <div className="z-10 flex w-full max-w-[620px] flex-col rounded-[28px] bg-white px-6 pb-8 pt-8 shadow-[0_24px_80px_rgba(20,31,37,0.12)] transition-shadow duration-300 ease-out hover:shadow-[0_28px_96px_rgba(20,31,37,0.16)] sm:px-9 sm:pb-10 lg:absolute lg:left-14 lg:top-[152px] lg:h-[570px] lg:w-[620px] lg:rounded-[32px] lg:px-[52px] lg:pb-[48px] lg:pt-9">
          <p className="w-full max-w-[234px] text-left text-[16px] leading-6 font-normal tracking-[0.4px] text-[#E1251B] sm:text-[20px]">
            Open Banking Davivienda
          </p>
          <h1 className="mt-3 max-w-[512px] text-left text-[28px] font-bold leading-[1.1] tracking-[0.02em] text-[#404040] sm:text-[40px] lg:text-[49px] lg:leading-[44px] lg:tracking-[0.98px]">
            Conecte su negocio al ecosistema financiero y escale sus operaciones.
          </h1>
          <p className="mt-6 max-w-[512px] text-left text-[16px] leading-7 font-normal tracking-[0.02em] text-[#404040] sm:mt-8 sm:text-[18px] lg:mt-[54px] lg:text-[20px] lg:leading-6 lg:tracking-[0.4px]">
            Las APIs Davivienda le permiten procesar ventas, pagar a proveedores y conciliar saldos en tiempo real.
            Cree experiencias financieras únicas para sus clientes.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-4 sm:gap-5 lg:mt-auto lg:items-center lg:gap-8">
            <Link
              href="/crear-cuenta"
              className="inline-flex h-12 w-full items-center justify-center rounded-[30px] bg-[#E1251B] text-[15px] font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] hover:shadow-[0_16px_38px_rgba(225,37,27,0.28)] sm:w-[313px]"
            >
              Crear cuenta gratuita
            </Link>
            <Link
              href="#catalogo"
              className="inline-flex h-12 w-full items-center justify-center rounded-[30px] border border-[#2C2C2C] bg-white text-[15px] font-normal text-[#2C2C2C] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#404040] hover:bg-[#F7F7F7] hover:shadow-[0_14px_30px_rgba(20,31,37,0.1)] sm:w-[312px]"
            >
              Explorar catálogo de APIs
            </Link>
          </div>
        </div>

        <div className="pointer-events-none hidden lg:absolute lg:inset-y-0 lg:right-0 lg:block lg:w-[58%]">
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
