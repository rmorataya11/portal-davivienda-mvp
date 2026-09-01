export function AccountAvatar({
  name,
  size = "sm",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const classes =
    size === "lg" ? "h-16 w-16 text-[18px]" : size === "md" ? "h-10 w-10 text-[13px]" : "h-7 w-7 text-[11px]";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#E1251B] font-bold tracking-[0.4px] text-white ${classes}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
