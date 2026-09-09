type DaviviendaLogoProps = {
  variant?: "navbar" | "footer" | "auth";
};

const sources = {
  navbar: "/logo/davivienda-white.png",
  footer: "/logo/davivienda.png",
  auth: "/logo/davivienda.png",
} as const;

const sizes = {
  navbar: "h-[22px] w-auto",
  footer: "h-auto w-[196px] object-contain object-left",
  auth: "h-auto w-[168px] object-contain object-left",
} as const;

export function DaviviendaLogo({ variant = "navbar" }: DaviviendaLogoProps) {
  return (
    <img
      src={sources[variant]}
      alt="Davivienda"
      width={196}
      height={19}
      className={sizes[variant]}
    />
  );
}
