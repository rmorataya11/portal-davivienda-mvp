import Link from "next/link";

export function HeroSection() {
  return (
    <section id="inicio" className="relative overflow-hidden pb-10">
      <div className="hero-scene relative mx-auto h-[810px] w-full max-w-[1366px] overflow-hidden">
        <div className="absolute left-14 top-[152px] z-10 h-[570px] w-[620px] rounded-[32px] bg-white shadow-[0_24px_80px_rgba(20,31,37,0.12)]">
          <p className="absolute left-[52px] top-9 w-[234px] text-left text-[20px] leading-6 font-normal tracking-[0.4px] text-[#E1251B]">
            Open Banking Davivienda
          </p>
          <h1 className="absolute left-[54px] top-[84px] w-[512px] text-left text-[49px] font-bold leading-[44px] tracking-[0.98px] text-[#404040]">
            Conecte su negocio al ecosistema financiero y escale sus operaciones.
          </h1>
          <p className="absolute left-[54px] top-[331px] w-[512px] text-left text-[20px] leading-6 font-normal tracking-[0.4px] text-[#404040]">
            Las APIs Davivienda le permiten procesar ventas, pagar a proveedores y conciliar saldos en tiempo real.
            Cree experiencias financieras únicas para sus clientes.
          </p>

          <Link
            href="#crear-cuenta"
            className="absolute left-[154px] top-[382px] inline-flex h-12 w-[313px] items-center justify-center rounded-[30px] bg-[#E1251B] text-[15px] font-semibold text-white"
          >
            Crear cuenta gratuita
          </Link>
          <Link
            href="#catalogo"
            className="absolute left-[154px] top-[462px] inline-flex h-12 w-[312px] items-center justify-center rounded-[30px] border border-[#2C2C2C] bg-white text-[15px] font-normal text-[#2C2C2C]"
          >
            Explorar catálogo de APIs
          </Link>
        </div>

        <div className="absolute inset-y-0 right-0 hidden w-[58%] lg:block">
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
