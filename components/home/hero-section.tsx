import { ActionLink } from "@/components/ui/action-link";

export function HeroSection() {
  return (
    <section id="inicio" className="relative overflow-hidden px-4 pb-10 pt-5 sm:px-6 lg:px-10">
      <div className="hero-scene relative mx-auto grid min-h-[720px] w-full max-w-[1366px] items-center overflow-hidden rounded-[24px] px-4 py-8 sm:px-8 lg:grid-cols-[0.94fr_1.06fr] lg:px-12">
        <div className="relative z-10 max-w-[560px] rounded-[32px] bg-white px-8 py-10 shadow-[0_24px_80px_rgba(20,31,37,0.12)] sm:px-10 sm:py-12">
          <p className="text-[17px] font-medium text-[#E1251B]">Open Banking Davivienda</p>
          <h1 className="mt-7 text-[40px] font-bold leading-[1.08] tracking-[-0.03em] text-[#404040] sm:text-[58px]">
            Conecte su negocio al ecosistema financiero y escale sus operaciones.
          </h1>
          <p className="mt-8 max-w-[440px] text-lg leading-8 text-[#404040]">
            Las APIs Davivienda le permiten procesar ventas, pagar a proveedores y conciliar saldos en tiempo real.
            Cree experiencias financieras únicas para sus clientes.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:max-w-[330px]">
            <ActionLink href="#crear-cuenta" className="w-full">
              Crear cuenta gratuita
            </ActionLink>
            <ActionLink href="#catalogo" variant="secondary" className="w-full">
              Explorar catálogo de APIs
            </ActionLink>
          </div>
        </div>

        <div className="relative hidden min-h-[520px] lg:block">
          <div className="absolute right-[5%] top-[12%] h-[300px] w-[220px] rounded-[26px] bg-white/38 shadow-[0_18px_60px_rgba(20,31,37,0.12)] backdrop-blur-[2px]" />
          <div className="absolute right-[11%] top-[18%] h-[250px] w-[180px] rounded-[18px] border border-white/55 bg-white/12" />
          <div className="absolute right-[20%] top-[18%] rotate-[-5deg] rounded-md bg-[#F5D3DB] px-4 py-2 text-xs font-semibold text-[#404040] shadow-md">
            Q3
          </div>
          <div className="absolute right-[13%] top-[29%] rotate-[7deg] rounded-md bg-[#D8F0FF] px-4 py-2 text-xs font-semibold text-[#404040] shadow-md">
            Nuevos leads
          </div>
          <div className="absolute bottom-[12%] left-[14%] h-[280px] w-[220px] rounded-t-[130px] rounded-b-[36px] bg-[linear-gradient(180deg,#EEE6DB_0%,#D8C1A9_48%,#6D4D33_100%)] opacity-85" />
          <div className="absolute bottom-[6%] left-[33%] h-[355px] w-[235px] rounded-t-[140px] rounded-b-[40px] bg-[linear-gradient(180deg,#F5F2ED_0%,#D6D0C8_44%,#56603E_100%)] shadow-[0_18px_50px_rgba(20,31,37,0.18)]" />
          <div className="absolute bottom-[2%] left-[50%] h-[260px] w-[170px] rounded-t-[110px] rounded-b-[28px] bg-[linear-gradient(180deg,#F8F6F2_0%,#D3CCC4_42%,#223857_100%)] opacity-95" />
        </div>
      </div>
    </section>
  );
}
