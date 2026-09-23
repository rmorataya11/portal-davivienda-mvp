import Link from "next/link";
import { useTranslations } from "next-intl";

import type { FooterLink, FooterMessageKey } from "../content/footer-links";

export function FooterColumn({ titleKey, links }: { titleKey: FooterMessageKey; links: FooterLink[] }) {
  const t = useTranslations("Footer");

  return (
    <div>
      <h3 className="text-[20px] font-bold text-[#404040]">{t(titleKey)}</h3>
      <ul className="mt-7 space-y-6 text-[15px] text-[#404040]">
        {links.map((link) => (
          <li key={link.key}>
            <Link href={link.href} className="transition-colors duration-300 hover:text-[#E1251B]">
              {t(link.key)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
