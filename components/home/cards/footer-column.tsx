import Link from "next/link";

export function FooterColumn({ title, links }: { title: string; links: string[] }) {
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
