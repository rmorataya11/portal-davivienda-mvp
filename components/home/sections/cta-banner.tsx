import { ActionLink } from "@/components/ui/action-link";

export function CtaBanner() {
  return (
    <section className="px-4 pb-16 pt-1 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1366px] overflow-hidden rounded-[2px] bg-[linear-gradient(90deg,#4B4B4B_0%,#2A2A2A_60%,#121212_100%)] px-6 py-12 sm:px-10 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-12">
        <div>
          <h2 className="max-w-[580px] text-[36px] font-bold leading-[1.16] text-white sm:text-[54px]">
            ¿Conversamos sobre su próxima idea?
          </h2>
          <p className="mt-6 max-w-[640px] text-lg leading-8 text-white/82">
            Encuentre el producto ideal para su negocio y dé el primer paso. Estamos listos para acompañarle.
          </p>
          <ActionLink href="#catalogo" className="mt-8 min-w-[230px]">
            Explorar productos
          </ActionLink>
        </div>

        <div className="relative mt-10 hidden min-h-[260px] lg:block">
          <div className="absolute right-12 top-1/2 h-[240px] w-[200px] -translate-y-1/2 rotate-[40deg] rounded-[42px] bg-[#D7E6F6]" />
          <div className="absolute right-[115px] top-1/2 h-[230px] w-[180px] -translate-y-1/2 rounded-t-[90px] rounded-b-[30px] bg-[linear-gradient(180deg,#F4F6F8_0%,#BFE6E5_45%,#6DB8B4_100%)] shadow-[0_12px_40px_rgba(0,0,0,0.16)]" />
          <div className="absolute right-4 top-[44px] flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[#E1251B] text-white shadow-[0_16px_36px_rgba(225,37,27,0.32)]">
            <span className="h-11 w-11 rounded-full border border-white/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
