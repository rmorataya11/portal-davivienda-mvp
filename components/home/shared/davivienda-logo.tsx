export function DaviviendaLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-5 w-5 shrink-0">
        <span className="absolute left-[1px] top-[7px] h-[10px] w-[15px] rounded-[999px] bg-[#F6B400]" />
        <span className="absolute left-[2px] top-[2px] h-[7px] w-[13px] rounded-t-[999px] rounded-b-[4px] bg-[#B30D14] rotate-[-8deg]" />
        <span className="absolute left-[9px] top-[3px] h-[9px] w-[8px] rounded-t-[999px] rounded-b-[3px] bg-[#E1251B] rotate-[20deg]" />
      </div>
      <span className="text-[13px] font-medium tracking-[0.22em] text-white">DAVIVIENDA</span>
    </div>
  );
}
