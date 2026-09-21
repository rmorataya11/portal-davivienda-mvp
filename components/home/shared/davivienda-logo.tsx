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
  footer: "h-auto w-[302px] max-w-full object-contain object-left",
  auth: "h-auto w-[168px] object-contain object-left",
} as const;

const dimensions = {
  navbar: { width: 196, height: 22 },
  footer: { width: 302, height: 40 },
  auth: { width: 168, height: 22 },
} as const;

export function DaviviendaLogo({ variant = "navbar" }: DaviviendaLogoProps) {
  const { width, height } = dimensions[variant];

  return (
    <img
      src={sources[variant]}
      alt="Davivienda"
      width={width}
      height={height}
      className={sizes[variant]}
    />
  );
}
