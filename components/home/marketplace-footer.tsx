import Link from "next/link";

import { developerLinks, platformLinks, supportLinks } from "./data";

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="text-[20px] font-bold text-[#404040]">{title}</h3>
      <ul className="mt-7 space-y-6 text-[15px] text-[#404040]">
        {links.map((link) => (
          <li key={link}>
            <Link href="#">{link}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarketplaceFooter() {
  return (
    <footer id="soporte" className="border-t border-black/5 bg-white px-4 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1366px]">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.7fr_0.8fr_0.8fr]">
          <div className="max-w-[360px]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5B400] text-xs font-black text-[#870412]">
                D
              </div>
              <span className="text-[33px] font-medium tracking-[0.08em] text-[#E1251B]">DAVIVIENDA</span>
            </div>
            <p className="mt-7 text-[15px] leading-8 text-[#404040]">
              Plataforma de desarrolladores para el ecosistema Open Banking. Construya experiencias financieras seguras
              sobre infraestructura bancaria de grado empresarial.
            </p>
          </div>

          <FooterColumn title="Plataforma" links={platformLinks} />
          <FooterColumn title="Desarrolladores" links={developerLinks} />
          <FooterColumn title="Soporte" links={supportLinks} />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-black/8 pt-6 text-sm text-[#404040] sm:flex-row sm:justify-end sm:gap-10">
          <Link href="#terminos">Términos</Link>
          <Link href="#privacidad">Privacidad</Link>
          <Link href="#seguridad">Seguridad</Link>
        </div>
      </div>
    </footer>
  );
}
