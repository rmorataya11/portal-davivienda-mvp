import Link from "next/link";

const hrefByLabel: Record<string, string> = {
  Inicio: "/",
  "Casos de uso": "/#casos-de-uso",
  "Catálogo de APIs": "/catalogo-apis",
  Documentación: "/#documentacion",
  Soporte: "/soporte",
  "Crear una cuenta": "/crear-cuenta",
  "Iniciar sesión": "/iniciar-sesion",
  Sandbox: "/dashboard",
  "Documentación técnica": "/#documentacion",
  "Centro de ayuda": "/soporte#preguntas-frecuentes",
  "Contactar con un experto": "/soporte#soporte-prioritario",
  "Preguntas frecuentes": "/soporte#preguntas-frecuentes",
};

export function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="text-[20px] font-bold text-[#404040]">{title}</h3>
      <ul className="mt-7 space-y-6 text-[15px] text-[#404040]">
        {links.map((link) => (
          <li key={link}>
            <Link href={hrefByLabel[link] ?? "#"} className="transition-colors duration-300 hover:text-[#E1251B]">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
