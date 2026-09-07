type DaviviendaLogoProps = {
  variant?: "navbar" | "footer";
};

const sources = {
  navbar: "/logo/davivienda-white.png",
  footer: "/logo/davivienda.png",
} as const;

export function DaviviendaLogo({ variant = "navbar" }: DaviviendaLogoProps) {
  return (
    <img
      src={sources[variant]}
      alt="Davivienda"
      width={196}
      height={19}
      className={
        variant === "navbar" ? "h-[22px] w-auto" : "h-auto w-[196px] object-contain object-left"
      }
    />
  );
}
